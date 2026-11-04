import { APIRequestContext, expect } from "@playwright/test";


export class TaskApi{
    readonly request: APIRequestContext;
    private readonly endpoint= '/jsonrpc.php';
    private readonly authHeader='Basic ' + Buffer.from(`jsonrpc:${process.env.KANBOARD_API_TOKEN}`).toString('base64');

    constructor(request: APIRequestContext){
        this.request = request;
    }
    private async call(method: string, params?: object){
        const response = await this.request.post(this.endpoint,{
            headers:{Authorization: this.authHeader},
            data:{jsonrpc:'2.0', method, id:1, params},

    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.error, JSON.stringify(body.error)).toBeUndefined();
    return body.result;
}
    async getProjectId(name: string): Promise<number>{
        const projects = await this.call('getAllProjects');
        const project = projects.find((p: { name: string; }) => p.name === name);
        if (!project) {
            throw new Error(`Project not found: ${name}`);
        }
        return Number(project.id);
    }

    async createTask(projectId: number, title: string, description: string): Promise<number>{
        const taskId = await this.call('createTask', {project_id: projectId, title, description:""});
        expect(taskId, 'createTask failed').toBeTruthy();
        return Number(taskId);
    }

    async getTask(taskId:number){
        return await this.call('getTask', {task_id: taskId});

    }
    async removeTask(taskId:number){
        const result = await this.call('removeTask', {task_id:taskId});
        expect(result).toBe(true)
    }

    async findTaskByTitle(projectId: number, title: string): Promise<number> {
        const tasks = await this.call('getAllTasks', {project_id: projectId, status_id:1});
        const task = tasks.find((t: {title:string}) => t.title === title);
        if(!task){
            throw new Error (`Task not found: ${title}`);

        }
        return Number(task.id);
    }
}