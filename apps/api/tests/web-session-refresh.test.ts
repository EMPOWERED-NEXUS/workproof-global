import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  __sessionRefreshTestUtils,
  api,
  SESSION_EXPIRED_MESSAGE,
  setSessionExpiredHandler,
} from "../../web/src/lib/api";

type MockResponse = {
  ok: boolean;
  status: number;
  json: () => Promise<unknown>;
};

function jsonResponse(status: number, body: unknown): MockResponse {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  };
}

describe("web session refresh client", () => {
  const fetchMock = vi.fn<(input: RequestInfo | URL, init?: RequestInit) => Promise<MockResponse>>();

  beforeEach(() => {
    __sessionRefreshTestUtils.reset();
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    __sessionRefreshTestUtils.reset();
    vi.unstubAllGlobals();
  });

  it("401 triggers one refresh and retries the original request successfully", async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse(401, { success: false, message: "Authentication required." }))
      .mockResolvedValueOnce(jsonResponse(200, { success: true, data: { message: "Session refreshed." } }))
      .mockResolvedValueOnce(
        jsonResponse(200, {
          success: true,
          data: { items: [], pagination: { page: 1, limit: 50, total: 0, totalPages: 0 } },
        }),
      );

    const result = await api.listReceipts();

    expect(result.items).toEqual([]);
    expect(fetchMock).toHaveBeenCalledTimes(3);

    const paths = fetchMock.mock.calls.map(([input]) => String(input));
    expect(paths[0]).toMatch(/\/receipts$/);
    expect(paths[1]).toMatch(/\/auth\/refresh$/);
    expect(paths[2]).toMatch(/\/receipts$/);

    const refreshInit = fetchMock.mock.calls[1]?.[1];
    expect(refreshInit?.method).toBe("POST");
    expect(refreshInit?.credentials).toBe("include");
  });

  it("simultaneous 401 responses share one refresh request", async () => {
    let resolveRefresh: ((value: MockResponse) => void) | undefined;
    const refreshGate = new Promise<MockResponse>((resolve) => {
      resolveRefresh = resolve;
    });

    let receiptCalls = 0;
    fetchMock.mockImplementation(async (input) => {
      const url = String(input);
      if (url.includes("/auth/refresh")) {
        return refreshGate;
      }
      if (url.includes("/receipts")) {
        receiptCalls += 1;
        if (receiptCalls <= 2) {
          return jsonResponse(401, { success: false, message: "Authentication required." });
        }
        return jsonResponse(200, {
          success: true,
          data: { items: [], pagination: { page: 1, limit: 50, total: 0, totalPages: 0 } },
        });
      }
      return jsonResponse(500, { success: false, message: "Unexpected" });
    });

    const pendingA = api.listReceipts("?a=1");
    const pendingB = api.listReceipts("?b=1");

    // Both protected calls should be waiting on the same in-flight refresh.
    await vi.waitFor(() => {
      expect(__sessionRefreshTestUtils.getRefreshInFlight()).toBeTruthy();
    });

    const refreshCallsBefore = fetchMock.mock.calls.filter(([input]) =>
      String(input).includes("/auth/refresh"),
    ).length;
    expect(refreshCallsBefore).toBe(1);

    resolveRefresh?.(jsonResponse(200, { success: true, data: { message: "Session refreshed." } }));

    const [a, b] = await Promise.all([pendingA, pendingB]);
    expect(a.items).toEqual([]);
    expect(b.items).toEqual([]);

    const refreshCalls = fetchMock.mock.calls.filter(([input]) =>
      String(input).includes("/auth/refresh"),
    );
    expect(refreshCalls).toHaveLength(1);
  });

  it("failed refresh ends the cached session", async () => {
    const onExpired = vi.fn();
    setSessionExpiredHandler(onExpired);

    fetchMock
      .mockResolvedValueOnce(jsonResponse(401, { success: false, message: "Authentication required." }))
      .mockResolvedValueOnce(jsonResponse(401, { success: false, message: "Refresh token required." }));

    await expect(api.listReceipts()).rejects.toMatchObject({
      message: SESSION_EXPIRED_MESSAGE,
    });

    expect(onExpired).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(String(fetchMock.mock.calls[1]?.[0])).toMatch(/\/auth\/refresh$/);
  });

  it("refresh endpoint is never recursively refreshed", async () => {
    const onExpired = vi.fn();
    setSessionExpiredHandler(onExpired);

    fetchMock
      .mockResolvedValueOnce(jsonResponse(401, { success: false, message: "Authentication required." }))
      .mockResolvedValueOnce(jsonResponse(401, { success: false, message: "Refresh token required." }));

    await expect(api.me()).rejects.toMatchObject({ message: SESSION_EXPIRED_MESSAGE });

    const refreshCalls = fetchMock.mock.calls.filter(([input]) =>
      String(input).includes("/auth/refresh"),
    );
    expect(refreshCalls).toHaveLength(1);
    expect(onExpired).toHaveBeenCalledTimes(1);

    // Auth endpoints that issue credentials must not enter the refresh flow.
    for (const [label, invoke] of [
      ["login", () => api.login({ email: "a@b.com", password: "x" })],
      ["register", () =>
        api.register({
          email: "a@b.com",
          password: "SecurePass1",
          fullName: "A",
          role: "WORKER",
          acceptTerms: true,
          acceptPrivacy: true,
        }),
      ],
      ["forgot-password", () => api.forgotPassword("a@b.com")],
      ["reset-password", () => api.resetPassword("token", "SecurePass1")],
    ] as const) {
      fetchMock.mockReset();
      onExpired.mockClear();
      fetchMock.mockResolvedValueOnce(jsonResponse(401, { success: false, message: `${label} failed` }));
      await expect(invoke()).rejects.toMatchObject({ message: `${label} failed` });
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(
        fetchMock.mock.calls.some(([input]) => String(input).includes("/auth/refresh")),
      ).toBe(false);
      expect(onExpired).not.toHaveBeenCalled();
    }
  });

  it("non-401 errors are not retried", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(500, { success: false, message: "Server error" }));

    await expect(api.listReceipts()).rejects.toMatchObject({ message: "Server error" });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("original request is retried only once", async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse(401, { success: false, message: "Authentication required." }))
      .mockResolvedValueOnce(jsonResponse(200, { success: true, data: { message: "Session refreshed." } }))
      .mockResolvedValueOnce(jsonResponse(401, { success: false, message: "Authentication required." }));

    await expect(api.listReceipts()).rejects.toMatchObject({
      message: "Authentication required.",
    });

    expect(fetchMock).toHaveBeenCalledTimes(3);
    const paths = fetchMock.mock.calls.map(([input]) => String(input));
    expect(paths.filter((p) => p.includes("/auth/refresh"))).toHaveLength(1);
    expect(paths.filter((p) => p.includes("/receipts"))).toHaveLength(2);
  });

  it("network failure during refresh does not clear the session", async () => {
    const onExpired = vi.fn();
    setSessionExpiredHandler(onExpired);

    fetchMock
      .mockResolvedValueOnce(jsonResponse(401, { success: false, message: "Authentication required." }))
      .mockRejectedValueOnce(new TypeError("Failed to fetch"));

    await expect(api.listReceipts()).rejects.toMatchObject({
      name: "NetworkError",
    });
    expect(onExpired).not.toHaveBeenCalled();
  });
});
