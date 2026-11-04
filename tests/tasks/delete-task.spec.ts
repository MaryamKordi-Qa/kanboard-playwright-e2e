import {test} from '@playwright/test';
import { BoardPage } from '../../pages/BoardPage';
import { TaskPage } from '../../pages/TaskPage';
import { taskTestData, uniqueTitle } from '../../test-data/tasks';
import {TaskApi} from '../../api/TaskApi';

test('Verify user can delete a task', async ({page, request})=>{
    const boardPage = new BoardPage(page);
    const taskPage = new TaskPage(page);
    const title = uniqueTitle(taskTestData.deleteTask.title);
    const taskApi = new TaskApi(request);

    const projectId = await taskApi.getProjectId('QA Automation Practice');
    await taskApi.createTask(projectId, title, taskTestData.deleteTask.description);

    await page.goto('/');
    await boardPage.openProject();
    
    await boardPage.openTask(title);
    await taskPage.deleteTask();

    await page.goto('/');
    await boardPage.openProject();
    await boardPage.expectBoardLoaded();
    await taskPage.expectTaskNotVisible(title);

});