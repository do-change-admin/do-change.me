import { test, expect } from '@playwright/test';

const loginURL = '/auth/login'

test('На странице логина есть форма логина', async ({ page }) => {
    await page.goto(loginURL);
    const form = page.getByTestId('login-form')
    expect(form).toBeTruthy()
});

test('В форме логина есть правильные лейблы', async ({ page }) => {
    await page.goto(loginURL)
    const emailAddressLabel = page.getByTestId('email-address-label')
    await expect(emailAddressLabel).toHaveText('Email Address');
    const passwordLabel = page.getByTestId('password-label')
    await expect(passwordLabel).toHaveText('Password')
})