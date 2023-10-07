export const handler = async (event) => {
  // TODO implement
  console.log(event)
  const response = {
    statusCode: 200,
    body: JSON.stringify('hospital api deployed from github action'),
  };
  return response;
};
