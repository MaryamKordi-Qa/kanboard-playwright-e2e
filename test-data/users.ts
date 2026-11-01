const password = process.env.KANBOARD_PASSWORD;
if(!password){
    throw new Error('KANBOARD_PASSWORD environment variable is not set.Check your .env file or set the environment variable before running the tests.');
}

export const testUser = {
    username: 'admin',
    password,
}