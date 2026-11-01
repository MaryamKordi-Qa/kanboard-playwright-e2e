import {Page, Locator, expect} from '@playwright/test'

export class TaskPage{
    readonly page: Page;
    readonly titleInput:Locator;
    readonly descriptionInput:Locator;
    readonly saveButton:Locator;
    readonly taskTitle:(title: string)=>Locator;
    readonly taskDescription:(description:string)=>Locator;

    constructor(page:Page){
        this.page = page;
        this.titleInput = page.getByRole('textbox', { name: 'Title' });
        this.descriptionInput = page.getByRole('textbox', { name: 'Description' });
        this.saveButton =page.getByRole('button', { name: 'Save' });
        this.taskTitle = (title:string)=>page.locator(`a[title="${title}"]`);

        this.taskDescription = (description:string)=>page.getByText(description, { exact: true });
    }

    async createTask(title: string, description:string){
        await this.titleInput.fill(title);
        await this.descriptionInput.fill(description);
        await this.saveButton.click();

    }

    async expectTaskToBeVisible(title:string){
        await expect(this.taskTitle(title)).toBeVisible();
    }
    async expectTaskDescription(description:string){
        await expect(this.taskDescription(description)).toBeVisible();
    }


}