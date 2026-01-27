export const createResponse = (data, status = 200) => {
return Response.json(data, { status });
};