import mysql from 'mysql2';
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "bk200423", // replace with yours
  database: "triptales_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// module.exports = pool.promise();
const promisePool = pool.promise();
export default promisePool;
