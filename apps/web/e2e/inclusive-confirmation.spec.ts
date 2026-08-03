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
}

test.describe('inclusive confirmation', () => {
  test('new receipt offers three confirmation methods including share link without email', async ({
    page,
  }) => {
    await mockWorkerSession(page);
    await page.goto('/receipts/new');
    await expect(page.getByText('Email the customer')).toBeVisible();
    await expect(page.getByText('Share a secure link')).toBeVisible();
    await expect(page.getByText('Confirm in person')).toBeVisible();

    await page.getByText('Share a secure link').click();
    await expect(page.getByLabel('Customer email')).toHaveCount(0);
    await expect(page.getByText(/Phone numbers stay in your browser only/i)).toBeVisible();
  });

  test('customer confirms from secure link without signing in', async ({ page }) => {
    await page.route('**/api/v1/auth/me', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ success: false, message: 'Authentication required.' }),
      });
    });
    await page.route('**/api/v1/verification/secure-token', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill(
          json({
            serviceTitle: 'Share work',
            description: 'Completed share-link work',
            workDate: '2026-08-01',
            workerName: 'Test Worker',
            profileSlug: 'test-worker',
            customerName: 'Share Customer',
            amount: 10000,
            currency: 'XAF',
            skillsDemonstrated: ['painting'],
            evidenceCount: 1,
            evidence: [
              {
                id: 'ev-1',
                type: 'LINK',
                linkPlatform: 'TikTok',
                externalUrl: 'https://www.tiktok.com/@demo/video/1',
                description: 'Before/after',
                canDownload: false,
              },
            ],
            evidenceDisclosure:
              'Supporting evidence was supplied with this receipt. Evidence supports the work record but does not replace customer confirmation.',
            status: 'PENDING_VERIFICATION',
            expiresAt: new Date(Date.now() + 3600_000).toISOString(),
            confirmationMethod: 'SHARE_LINK',
            confirmationMethodLabel: 'Confirmed through secure share link',
            privacyNote: 'Customer contact details are not shown on the public proof page.',
          }),
        );
        return;
      }
      await route.continue();
    });
    await page.route('**/api/v1/verification/secure-token/respond', async (route) => {
      await route.fulfill(json({ status: 'VERIFIED', verificationCode: 'WPG-SHARE1' }));
    });

    await page.goto('/verify/secure-token');
    await expect(page.getByText('Share work')).toBeVisible();
    await expect(page.getByText('TikTok')).toBeVisible();
    await page.getByLabel(/display name/i).fill('Share Customer');
    await page.getByLabel(/I confirm that I reviewed/i).check();
    await page.getByRole('button', { name: 'Confirm work' }).click();
    await expect(page.getByText(/locked as portable proof/i)).toBeVisible();
  });

  test('in-person QR decodes to confirmation URL and public proof badge is accurate', async ({
    page,
  }) => {
    await mockWorkerSession(page);
    const confirmationUrl = 'https://workproof.empowerednexus.com/verify/inperson-token';
    await page.route('**/api/v1/receipts/receipt-qr', async (route) => {
      await route.fulfill(
        json({
          id: 'receipt-qr',
          serviceTitle: 'In person job',
          description: 'Completed while customer watched',
          customerName: 'QR Customer',
          confirmationMethod: 'IN_PERSON_QR',
          workDate: '2026-08-01',
          currency: 'XAF',
          skillsDemonstrated: [],
          status: 'PENDING_VERIFICATION',
          visibility: 'UNLISTED',
          evidence: [],
        }),
      );
    });
    await page.route('**/api/v1/receipts/receipt-qr/events', async (route) => {
      await route.fulfill(json([]));
    });
    await page.route('**/api/v1/receipts/receipt-qr/verification-delivery', async (route) => {
      await route.fulfill(
        json({
          status: null,
          lastAttemptedAt: null,
          sentAt: null,
          attemptCount: 0,
          resendAvailable: true,
          resendAvailableInSeconds: 0,
          verificationAttemptNumber: 1,
        }),
      );
    });
    await page.route('**/api/v1/receipts/receipt-qr/regenerate-confirmation', async (route) => {
      await route.fulfill(
        json({
          confirmationMethod: 'IN_PERSON_QR',
          confirmationUrl,
          shareMessage: `Please confirm: ${confirmationUrl}`,
          expiresAt: new Date(Date.now() + 10 * 60_000).toISOString(),
          attemptNumber: 2,
          deliveryQueued: false,
        }),
      );
    });

    await page.goto('/receipts/receipt-qr');
    await page.getByRole('button', { name: /Regenerate confirmation link/i }).click();
    await expect(page.getByAltText(/Short-lived confirmation QR/i)).toBeVisible();
    const src = await page.getByAltText(/Short-lived confirmation QR/i).getAttribute('src');
    const png = PNG.sync.read(Buffer.from(src!.split(',')[1]!, 'base64'));
    const decoded = jsQR(new Uint8ClampedArray(png.data), png.width, png.height);
    expect(decoded?.data).toBe(confirmationUrl);

    await page.route('**/api/v1/auth/me', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ success: false, message: 'Authentication required.' }),
      });
    });
    await page.route('**/api/v1/public/receipts/WPG-PROOF1', async (route) => {
      await route.fulfill(
        json({
          serviceTitle: 'In person job',
          workerName: 'Test Worker',
          description: 'Completed while customer watched',
          workDate: '2026-08-01',
          skillsDemonstrated: [],
          verifiedAt: '2026-08-02T10:00:00.000Z',
          verificationStatus: 'VERIFIED',
          proofValidity: 'VALID',
          status: 'VERIFIED',
          confirmedMethod: 'IN_PERSON_QR',
          confirmationAssuranceLabel: 'Customer confirmed in person',
          confirmationChannelNote:
            'WorkProof records the confirmation action but does not independently verify ownership of the customer’s phone or messaging account.',
          evidenceDisclosure:
            'Supporting evidence was supplied with this receipt. Evidence supports the work record but does not replace customer confirmation.',
          evidence: [{ type: 'LINK', linkPlatform: 'TikTok', url: 'https://www.tiktok.com/@x/1' }],
        }),
      );
    });
    await page.goto('/proof/WPG-PROOF1');
    await expect(page.locator('.confirmation-badge')).toHaveText('Customer confirmed in person');
    await expect(page.getByText(/does not independently verify/i).first()).toBeVisible();
    await expect(page.getByText('TikTok')).toBeVisible();
  });

  test('360px layout has no horizontal overflow on confirmation method screen', async ({ page }) => {
    await mockWorkerSession(page);
    await page.setViewportSize({ width: 360, height: 740 });
    await page.goto('/receipts/new');
    const overflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth + 1;
    });
    expect(overflow).toBe(false);
  });
});
