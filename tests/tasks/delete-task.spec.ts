import {test} from '@playwright/test';
import { BoardPage } from '../../pages/BoardPage';
import { TaskPage } from '../../pages/TaskPage';
import { taskTestData, uniqueTitle } from '../../test-data/tasks';

test('Verify user can delete a task', async ({page})=>{
    const boardPage = new BoardPage(page);
    const taskPage = new TaskPage(page);
    const title = uniqueTitle(taskTestData.deleteTask.title);

    await page.goto('/');
    await boardPage.openProject();
    await boardPage.openCreateTaskForm();
    await taskPage.createTask(title,taskTestData.deleteTask.description);
    await taskPage.expectTaskToBeVisible(title);

    await boardPage.openTask(title);
    await taskPage.deleteTask();

    await page.goto('/');
    await boardPage.openProject();
    await boardPage.expectBoardLoaded();
    await taskPage.expectTaskNotVisible(title);

})