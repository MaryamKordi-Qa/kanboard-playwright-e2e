import {test} from '@playwright/test'
import { BoardPage } from '../../pages/BoardPage'
import { TaskPage } from '../../pages/TaskPage'
import { taskTestData, uniqueTitle } from '../../test-data/tasks';

test('Verify user can edit a task', async ({page})=>{
    const boardPage = new BoardPage(page);
    const taskPage = new TaskPage(page);
    const title = uniqueTitle(taskTestData.editTask.title);
    const updatedTitle = uniqueTitle(taskTestData.editTask.updatedTitle);

    await page.goto('/');
    await boardPage.openProject();
    await boardPage.openCreateTaskForm();
    await taskPage.createTask(title, taskTestData.editTask.description);
    await taskPage.expectTaskToBeVisible(title);

    await boardPage.openTask(title);
    await taskPage.editTitle(updatedTitle);

    await page.goto('/');
    await boardPage.openProject();
    await boardPage.expectBoardLoaded();
    await taskPage.expectTaskToBeVisible(updatedTitle);
    await taskPage.expectTaskNotVisible(title);

});