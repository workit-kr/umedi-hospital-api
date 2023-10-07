const { Client } = require("pg");


const cli = new Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DB,
  password: process.env.PG_PASSWORD,
  port: 5432
});

cli.connect();
console.log(`${cli.user ? cli.user : "None"}`)

export const handler = async (event) => {
  // TODO implement
  console.log(event)
  const response = {
    statusCode: 200,
    body: JSON.stringify('hospital api deployed from github action'),
  };
  return response;
};
