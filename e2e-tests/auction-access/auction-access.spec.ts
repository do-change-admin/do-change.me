// import { test, expect } from '@playwright/test';
// import dotenv from 'dotenv';
//
// test('Auction Access + Admin login', async ({ page }) => {
//   dotenv.config();
//   // -------------------------------------
//   // ENV → creds
//   // -------------------------------------
//   const userCreds = JSON.parse(process.env.USER_CREDS_TEST || '{}');
//   const adminCreds = JSON.parse(process.env.ADMIN_CREDS_TEST || '{}');
//
//   const userEmail = Object.keys(userCreds)[0];
//   const userPassword = userCreds[userEmail];
//
//   console.log(userCreds, userEmail, userPassword)
//
//   const adminEmail = Object.keys(adminCreds)[0];
//   const adminPassword = adminCreds[adminEmail];
//
//   console.log(adminCreds, adminEmail, adminPassword)
//
//   // -------------------------------------
//   // 1. USER LOGIN
//   // -------------------------------------
//   await page.goto('/auth/login');
//
//   const emailInput = page.getByTestId('email');
//   const passwordInput = page.getByTestId('password');
//
//   await emailInput.click({ force: true });
//   await emailInput.fill(userEmail);
//
//   await passwordInput.click({ force: true });
//   await passwordInput.fill(userPassword);
//
//   await Promise.all([
//     page.waitForURL('/', { timeout: 60000 }),
//     page.getByRole('button', { name: /sign in/i }).click(),
//   ]);
//
//   await expect(page).toHaveURL('/');
//
//   // -------------------------------------
//   // 2. Навигация к аукционам
//   // -------------------------------------
//   await page.getByTestId('auctions').click();
//
//   await page.getByTestId('dealerAuctions').waitFor({ state: 'visible' });
//   await page.getByTestId('dealerAuctions').click();
//
//   await page.waitForURL('/auctions/dealer', { timeout: 60000 });
//
//   // -------------------------------------
//   // 3. Открыть форму получения доступа
//   // -------------------------------------
//   await page.getByTestId('buttonGetAccess').waitFor({ state: 'visible' });
//   await page.getByTestId('buttonGetAccess').click();
//
//   // ⭐ Зай, тут ставлю задержку (ожидание появления сабмита)
//   await page.getByTestId('submitButton').waitFor({ state: 'visible', timeout: 15000 });
//   await page.waitForTimeout(1000); // если форма анимирована или грузится — можно увеличить
//
//   await page.getByTestId('submitButton').click();
//
//   // -------------------------------------
//   // 4. Logout
//   // -------------------------------------
//   await page.goto('/settings');
//   await page.getByTestId('logoutButton').click();
//   await page.goto('/auth/login');
//   await expect(page).toHaveURL('/auth/login');
//
//   // -------------------------------------
//   // 5. ADMIN LOGIN
//   // -------------------------------------
//   const adminEmailInput = page.getByTestId('email');
//   const adminPasswordInput = page.getByTestId('password');
//
//   await adminEmailInput.click({ force: true });
//   await adminEmailInput.fill(adminEmail);
//
//   await adminPasswordInput.click({ force: true });
//   await adminPasswordInput.fill(adminPassword);
//
//   await Promise.all([
//     page.waitForURL('/', { timeout: 60000 }),
//     page.getByRole('button', { name: /sign in/i }).click(),
//   ]);
//
//   // -------------------------------------
//   // 6. Переход в админку
//   // -------------------------------------
//   await page.goto('/admin');
//   await expect(page).toHaveURL('/admin');
// });
