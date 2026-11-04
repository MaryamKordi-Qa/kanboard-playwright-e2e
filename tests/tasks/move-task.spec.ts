import {test} from '@playwright/test'
import { BoardPage } from '../../pages/BoardPage'
import { taskTestData, uniqueTitle } from '../../test-data/tasks';
import {TaskApi} from '../../api/TaskApi';


test('Verify user can move a task to another column', async ({page, request})=>{
    const boardPage = new BoardPage(page);
  
    const title = uniqueTitle(taskTestData.moveTask.title);
    const taskApi = new TaskApi(request)

    const projectId = await taskApi.getProjectId('QA Automation Practice');
    const taskId = await taskApi.createTask(projectId, title, taskTestData.moveTask.description);

try {
    await page.goto('/');
    await boardPage.openProject();
    await boardPage.expectTaskInColumn(title, 1);

    await boardPage.moveTaskToColumn(title, 2);
    await boardPage.expectTaskInColumn(title, 2);

    await page.reload();
    await boardPage.expectTaskInColumn(title, 2);

} finally{

    await taskApi.removeTask(taskId);
}
    
})
