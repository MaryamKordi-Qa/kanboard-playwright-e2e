import {test} from '@playwright/test'
import { BoardPage } from '../../pages/BoardPage'
import { TaskPage } from '../../pages/TaskPage'
import { taskTestData, uniqueTitle } from '../../test-data/tasks';
import {TaskApi} from '../../api/TaskApi';



test('Verify user can create a task', async ({page, request}) => {

    const boardPage = new BoardPage(page);
    const taskPage = new TaskPage(page);
    const title = uniqueTitle(taskTestData.createTask.title);
    const taskApi = new TaskApi(request)

    const projectId = await taskApi.getProjectId('QA Automation Practice');


try{
    await page.goto('/');

    await boardPage.openProject();
    await boardPage.openCreateTaskForm();

    await taskPage.createTask(title, taskTestData.createTask.description);
    await taskPage.expectTaskToBeVisible(title);

    await boardPage.openTask(title);
    await taskPage.expectTaskDescription(taskTestData.createTask.description);
}finally{
    try{
        const taskId = await taskApi.createTask(projectId, title, taskTestData.createTask.description);
        await taskApi.removeTask(taskId);
    }catch{

    }   
}

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