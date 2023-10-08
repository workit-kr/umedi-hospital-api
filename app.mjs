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
  const { hospitalId } = event.pathParameters;
  const queryStrings = event.queryStringParameters;

  var respBody = "";

  if (hospitalId !== null) {
    respBody = getHospitalInfo(hospitalId);
  }

  const response = {
    statusCode: 200,
    body: respBody,
  };
  return response;
};

function getHospitalInfo(hospitalId) {
  return JSON.stringify(`hospital id: ${hospitalId}`);
}
