const config = {
    SECRET_KEY: 'ksh3cZKXWiXgQ2BC2lwglCp@55s9KgUAUgLNC$KAhH9$%kiW8hNihA?7C-#~',
    HOST: "localhost",
    db : {
        HOST: "localhost",
        DB_NAME: "welbexblog_db", //CHANGE THIS
        PORT: 5432, //CHANGE THIS IF IT IS NECESSARY
        USERS_TABLE: 'users', //DO NOT CHANGE
        POSTS_TABLE: 'posts', //DO NOT CHANGE
        USERNAME: 'qwerty123', //CHANGE THIS
        PASSWORD: 'qwerty123', //CHANGE THIS
        HASH: 256
    }
    
};

export default config;
