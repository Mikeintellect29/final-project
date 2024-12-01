const mysql = require("mysql2");
require("dotenv").config();

// create a connection

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to database", err.err);
  } else {
    console.log("successfullly connected to database");
    connection.release();
  }
});

module.exports = db;
