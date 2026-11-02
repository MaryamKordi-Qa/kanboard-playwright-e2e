export const taskTestData = {
    createTask:{
        title:'Verify task creation using Playwright',
        description: 'Verify that a new task can be created successfully through UI automation'
    },
    editTask:{
        title: 'Task to edit',
        description: 'Created to test editing',
        updatedTitle: 'Edited task title',
    },
    deleteTask:{
        title:'Task to delete',
        description: 'Created to test deleting',
    },
}
export const uniqueTitle = (base:string) => `${base} ${Date.now()}`