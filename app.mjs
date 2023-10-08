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
  var resp = {};

  const path = event.pathParameters;
  const hospitalId = path ? path.id : null
  
  console.log(`hospital id: ${hospitalId}`);

  if (hospitalId !== null) {
    resp = getHospitalInfo(hospitalId)
  };

  const queryStrings = event.queryStringParameters;

  if (queryStrings !== null) {
    const speciality = queryStrings.speciality
    const city = queryStrings.city

    resp = fetchHospitals(speciality, city);
  }

  return resp
}

async function getHospitalInfo(hospitalId) {
  try {
    const result = await pool.query('select * from umedi.hospital where id = $1', [hospitalId]);
    if (result.rowCount == 0) {
      return buildResponse(404, {"message": "no item"})
    };

    return buildResponse(200, result.rows[0])
  }
  catch (error) {
    console.error('server error');
    return buildResponse(500, {"message": "server error"})
  }
}

async function fetchHospitals(speciality, city) {
  var query = 'select * from umedi.hospital where (speciality_1 = $1 or speciality_2 = $1)'
  var params = [speciality]

  if (city) {
    query += ' and city ilike $2';
    params.push('%' + city + '%')
  };

  console.log(`query: ${query}`)
  console.log(`query parameters: ${params}`)

  try {
    const result = await pool.query(query, params);

    if (result.rowCount == 0) {
      return buildResponse(404, {"message": "no items"})
    };

    return buildResponse(200, result.rows)
  }
  catch (error) {
    console.error('server error');
    return buildResponse(500, {"message": "server error"})
  }
}

function buildResponse(statusCode, respBody) {
  return {
    statusCode: statusCode,
    body: JSON.stringify(respBody)
  }
}