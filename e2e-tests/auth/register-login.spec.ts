import { test, expect } from '@playwright/test';
import assert from 'assert';

test.describe('Login Page', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/login');
  });

  test('Форма логина отображается', async ({ page }) => {
    const form = page.getByTestId('login-form');
    await expect(form).toBeVisible();

    await expect(page.getByTestId('email-address-label')).toHaveText('Email Address');
    await expect(page.getByTestId('password-label')).toHaveText('Password');
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
  });

  test('Переход на страницу регистрации по ссылке "Sign up"', async ({ page }) => {
    await Promise.all([
      page.waitForURL(/\/auth\/register/),
      page.getByTestId('sign-up').click()
    ]);
  });
});

test.describe('Register Page', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/register');
  });

  test('Страница регистрации отображается', async ({ page }) => {
    await expect(page).toHaveURL(/\/auth\/register/);
  });

  test('Переход обратно на логин по ссылке "Sign in"', async ({ page }) => {
    await page.getByRole('link', { name: /Sign in/i }).click();
    await expect(page).toHaveURL(/\/auth\/login/);
  });
});

test.describe('Register User Flow', () => {
  test('Пользователь может зарегистрироваться', async ({ page }) => {
    await page.goto('/auth/register');

    const randomId = Date.now();
    const email = `user${randomId}@test.com`;

    const registerResponsePromise = page.waitForResponse((response) =>
      response.url().includes('/api/auth/register')
    );

    const firstNameInput  = await page.getByTestId("first-name");
    await firstNameInput.click();
    await firstNameInput.fill("Janes");

    await page.fill('input[placeholder="Doe"]', 'Doe');
    await page.fill('input[placeholder="john@example.com"]', email);
    await page.fill('input[placeholder="Password"]', 'Password123');
    await page.fill('input[placeholder="Confirm"]', 'Password123');
    await page.check('input[type="checkbox"]');

    await page.click('button:has-text("Create Account")');

    const response = await registerResponsePromise;

    let body: any = null;
    try {
      body = await response.json();
    } catch {
      body = await response.text(); // если не JSON
    }
    console.log(`📩 Регистрация: URL=${response.url()} | Статус=${response.status()} | Тело=`, body);

    const status = response.status();
    assert.strictEqual(
      status,
      201,
      `❌ Ожидался статус 201, но пришёл ${status}. Тело ответа: ${JSON.stringify(body)}`
    );

    // 💠 Проверяем редирект после успешной регистрации
    await page.waitForURL('/');
  });
});
