import pg from "pg";

const { Pool } = pg;
const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DB,
  password: process.env.PG_PASSWORD,
  port: 5432,
});
pool.connect();

export const handler = async (event) => {
  const hospitalId = event.pathParameters.id;
  console.log(`hospital id: ${hospitalId}`);

  const queryStrings = event.queryStringParameters;

  let respBody = "";
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
  pool.query("select * from umedi.hospital where id = $1", [hospitalId], (error, result) => {
    if (error) {
      throw error
    }
    return JSON.stringify(result.rows)
  });
}
