import shoeController from "../../../../controllers/shoeController";
import { createResponse } from "../../../../helper/createResponse";
import { mockReq, mockRes, responseData, responseStatus } from "../../../../helper/moqReqRes";
import { parseRequestBody } from "../../../../helper/parseRequestBody";
import { adminAndModOnly } from "../middleware";


export async function POST(request) {
  try {
    const authUser = await adminAndModOnly(request);
    if (!authUser.user) {
              const authMessage = await authUser.json()
              return createResponse(authMessage, authUser.status)
    }
    
    const body = await parseRequestBody(request);
    const mockReqPost = mockReq({
      body,
      user: authUser.user
    })

    await shoeController.addShoe(mockReqPost, mockRes);

    return createResponse(responseData, responseStatus);
    
  } catch (error) {
    console.log(error);
    return Response.json({
      success: false,
      message: 'Internal server error during login',
      error: error.message
    }, { status: 500 });
  }
}