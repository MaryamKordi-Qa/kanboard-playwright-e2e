import {test} from '@playwright/test'
import { BoardPage } from '../../pages/BoardPage'
import { TaskPage } from '../../pages/TaskPage'

import { taskTestData, uniqueTitle } from '../../test-data/tasks';



test('Verify user can create a task', async ({page}) => {

    const boardPage = new BoardPage(page);
    const taskPage = new TaskPage(page);
    const title = uniqueTitle(taskTestData.createTask.title);

    await page.goto('/');

    await boardPage.openProject();
    await boardPage.openCreateTaskForm();

    await taskPage.createTask(title, taskTestData.createTask.description);
    await taskPage.expectTaskToBeVisible(title);


    await boardPage.openTask(title);
    await taskPage.expectTaskDescription(taskTestData.createTask.description);

});

test('Verify user cannot create a task with empty title', async ({page}) => {

    const boardPage = new BoardPage(page);
    const taskPage = new TaskPage(page);

    await page.goto('/');

    await boardPage.openProject();
    await boardPage.openCreateTaskForm();
    await taskPage.createTask('', taskTestData.createTask.description);
    await taskPage.expectErrorValidationMessage();
    await taskPage.expectTaskFormToBeVisible();

});