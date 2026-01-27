import userController from '../../../../controllers/userController';
import { createResponse } from '../../../../helper/createResponse';
import { parseRequestBody } from '../../../../helper/parseRequestBody';

 
export async function POST(request) {
  try {

    const body = await parseRequestBody(request)

    const mockReq = { body };

    let responseData;
    let responseStatus = 200;

    const mockRes = {
      status: function(code) {
        responseStatus = code;
        return this;
      },
      json: function(data) {
        responseData = data;
        return createResponse(data, responseStatus);
      }
    };

const result = await userController.register(mockReq, mockRes);

    if (result instanceof Response) {
      return result;
    }

    return createResponse(responseData, responseStatus);

  } catch (error) {
    console.error('Registration error:', error);
    return Response.json({
      success: false,
      message: 'Internal server error during registration',
      error: error.message
    }, { status: 500 });
  }
}