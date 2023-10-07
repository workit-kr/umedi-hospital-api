import pg from 'pg'
const { Client } = pg

const cli = new Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DB,
  password: process.env.PG_PASSWORD,
  port: 5432
});

cli.connect();
console.log(`Database Connected: ${cli.user}`)

export const handler = async (event) => {
  console.log(`lambda event: ${event}`)
  const queryStrings = event.queryStringParameters;
  console.log(`query strings: ${queryStrings}`)
  const response = {
    statusCode: 200,
    body: JSON.stringify(`hospital`),
  };
  return response;
};
