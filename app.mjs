import pg from "pg";

const { Pool } = pg;
const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DB,
  password: process.env.PG_PASSWORD,
  port: 5432,
});
await pool.connect();

export const handler = async (event) => {
  const hospitalId = event.pathParameters.id;
  console.log(`hospital id: ${hospitalId}`);

  const queryStrings = event.queryStringParameters;
  var resp = {}

  if (hospitalId !== null) {
    resp = getHospitalInfo(hospitalId)
  }

  return resp
}

async function getHospitalInfo(hospitalId) {
  try {
    const result = await pool.query('select * from umedi.hospital where id = $1', [hospitalId]);
    if (result.rowCount == 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({"message": "no item"})
      }
    };

    return {
      statusCode: 200,
      body: JSON.stringify(result.rows[0])
    }
  }
  catch (error) {
    console.error('server error');
    return {
      statusCode: 500,
      body: JSON.stringify({"message": "server error"})
    }
  }
  finally {
    pool.end();
  };
}