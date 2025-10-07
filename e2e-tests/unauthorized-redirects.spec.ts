import { test, expect } from '@playwright/test';

test('При переходе на главную страницу без авторизации нас кидает на форму логина', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL('/auth/login')
});
