import {test, expect} from '@playwright/test'
import { TaskApi } from '../../api/TaskApi'
import { uniqueTitle } from '../../test-data/tasks'

test.describe('API: Task API tests', () => {
    let taskApi: TaskApi;
    let projectId: number;

    test.beforeEach(async ({request})=>{
        taskApi = new TaskApi(request);
        projectId = await taskApi.getProjectId('QA Automation Practice');
    });

    test('API: create a task', async () => {
        
        const title = uniqueTitle('API Task');
        const taskId = await taskApi.createTask(projectId, title, 'Created via API');
        const task = await taskApi.getTask(taskId);
        expect(task.title).toBe(title);

        await taskApi.removeTask(taskId);
  
    });

    test('API: delete a task', async ()=>{
        const title = uniqueTitle('API delete task');
        const taskId = await taskApi.createTask(projectId, title, 'Created Via API');

        await taskApi.removeTask(taskId);
         const deleted = await taskApi.getTask(taskId);
         expect(deleted).toBeNull();
    });
});

test('API: request with wrong token is rejected', async ({request})=>{
    const wrongAuth = 'Basic ' + Buffer.from('jsonrpc:wrong-token').toString('base64');
    const response = await request.post('/jsonrpc.php', {
        headers: {Authorization: wrongAuth},
        data:{jsonrpc:'2.0', method: 'getAllProjects', id: 1},
    });
    expect(response.status()).toBe(401);
})