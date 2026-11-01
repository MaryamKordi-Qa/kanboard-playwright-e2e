import {test} from '@playwright/test'
import { BoardPage } from '../../pages/BoardPage'
import { TaskPage } from '../../pages/TaskPage'
import { LoginPage } from '../../pages/LoginPage';
import { invalidPassword, invalidUsername, testUser } from '../../test-data/users';
import { taskTestData, uniqueTitle } from '../../test-data/tasks';



test('Verify user can create a task', async ({page}) => {
    const loginPage = new LoginPage(page)
    const boardPage = new BoardPage(page);
    const taskPage = new TaskPage(page);
    const title = uniqueTitle(taskTestData.createTask.title)

    await loginPage.open();
    await loginPage.login(testUser.username, testUser.password);

    await boardPage.openProject();
    await boardPage.openCreateTaskForm();

    await taskPage.createTask(title, taskTestData.createTask.description);
    await taskPage.expectTaskToBeVisible(title);


    await boardPage.openTask(title);
    await taskPage.expectTaskDescription(taskTestData.createTask.description)

})