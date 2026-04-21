import { test, expect } from '@playwright/test';

test('landing page contains main elements and CTAs', async ({ page }) => {
  await page.goto('/');

  // Check title
  await expect(page).toHaveTitle(/Matchpoint/);

  // Check hero section and primary CTA
  const createLigaBtn = page.getByRole('link', { name: /criar liga grátis/i }).first();
  await expect(createLigaBtn).toBeVisible();
  await expect(createLigaBtn).toHaveAttribute('href', '/register');

  // Check sports listed
  await expect(page.getByText('Padel', { exact: true })).toBeVisible();
  await expect(page.getByText('Pickleball', { exact: true })).toBeVisible();

  // Check How It Works
  await expect(page.getByText('Organizar não precisa ser chato.')).toBeVisible();

  // Check Secondary CTA at bottom
  const secondaryBtn = page.getByRole('link', { name: /criar liga grátis agora/i });
  await expect(secondaryBtn).toBeVisible();
});
