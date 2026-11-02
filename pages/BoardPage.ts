import {Page, Locator,expect} from '@playwright/test'

export class BoardPage{
    readonly page: Page;
    readonly projectLink: Locator;
    readonly createTaskButton: Locator;
    readonly taskLink:(title:string)=>Locator;


    constructor(page: Page){
        this.page = page;
        this.projectLink = page.locator('a').filter({ hasText: 'QA Automation Practice' }).first();
        this.createTaskButton =page.locator("th[class='board-column-header board-column-header-1'] a[title='Add a new task']");
        this.taskLink = (title:string)=> page.locator('.task-board').getByRole('link', { name: title , exact: true });


    }

    async openProject(){
        await this.projectLink.click();
    }

    async openCreateTaskForm(){
        await this.createTaskButton.click();
    }
    async openTask(title:string){
        await this.taskLink(title).click();
    }
    async expectBoardLoaded(){
        await expect(this.createTaskButton).toBeVisible();
    }


}