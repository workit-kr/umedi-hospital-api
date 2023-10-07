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
  const queryStrings = event.queryStringParameters;
  console.log(`speciality keyword: ${ queryStrings.speciality }`);
  console.log(`region keyword: ${ queryStrings.region }`);

  const response = {
    statusCode: 200,
    body: JSON.stringify(`query: ${queryStrings.speciality}`),
  };
  return response;
};
