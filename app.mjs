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
    resp = getHospitalInfo(hospitalId);
  }
  else {
    const queryStrings = event.queryStringParameters;
    console.log(queryStrings);
    
    let speciality = ""
    let city = ""
    let keyword = ""

    if (queryStrings != null) {
      speciality = queryStrings.speciality;
      city = queryStrings.city;
      keyword = queryStrings.keyword;
    }

    resp = fetchHospitals(speciality, city, keyword);
  }
  return resp
}

async function getHospitalInfo(hospitalId) {
  try {
    const result = await pool.query(`
      select
        h.*,
        s."name" as speciality1_name,
        s2."name" as speciality2_name
      from
        umedi.hospital h
      left outer join
        umedi.speciality s on h.speciality_1 = s.code
      left outer join
        umedi.speciality s2 on h.speciality_2 = s2.code
      where
        h.id = $1        
    `, [hospitalId]);

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

async function fetchHospitals(speciality, city, keyword) {
  let query = `
    select
      h.*,
      s."name" as speciality1_name,
      s2."name" as speciality2_name
    from
      umedi.hospital h
    left outer join
      umedi.speciality s on h.speciality_1 = s.code
    left outer join
      umedi.speciality s2 on h.speciality_2 = s2.code
    where 1=1
  `;

  let params = [];
  
  if (speciality) {
    params.push(speciality);
    query += ` and  (speciality_1 = $${params.length} or speciality_2 = $${params.length})`;
  };

  if (city) {
    params.push('%' + city + '%');
    query += ` and city ilike $${params.length}`;
  };

  if (keyword) {
    params.push('%' + keyword + '%');
    query += ` and name ilike $${params.length}`;
  }

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
    console.error(error)
    return buildResponse(500, {"message": "server error"})
  }
}

function buildResponse(statusCode, respBody) {
  return {
    statusCode: statusCode,
    headers: {
      "Access-Control-Allow-Headers" : 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token',
      "Access-Control-Allow-Origin": '*',
      "Access-Control-Allow-Methods": 'GET'
    },
    body: JSON.stringify(respBody)
  }
}
