export const taskTestData = {
    createTask:{
        title:'Verify task creation using Playwright',
        description: 'Verify that a new task can be created successfully through UI automation'
    }
}
export const uniqueTitle = (base:string) => `${base} ${Date.now()}`