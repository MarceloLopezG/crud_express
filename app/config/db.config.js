module.exports = {
    HOST: "localhost",
    USER: "TU_USUARIO",
    PASSWORD: "TU_PASSWORD",
    DB: "crud_express_db",
    dialect: "postgres",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000, // Maximum time in milliseconds
        idle: 10000 // Maximum time in milliseconds
    }
};