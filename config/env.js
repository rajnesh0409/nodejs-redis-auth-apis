const dbUsename = process.env.USERNAME;
const dbpassword = process.env.PASSWORD;
const dbName = process.env.DBNAME;
exports.DB_URL = `mongodb+srv://${dbUsename}:${dbpassword}@cluster0.test.mongodb.net/${dbName}?retryWrites=true&w=majority`;
exports.PORT = process.env.PORT;
exports.TOKEN = { TTL: 60 * 60 * 1, TOKEN_LENGTH: 64, DEBUG: false };

