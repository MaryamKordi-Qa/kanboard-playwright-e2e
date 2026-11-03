import {test} from '@playwright/test'
import { BoardPage } from '../../pages/BoardPage'
import { TaskPage } from '../../pages/TaskPage'
import { taskTestData, uniqueTitle } from '../../test-data/tasks';
test('Verify user can move a task to another column', async ({page})=>{
    const boardPage = new BoardPage(page);
    const taskPage = new TaskPage(page);
    const title = uniqueTitle(taskTestData.moveTask.title);

    await page.goto('/');
    await boardPage.openProject();
    await boardPage.openCreateTaskForm();
    await taskPage.createTask(title,taskTestData.moveTask.description);
    await boardPage.expectTaskInColumn(title, 1);

    await boardPage.moveTaskToColumn(title, 2);
    await boardPage.expectTaskInColumn(title, 2);

    await page.reload();
    await boardPage.expectTaskInColumn(title, 2);
    
})