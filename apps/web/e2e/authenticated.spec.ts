import { expect, test, type Page } from '@playwright/test';

const emptyPage = { items: [], pagination: { page: 1, limit: 50, total: 0, totalPages: 0 } };

const workerUser = {
  id: 'worker-1',
  email: 'worker@example.test',
  fullName: 'Test Worker',
  role: 'WORKER' as const,
  status: 'ACTIVE',
  emailVerified: false,
  emailVerifiedAt: null,
};

const adminUser = {
  id: 'admin-1',
  email: 'admin@example.test',
  fullName: 'Test Admin',
  role: 'ADMIN' as const,
  status: 'ACTIVE',
  emailVerified: true,
  emailVerifiedAt: '2026-01-01T00:00:00.000Z',
};

function json(data: unknown, status = 200) {
  return {
    status,
    contentType: 'application/json',
    body: JSON.stringify({ success: true, data }),
  };
}

async function mockAuthMe(page: Page, user: typeof workerUser | typeof adminUser) {
  await page.route('**/api/v1/auth/me', async (route) => {
    await route.fulfill(json(user));
  });
}

async function mockWorkerApis(page: Page) {
  await mockAuthMe(page, workerUser);

  await page.route('**/api/v1/auth/email-verification-status', async (route) => {
    await route.fulfill(
      json({
        email: workerUser.email,
        emailVerified: false,
        emailVerifiedAt: null,
        resendAvailableInSeconds: 0,
        resendCooldownSeconds: 60,
      }),
    );
  });

  await page.route('**/api/v1/dashboard/worker', async (route) => {
    await route.fulfill(
      json({
        totalReceipts: 0,
        verifiedReceipts: 0,
        pendingReceipts: 0,
        disputedReceipts: 0,
        verificationRate: 0,
        repeatCustomerCount: 0,
        recentReceipts: [],
        skillsDemonstrated: [],
        monthlyActivity: [],
        totalVerifiedIncome: 0,
        currency: 'XAF',
      }),
    );
  });

  await page.route('**/api/v1/profile', async (route) => {
    if (route.request().method() !== 'GET') {
      await route.fallback();
      return;
    }
    await route.fulfill(
      json({
        id: 'profile-1',
        headline: null,
        bio: null,
        location: null,
        phone: null,
        skills: [],
        profileSlug: 'test-worker',
      }),
    );
  });

  await page.route('**/api/v1/receipts**', async (route) => {
    if (route.request().method() !== 'GET') {
      await route.fallback();
      return;
    }
    await route.fulfill(json(emptyPage));
  });
}

async function mockAdminApis(page: Page) {
  await mockAuthMe(page, adminUser);

  await page.route('**/api/v1/admin/users**', async (route) => {
    await route.fulfill(
      json({
        items: [
          {
            id: 'user-2',
            email: 'worker@example.test',
            fullName: 'Active Worker',
            role: 'WORKER',
            status: 'ACTIVE',
          },
        ],
        pagination: { page: 1, limit: 50, total: 1, totalPages: 1 },
      }),
    );
  });

  await page.route('**/api/v1/admin/receipts**', async (route) => {
    await route.fulfill(
      json({
        items: [
          {
            id: 'receipt-1',
            serviceTitle: 'Garden tidy',
            description: 'Weekly tidy',
            customerName: 'Customer',
            customerEmail: 'customer@example.test',
            workDate: '2026-07-01',
            currency: 'XAF',
            skillsDemonstrated: [],
            status: 'VERIFIED',
            visibility: 'PUBLIC',
            worker: { fullName: 'Active Worker', email: 'worker@example.test' },
          },
        ],
        pagination: { page: 1, limit: 50, total: 1, totalPages: 1 },
      }),
    );
  });

  await page.route('**/api/v1/admin/disputes**', async (route) => {
    await route.fulfill(json(emptyPage));
  });

  await page.route('**/api/v1/admin/users/*/status', async (route) => {
    await new Promise((r) => setTimeout(r, 400));
    await route.fulfill(
      json({
        id: 'user-2',
        email: 'worker@example.test',
        fullName: 'Active Worker',
        role: 'WORKER',
        status: 'SUSPENDED',
      }),
    );
  });
}

test.describe('authenticated surfaces (mocked)', () => {
  test('worker dashboard shows onboarding checklist', async ({ page }) => {
    await mockWorkerApis(page);
    await page.goto('/dashboard');

    await expect(page.getByRole('heading', { name: /welcome, test worker/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Getting started' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Complete your public profile' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Create your first receipt' })).toBeVisible();
  });

  test('receipts page shows filter toolbar', async ({ page }) => {
    await mockWorkerApis(page);
    await page.goto('/receipts');

    await expect(page.getByRole('heading', { name: 'Work receipts' })).toBeVisible();
    const filters = page.locator('.filter-toolbar');
    await expect(filters).toBeVisible();
    await expect(
      filters.getByRole('textbox', { name: /search by service title or customer name/i }),
    ).toBeVisible();
    await expect(filters.locator('select')).toHaveCount(2);
    await expect(filters.getByRole('button', { name: 'Clear filters' })).toBeVisible();
  });

  test('admin page shows Suspend/Revoke confirmations and pending disable', async ({ page }) => {
    await mockAdminApis(page);
    await page.goto('/admin');

    await expect(page.getByRole('heading', { name: 'Administration' })).toBeVisible();

    await page.getByRole('button', { name: 'Suspend' }).click();
    const suspendDialog = page.getByRole('dialog', { name: 'Suspend this user?' });
    await expect(suspendDialog).toBeVisible();
    await expect(suspendDialog.getByRole('button', { name: 'Suspend user' })).toBeEnabled();

    await suspendDialog.getByRole('button', { name: 'Suspend user' }).click();
    await expect(suspendDialog.getByRole('button', { name: 'Working…' })).toBeDisabled();
    await expect(suspendDialog).toBeHidden({ timeout: 10_000 });

    await page.getByRole('button', { name: 'Revoke' }).click();
    const revokeDialog = page.getByRole('dialog', { name: 'Revoke verified receipt?' });
    await expect(revokeDialog).toBeVisible();
    await expect(revokeDialog.getByRole('button', { name: 'Revoke receipt' })).toBeVisible();
  });
});
