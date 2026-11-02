import {expect, test as setup} from '@playwright/test'
import { LoginPage } from '../pages/LoginPage'
import { testUser } from '../test-data/users'

const authFile = '.auth/user.json'
setup('authenticate', async ({page})=>{
    const loginPage =new LoginPage(page);
    await loginPage.open();
    await loginPage.login(testUser.username, testUser.password);
    await expect(page).toHaveTitle("Dashboard for admin");

    const projectLink = page.getByRole('link', {name: 'QA Automation Practice'}).first();
    if (await projectLink.count() === 0) {
        await page.goto('/?controller=ProjectCreationController&action=create');
        await page.getByLabel('Name').fill('QA Automation Practice');
        await page.getByRole('button', {name: 'Save'}).click();
    
    }

    await page.context().storageState({path: authFile})
})