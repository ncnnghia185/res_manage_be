const { Client } = require("pg");
require("dotenv").config();

const client = new Client({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
});

const connectDb = async () => {
  try {
    await client.connect();
    console.log("Connected to postgres database");
  } catch (error) {
    console.log("Connect failed", error);
  }
};

module.exports = {
  client,
  connectDb,
};
