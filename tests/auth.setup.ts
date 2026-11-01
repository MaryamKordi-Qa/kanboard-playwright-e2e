import {expect, test as setup} from '@playwright/test'
import { LoginPage } from '../pages/LoginPage'
import { testUser } from '../test-data/users'

const authFile = '.auth/user.json'
setup('authenticate', async ({page})=>{
    const loginPage =new LoginPage(page);
    await loginPage.open();
    await loginPage.login(testUser.username, testUser.password);
    await expect(page).toHaveTitle("Dashboard for admin");

    await page.context().storageState({path: authFile})
})