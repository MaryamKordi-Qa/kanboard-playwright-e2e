import {test} from '@playwright/test'
import { BoardPage } from '../../pages/BoardPage'
import { TaskPage } from '../../pages/TaskPage'
import { taskTestData, uniqueTitle } from '../../test-data/tasks';
import {TaskApi} from '../../api/TaskApi';

test('Verify user can edit a task', async ({page, request})=>{
    const boardPage = new BoardPage(page);
    const taskPage = new TaskPage(page);
    const title = uniqueTitle(taskTestData.editTask.title);
    const updatedTitle = uniqueTitle(taskTestData.editTask.updatedTitle);
    const taskApi = new TaskApi(request);


    const projectId = await taskApi.getProjectId('QA Automation Practice');
    const taskId = await taskApi.createTask(projectId, title, taskTestData.editTask.description);


try{
    
    await page.goto('/');
    await boardPage.openProject();
    await boardPage.openTask(title);
    await taskPage.editTitle(updatedTitle);

    await page.goto('/');
    await boardPage.openProject();
    await boardPage.expectBoardLoaded();
    await taskPage.expectTaskToBeVisible(updatedTitle);
    await taskPage.expectTaskNotVisible(title);
} finally{
    await taskApi.removeTask(taskId);
}

});