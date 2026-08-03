import { expect, test, type Page } from '@playwright/test';

const emptyPage = { items: [], pagination: { page: 1, limit: 50, total: 0, totalPages: 0 } };

const workerUser = {
  id: 'worker-1',
  email: 'worker@example.test',
  fullName: 'Test Worker',
  role: 'WORKER' as const,
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

async function mockWorkerSession(page: Page) {
  await page.route('**/api/v1/auth/me', async (route) => {
    await route.fulfill(json(workerUser));
  });
  await page.route('**/api/v1/auth/email-verification-status', async (route) => {
    await route.fulfill(
      json({
        email: workerUser.email,
        emailVerified: true,
        emailVerifiedAt: workerUser.emailVerifiedAt,
        resendAvailableInSeconds: 0,
        resendCooldownSeconds: 60,
      }),
    );
  });
  await page.route('**/api/v1/dashboard/worker', async (route) => {
    await route.fulfill(
      json({
        totalReceipts: 2,
        verifiedReceipts: 1,
        pendingReceipts: 1,
        disputedReceipts: 0,
        verificationRate: 50,
        repeatCustomerCount: 0,
        recentReceipts: [
          {
            id: 'r1',
            serviceTitle: 'Garden tidy',
            description: 'Weekly tidy',
            customerName: 'Ada',
            customerEmail: 'ada@example.test',
            workDate: '2026-07-01',
            currency: 'XAF',
            skillsDemonstrated: ['Landscaping'],
            status: 'VERIFIED',
            visibility: 'PUBLIC',
          },
        ],
        skillsDemonstrated: ['Landscaping'],
        monthlyActivity: [],
        totalVerifiedIncome: 25000,
        currency: 'XAF',
      }),
    );
  });
  await page.route('**/api/v1/profile', async (route) => {
    if (route.request().method() === 'PATCH') {
      const body = route.request().postDataJSON() as Record<string, unknown>;
      await route.fulfill(
        json({
          id: 'profile-1',
          headline: body.headline ?? 'Tailor',
          bio: body.bio ?? 'Experienced tailor',
          location: body.location ?? 'Douala',
          phone: body.phone ?? '',
          skills: body.skills ?? ['Alterations'],
          profileSlug: 'test-worker',
        }),
      );
      return;
    }
    await route.fulfill(
      json({
        id: 'profile-1',
        headline: 'Tailor',
        bio: 'Experienced tailor',
        location: 'Douala',
        phone: '',
        skills: ['Alterations'],
        profileSlug: 'test-worker',
      }),
    );
  });
  await page.route('**/api/v1/receipts**', async (route) => {
    if (route.request().method() !== 'GET') {
      await route.fallback();
      return;
    }
    const url = new URL(route.request().url());
    const status = url.searchParams.get('status');
    const items =
      status === 'VERIFIED'
        ? [
            {
              id: 'r1',
              serviceTitle: 'Garden tidy',
              description: 'Weekly tidy',
              customerName: 'Ada',
              customerEmail: 'ada@example.test',
              workDate: '2026-07-01',
              currency: 'XAF',
              skillsDemonstrated: ['Landscaping'],
              status: 'VERIFIED',
              visibility: 'PUBLIC',
            },
          ]
        : [
            {
              id: 'r1',
              serviceTitle: 'Garden tidy',
              description: 'Weekly tidy',
              customerName: 'Ada',
              customerEmail: 'ada@example.test',
              workDate: '2026-07-01',
              currency: 'XAF',
              skillsDemonstrated: ['Landscaping'],
              status: 'VERIFIED',
              visibility: 'PUBLIC',
            },
            {
              id: 'r2',
              serviceTitle: 'Fence repair',
              description: 'Repair',
              customerName: 'Baba',
              customerEmail: 'baba@example.test',
              workDate: '2026-07-10',
              currency: 'XAF',
              skillsDemonstrated: ['Carpentry'],
              status: 'DRAFT',
              visibility: 'PRIVATE',
            },
          ];
    await route.fulfill(
      json({
        items,
        pagination: { page: 1, limit: 50, total: items.length, totalPages: 1 },
      }),
    );
  });
}

test.describe('presentation polish', () => {
  test('mobile navigation opens and closes without horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 });
    await page.goto('/');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    expect(overflow).toBe(false);

    const menu = page.getByRole('button', { name: /menu/i });
    await menu.click();
    await expect(menu).toHaveAttribute('aria-expanded', 'true');
    await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Sign in' }).click();
    await expect(page).toHaveURL(/\/login$/);
    await expect(menu).toHaveAttribute('aria-expanded', 'false');
  });

  test('registration layout shows live password requirements', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/register');
    await expect(page.getByRole('heading', { name: 'Create your work profile' })).toBeVisible();
    await expect(page.getByText('At least 8 characters')).toBeVisible();
    await page.getByLabel('Password').fill('ValidPass1');
    await expect(page.locator('#password-requirements li.ok')).toHaveCount(4);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    expect(overflow).toBe(false);
  });

  test('dashboard hierarchy order is alert, welcome, onboarding, portfolio, activity, next step', async ({
    page,
  }) => {
    await mockWorkerSession(page);
    // Force incomplete onboarding by returning incomplete profile on this route mix
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
    await page.route('**/api/v1/auth/me', async (route) => {
      await route.fulfill(json({ ...workerUser, emailVerified: false, emailVerifiedAt: null }));
    });

    await page.goto('/dashboard');
    await expect(page.getByRole('heading', { name: /welcome, test worker/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Getting started' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Portfolio' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Recent activity' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Next step' })).toBeVisible();

    const headings = await page.locator('main h1, main h2').allTextContents();
    const welcomeIdx = headings.findIndex((h) => /welcome/i.test(h));
    const startedIdx = headings.findIndex((h) => /getting started/i.test(h));
    const portfolioIdx = headings.findIndex((h) => /portfolio/i.test(h));
    const recentIdx = headings.findIndex((h) => /recent activity/i.test(h));
    const nextIdx = headings.findIndex((h) => /next step/i.test(h));
    expect(welcomeIdx).toBeGreaterThanOrEqual(0);
    expect(startedIdx).toBeGreaterThan(welcomeIdx);
    expect(portfolioIdx).toBeGreaterThan(startedIdx);
    expect(recentIdx).toBeGreaterThan(portfolioIdx);
    expect(nextIdx).toBeGreaterThan(recentIdx);
  });

  test('receipt filtering updates results', async ({ page }) => {
    await mockWorkerSession(page);
    await page.goto('/receipts');
    await expect(page.getByRole('heading', { name: 'Work receipts' })).toBeVisible();
    await expect(page.getByText('Garden tidy')).toBeVisible();
    await expect(page.getByText('Fence repair')).toBeVisible();

    await page.locator('.filter-toolbar select').first().selectOption('VERIFIED');
    await expect(page.getByText('Garden tidy')).toBeVisible();
    await expect(page.getByText('Fence repair')).toHaveCount(0);
    await expect(page.locator('.result-meta')).toContainText('1 result');
  });

  test('profile editing shows preview and saves', async ({ page }) => {
    await mockWorkerSession(page);
    await page.goto('/profile');
    await expect(page.getByText('Public profile preview')).toBeVisible();
    await page.getByLabel('Headline').fill('Master tailor');
    await page.getByRole('button', { name: 'Save profile' }).click();
    await expect(page.getByRole('alert')).toContainText(/profile saved/i);
    await expect(page.getByRole('heading', { name: 'Account deletion' })).toBeVisible();
  });

  test('public proof shows invalid state without private customer fields', async ({ page }) => {
    await page.route('**/api/v1/public/receipts/demo-code', async (route) => {
      await route.fulfill(
        json({
          receiptNumber: 'WP-1',
          workerName: 'Test Worker',
          profileSlug: 'test-worker',
          serviceTitle: 'Garden tidy',
          description: 'Weekly tidy',
          workDate: '2026-07-01',
          skillsDemonstrated: ['Landscaping'],
          verifiedAt: null,
          verificationStatus: 'REVOKED',
          proofValidity: 'INVALID_REVOKED',
          status: 'REVOKED',
          revokedAt: '2026-07-15T00:00:00.000Z',
          revocationReason: 'Admin review',
          evidence: [],
        }),
      );
    });
    await page.goto('/proof/demo-code');
    await expect(page.locator('.proof-seal.invalid')).toHaveText('Not valid proof');
    await expect(page.getByRole('alert')).toContainText(/revoked/i);
    await expect(page.getByText(/customer@|phone|email/i)).toHaveCount(0);
  });

  test('keyboard navigation reaches main content via skip link', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', { name: 'Skip to content' });
    await expect(skip).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('#main-content')).toBeFocused();
  });

  test('responsive layouts avoid horizontal overflow at key widths', async ({ page }) => {
    const widths = [360, 390, 768, 1024, 1440] as const;
    const routes = ['/', '/login', '/register', '/forgot-password', '/support'] as const;
    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 });
      for (const route of routes) {
        await page.goto(route);
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth > window.innerWidth + 1,
        );
        expect(overflow, `${route} at ${width}px`).toBe(false);
      }
    }
  });

  test('empty receipts state is clear when no data', async ({ page }) => {
    await mockWorkerSession(page);
    await page.route('**/api/v1/receipts**', async (route) => {
      if (route.request().method() !== 'GET') {
        await route.fallback();
        return;
      }
      await route.fulfill(json(emptyPage));
    });
    await page.goto('/receipts');
    await expect(page.getByRole('heading', { name: 'No receipts yet' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Create first receipt' })).toBeVisible();
  });
});
