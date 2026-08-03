import { expect, test, type Page } from '@playwright/test';
import jsQR from 'jsqr';
import { PNG } from 'pngjs';

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

async function mockSignedOutPublic(page: Page) {
  await page.route('**/api/v1/auth/me', async (route) => {
    await route.fulfill({
      status: 401,
      contentType: 'application/json',
      body: JSON.stringify({ success: false, message: 'Authentication required.' }),
    });
  });
}

async function mockValidProof(page: Page, code = 'WPG-DEMOCODE') {
  await page.route(`**/api/v1/public/receipts/${code}`, async (route) => {
    await route.fulfill(
      json({
        receiptNumber: 'WPG-2026-000099',
        workerName: 'Test Worker',
        profileSlug: 'test-worker',
        serviceTitle: 'Cupboard build',
        description: 'Built a full cupboard',
        workDate: '2026-08-01',
        durationValue: 2.5,
        durationUnit: 'HOUR',
        durationLabel: '2.5 hours',
        skillsDemonstrated: ['carpentry'],
        verifiedAt: '2026-08-02T10:00:00.000Z',
        verificationStatus: 'VERIFIED',
        proofValidity: 'VALID',
        integrityHash: 'abc123',
        integrityVersion: 1,
        status: 'VERIFIED',
        revokedAt: null,
        revocationReason: null,
        amount: 50000,
        currency: 'XAF',
        evidence: [{ type: 'IMAGE', description: null }],
      }),
    );
  });
}

test.describe('public proof and duration', () => {
  test('signed-out visitor opens verified public proof by direct URL', async ({ page }) => {
    await mockSignedOutPublic(page);
    await mockValidProof(page);
    await page.goto('/proof/WPG-DEMOCODE');
    await expect(page.getByText('WorkProof verified')).toBeVisible();
    await expect(page.getByText('Cupboard build')).toBeVisible();
    await expect(page.getByText('2.5 hours')).toBeVisible();
    await expect(page.getByText(/customer@|customer email/i)).toHaveCount(0);
  });

  test('direct proof-route reload works', async ({ page }) => {
    await mockSignedOutPublic(page);
    await mockValidProof(page);
    await page.goto('/proof/WPG-DEMOCODE');
    await expect(page.getByText('WorkProof verified')).toBeVisible();
    await page.reload();
    await expect(page.getByText('WorkProof verified')).toBeVisible();
    await expect(page).toHaveURL(/\/proof\/WPG-DEMOCODE\/?$/);
  });

  test('copy and QR encode the same proof path', async ({ page, context }) => {
    await mockSignedOutPublic(page);
    await mockValidProof(page);
    await context.grantPermissions(['clipboard-read', 'clipboard-write']).catch(() => undefined);
    await page.goto('/proof/WPG-DEMOCODE');
    await expect(page.getByText('WorkProof verified')).toBeVisible();

    await page.getByRole('button', { name: /copy link/i }).click();
    const copied = await page.evaluate(async () => navigator.clipboard.readText());
    expect(copied).toMatch(/\/proof\/WPG-DEMOCODE$/);
    expect(copied.endsWith('/')).toBe(false);

    const qr = page.locator('.proof-qr img');
    await expect(qr).toBeVisible();
    const src = await qr.getAttribute('src');
    expect(src?.startsWith('data:image/png;base64,')).toBe(true);

    const png = PNG.sync.read(Buffer.from(src!.split(',')[1]!, 'base64'));
    const decoded = jsQR(new Uint8ClampedArray(png.data), png.width, png.height);
    expect(decoded, 'QR payload must decode').toBeTruthy();
    expect(decoded!.data).toBe(copied);
    expect(decoded!.data).toMatch(/\/proof\/WPG-DEMOCODE$/);
    expect(decoded!.data.endsWith('/')).toBe(false);
  });

  test('temporary API failure shows retry state', async ({ page }) => {
    await mockSignedOutPublic(page);
    let attempts = 0;
    await page.route('**/api/v1/public/receipts/WPG-RETRY', async (route) => {
      attempts += 1;
      if (attempts <= 2) {
        await route.abort('failed');
        return;
      }
      await route.fulfill(
        json({
          receiptNumber: 'WPG-2026-000099',
          workerName: 'Test Worker',
          serviceTitle: 'Retry proof',
          description: 'Recovered',
          workDate: '2026-08-01',
          skillsDemonstrated: [],
          verifiedAt: '2026-08-02T10:00:00.000Z',
          verificationStatus: 'VERIFIED',
          proofValidity: 'VALID',
          status: 'VERIFIED',
          evidence: [],
        }),
      );
    });

    await page.goto('/proof/WPG-RETRY');
    await expect(page.getByRole('button', { name: 'Retry' })).toBeVisible();
    await page.getByRole('button', { name: 'Retry' }).click();
    await expect(page.getByText('Retry proof')).toBeVisible();
  });

  test('new receipt form exposes duration units', async ({ page }) => {
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
    await page.goto('/receipts/new');
    await expect(page.getByLabel('Duration')).toBeVisible();
    const unit = page.locator('.duration-fields select');
    await expect(unit).toHaveValue('HOUR');
    await unit.selectOption('DAY');
    await expect(unit).toHaveValue('DAY');
    await unit.selectOption('WEEK');
    await expect(unit).toHaveValue('WEEK');
    await unit.selectOption('MONTH');
    await expect(unit).toHaveValue('MONTH');
  });
});
