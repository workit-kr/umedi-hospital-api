import pg from "pg";

const { Pool } = pg;
const cli = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DB,
  password: process.env.PG_PASSWORD,
  port: 5432,
});
cli.connect();

export const handler = async (event) => {
  const queryStrings = event.queryStringParameters;

  const response = {
    statusCode: 200,
    body: JSON.stringify(`speciality: ${queryStrings.speciality}`),
  };
  return response;
};
