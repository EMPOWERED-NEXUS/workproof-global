import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  __sessionRefreshTestUtils,
  api,
  buildCanonicalProofUrl,
  NetworkError,
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

describe("canonical public proof client behavior", () => {
  const fetchMock = vi.fn<(input: RequestInfo | URL, init?: RequestInit) => Promise<MockResponse>>();

  beforeEach(() => {
    __sessionRefreshTestUtils.reset();
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
    vi.stubEnv("VITE_PUBLIC_WEB_URL", "https://workproof.empowerednexus.com");
  });

  afterEach(() => {
    __sessionRefreshTestUtils.reset();
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("builds canonical proof URLs without trailing slash or host drift", () => {
    expect(buildCanonicalProofUrl("WPG-3C2F6ASR")).toBe(
      "https://workproof.empowerednexus.com/proof/WPG-3C2F6ASR",
    );
    expect(buildCanonicalProofUrl("/WPG-3C2F6ASR/")).toBe(
      "https://workproof.empowerednexus.com/proof/WPG-3C2F6ASR",
    );
  });

  it("public proof API never invokes auth refresh", async () => {
    const onExpired = vi.fn();
    setSessionExpiredHandler(onExpired);
    fetchMock.mockResolvedValueOnce(
      jsonResponse(401, { success: false, message: "Authentication required." }),
    );

    await expect(api.getPublicProof("WPG-DEMO")).rejects.toMatchObject({
      message: "Authentication required.",
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(String(fetchMock.mock.calls[0]?.[0])).toMatch(/\/public\/receipts\/WPG-DEMO$/);
    expect(
      fetchMock.mock.calls.some(([input]) => String(input).includes("/auth/refresh")),
    ).toBe(false);
    expect(onExpired).not.toHaveBeenCalled();
  });

  it("network failure on GET retries once and does not clear session", async () => {
    const onExpired = vi.fn();
    setSessionExpiredHandler(onExpired);
    fetchMock
      .mockRejectedValueOnce(new TypeError("Failed to fetch"))
      .mockResolvedValueOnce(
        jsonResponse(200, {
          success: true,
          data: {
            serviceTitle: "Cupboard",
            proofValidity: "VALID",
            status: "VERIFIED",
            verificationStatus: "VERIFIED",
            workerName: "Worker",
            workDate: "2026-08-01",
            skillsDemonstrated: [],
            evidence: [],
          },
        }),
      );

    const proof = await api.getPublicProof("WPG-DEMO");
    expect(proof.serviceTitle).toBe("Cupboard");
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(onExpired).not.toHaveBeenCalled();
  });

  it("persistent network failure surfaces NetworkError without session clear", async () => {
    const onExpired = vi.fn();
    setSessionExpiredHandler(onExpired);
    fetchMock.mockRejectedValue(new TypeError("Failed to fetch"));

    await expect(api.getPublicProof("WPG-DEMO")).rejects.toBeInstanceOf(NetworkError);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(onExpired).not.toHaveBeenCalled();
  });
});
