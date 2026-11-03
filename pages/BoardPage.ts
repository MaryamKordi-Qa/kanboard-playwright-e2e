import {Page, Locator,expect} from '@playwright/test'

export class BoardPage{
    readonly page: Page;
    readonly projectLink: Locator;
    readonly createTaskButton: Locator;
    readonly taskLink:(title:string)=>Locator;
    readonly column:(id:number)=>Locator;


    constructor(page: Page){
        this.page = page;
        this.projectLink = page.locator('a').filter({ hasText: 'QA Automation Practice' }).first();
        this.createTaskButton =page.locator("th[class='board-column-header board-column-header-1'] a[title='Add a new task']");
        this.taskLink = (title:string)=> page.locator('.task-board').getByRole('link', { name: title , exact: true });
        this.column = (id:number)=>page.locator(`.board-task-list.board-column-expanded[data-column-id="${id}"]`);


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
    async moveTaskToColumn(title:string, columnId:number){
        const source = this.taskLink(title);
        const target = this.column(columnId);

        const sourceBox = await source.boundingBox();
        const targetBox = await target.boundingBox();
        if (!sourceBox || !targetBox){
            throw new Error('Could not find the task or the target column on the board');

        }
        await this.page.mouse.move(sourceBox.x + sourceBox.width / 2, sourceBox.y + sourceBox.height / 2);
        await this.page.mouse.down();
        await this.page.mouse.move(targetBox.x + targetBox.width/2, targetBox.y + targetBox.height/2);
        const savePromise = this.page.waitForResponse(resp => resp.url().includes('action=save'));
        await this.page.mouse.up();
        await savePromise;
    }

    async expectTaskInColumn(title:string,columnId:number){
        await expect(this.column(columnId).getByRole('link', {name: title, exact:true})).toBeVisible();
    }


}