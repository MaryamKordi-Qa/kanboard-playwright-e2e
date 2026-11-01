import {Page, Locator, expect} from '@playwright/test'

export class LoginPage {

    readonly page:Page;
    readonly usernameInput:Locator;
    readonly passwordInput:Locator;
    readonly loginButton:Locator;
    readonly errorMessage:Locator;

    constructor(page: Page) {
        this.page = page;
        this.usernameInput = page.getByRole('textbox', { name: 'Username' });
        this.passwordInput = page.locator('#form-password');
        this.loginButton = page.locator('button:has-text("Sign in")');
        this.errorMessage = page.getByText('Bad username or password', { exact: true });
        
    }

    async open(){
        await this.page.goto('/');
    }

    async login(username:string , password:string){
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    async expectLoginFormVisible(){
        await expect(this.usernameInput).toBeVisible();
        await expect(this.passwordInput).toBeVisible();
    }
    async expectLoginError(){
        await expect(this.errorMessage).toBeVisible();
    }
}