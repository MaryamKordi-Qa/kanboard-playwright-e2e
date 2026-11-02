import {Page, Locator, expect} from '@playwright/test'

export class TaskPage{
    readonly page: Page;
    readonly titleInput:Locator;
    readonly descriptionInput:Locator;
    readonly saveButton:Locator;
    readonly taskTitle:(title: string)=>Locator;
    readonly taskDescription:(description:string)=>Locator;
    readonly editLink:Locator;
    readonly removeLink:Locator;
    readonly confirmDeleteButton:Locator
    readonly modalCloseButton:Locator;

    constructor(page:Page){
        this.page = page;
        this.titleInput = page.getByRole('textbox', { name: 'Title' });
        this.descriptionInput = page.getByRole('textbox', { name: 'Description' });
        this.saveButton =page.getByRole('button', { name: 'Save' });
        this.taskTitle = (title:string)=>page.locator('.task-board').getByRole('link', { name: title , exact: true });
        this.taskDescription = (description:string)=>page.getByText(description, { exact: true });
        this.editLink = page.getByRole('link', { name: 'Edit the task' });
        this.removeLink = page.getByRole('link', { name: 'Remove' });
        this.confirmDeleteButton= page.getByRole('button', { name: 'Yes' });
        this.modalCloseButton = page.locator('#modal-close-button');
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

    async editTitle(newTitle:string){
        await this.editLink.click();
        await this.titleInput.fill(newTitle);
        await this.saveButton.click();
        await expect(this.modalCloseButton).toBeHidden();
    }
    async deleteTask(){
        await this.removeLink.click();
        await this.confirmDeleteButton.click();
        await expect(this.modalCloseButton).toBeHidden();

    }

    async expectTaskNotVisible(title:string){
        await expect(this.taskTitle(title)).toBeHidden();
    }


}