import {test, expect} from '@playwright/test';
import {LoginPage} from '../../pages/LoginPage';
import {testUser} from '../../test-data/users';

test('Login succeeds with valid credentials', async ({page}) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.expectLoginFormVisible();
    await loginPage.login(testUser.username, testUser.password);
    await expect(page).toHaveTitle("Dashboard for admin");
  
});

test('Login fails with a wrong password', async ({page}) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.expectLoginFormVisible();
    await loginPage.login('admin', 'wrongpassword');
    await expect(loginPage.errorMessage).toBeVisible();
});

test('Login fails with empty username', async ({page}) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.expectLoginFormVisible();
    await loginPage.login('', testUser.password);
    await expect(loginPage.usernameInput).toBeFocused();
});

test('Login fails with empty password', async ({page}) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.expectLoginFormVisible();
    await loginPage.login(testUser.username, '');
    await expect(loginPage.passwordInput).toBeFocused();
});