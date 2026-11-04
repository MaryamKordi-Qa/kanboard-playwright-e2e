const password = process.env.KANBOARD_PASSWORD;
if(!password){
    throw new Error('KANBOARD_PASSWORD environment variable is not set.Check your .env file or set the environment variable before running the tests.');
}

export const testUser = {
    username: 'admin',
    password,
}
export const invalidPassword = 'invalidPassword'
export const invalidUsername = 'invalidUsername'

export const token = process.env.KANBOARD_API_TOKEN;
if(!token){
     throw new Error('KANBOARD_API_TOKEN environment variable is not set.Check your .env file or set the environment variable before running the tests.');

}