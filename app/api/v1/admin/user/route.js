import userController from "../../../../controllers/userController";
import { createResponse } from "../../../../helper/createResponse";
import { mockReq, mockRes, responseData, responseStatus } from "../../../../helper/moqReqRes";
import { parseRequestBody } from "../../../../helper/parseRequestBody";
import { adminAndModOnly, adminOnly} from "../middleware";

export async function GET(request){
  try {

    const authUser = await adminAndModOnly(request, mockRes)
    if (!authUser.user) {
      const authMessage = await authUser.json()
      return createResponse(authMessage, authUser.status)
    }

    
  const mockReqQuery = mockReq({ query: Object.fromEntries(new URL(request.url).searchParams), user: authUser.user })
  
  await userController.getAllUser(mockReqQuery, mockRes);
    
    return createResponse(responseData, responseStatus)
  } catch (error) {
    console.log(error);
    return Response.json({
      success: false,
      message: 'Internal server error during login',
      error: error.message
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
const authUser = await adminOnly(request, mockRes)
    if (!authUser.user) {
      const authMessage = await authUser.json()
      return createResponse(authMessage, authUser.status)
    }

    const body = await parseRequestBody(request);
    
    const mockReqPost = mockReq({
      body,
      user:authUser.user
    })
    await userController.register(mockReqPost, mockRes)

    return createResponse(responseData, responseStatus);

  } catch (error) {
    console.log(error);
    
  }
}
