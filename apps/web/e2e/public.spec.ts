import { expect, test } from '@playwright/test';

test.describe('public surfaces', () => {
  test('landing page shows profile and verification CTAs', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Create your work profile' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'How verification works' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'How verification works' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Verify a receipt' })).toHaveCount(0);
  });

  test('responsive nav opens, shows Sign in, and closes after navigation', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');

    const menuButton = page.getByRole('button', { name: /menu/i });
    await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    await menuButton.click();
    await expect(menuButton).toHaveAttribute('aria-expanded', 'true');
    await expect(menuButton).toHaveAccessibleName(/close menu/i);

    const signIn = page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Sign in' });
    await expect(signIn).toBeVisible();
    await signIn.click();

    await expect(page).toHaveURL(/\/login$/);
    await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    await expect(menuButton).toHaveAccessibleName(/open menu/i);
  });

  test('registration requires terms and privacy acceptance', async ({ page }) => {
    await page.goto('/register');

    const terms = page.getByRole('checkbox', { name: /terms of use/i });
    const privacy = page.getByRole('checkbox', { name: /privacy policy/i });
    await expect(terms).not.toBeChecked();
    await expect(privacy).not.toBeChecked();

    await page.getByLabel('Full name').fill('Ada Worker');
    await page.getByLabel('Email').fill('ada@example.test');
    await page.getByLabel('Password').fill('ValidPass1');
    await page.getByRole('button', { name: 'Create profile' }).click();

    await expect(page.getByRole('alert')).toContainText(
      /accept the Terms of Use and Privacy Policy/i,
    );
  });

  test('login page shows validation for invalid credentials', async ({ page }) => {
    await page.route('**/api/v1/auth/login', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ success: false, message: 'Invalid email or password.' }),
      });
    });

    await page.goto('/login');
    await page.getByLabel('Email').fill('nobody@example.test');
    await page.getByLabel('Password').fill('wrong-password');
    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(page.getByRole('alert')).toContainText(/invalid email or password/i);
    await expect(page).toHaveURL(/\/login$/);
  });

  test('forgot password page loads', async ({ page }) => {
    await page.goto('/forgot-password');
    await expect(page.getByRole('heading', { name: 'Reset your password' })).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Send reset link' })).toBeVisible();
  });

  test('invalid public proof shows error messaging', async ({ page }) => {
    await page.route('**/api/v1/public/receipts/bad-code', async (route) => {
      await route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({ success: false, message: 'Proof not found or invalid.' }),
      });
    });

    await page.goto('/proof/bad-code');
    await expect(page.getByRole('heading', { name: /portable proof/i })).toBeVisible();
    await expect(page.getByRole('alert')).toContainText(/proof not found|invalid/i);
  });

  test('legal pages load with operator and support contact', async ({ page }) => {
    for (const path of ['/privacy', '/terms', '/support'] as const) {
      await page.goto(path);
      await expect(page.getByText(/EmpowerEd Nexus/i).first()).toBeVisible();
      await expect(page.getByRole('link', { name: 'support@empowerednexus.com' }).first()).toBeVisible();
    }
  });

  test('unknown route shows 404 page', async ({ page }) => {
    await page.goto('/this-route-does-not-exist');
    await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Return home' })).toBeVisible();
  });
});
