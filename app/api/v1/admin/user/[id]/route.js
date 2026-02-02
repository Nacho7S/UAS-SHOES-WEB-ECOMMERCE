import userController from "../../../../../controllers/userController";
import { createResponse } from "../../../../../helper/createResponse";
import { mockReq, mockRes, responseData, responseStatus } from "../../../../../helper/moqReqRes";
import { parseRequestBody } from "../../../../../helper/parseRequestBody";
import { adminAndModOnly, adminOnly } from "../../middleware";

export async function GET(request, {params}) {
  try {
    const authUser = await adminAndModOnly(request, mockRes);

    if (!authUser.user) {
          const authMessage = await authUser.json()
          return createResponse(authMessage, authUser.status)
    }
    
    const body = await parseRequestBody(request)
    const mockReqGet = mockReq({
      params,
      body,
      user: authUser.user
    })
  

    await userController.getUserById(mockReqGet, mockRes);

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

export async function PUT(request, { params }) {
  try {
    const authUser = await adminAndModOnly(request, mockRes);
    if (!authUser.user) {
          const authMessage = await authUser.json()
          return createResponse(authMessage, authUser.status)
    }

    const body = await parseRequestBody(request);
    const mockReqPut = mockReq({
      params,
      body,
      user: authUser.user
    })

    await userController.editUser(mockReqPut, mockRes);
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

export async function DELETE(request, {params}){
  try {
    const authUser = await adminOnly(request, mockRes);

    
    if (!authUser.user) {
   
      
          const authMessage = await authUser.json()
          return createResponse(authMessage, authUser.status)
    }

    const body = await parseRequestBody(request);
    const mockReqDelete = mockReq({
      params,
      body,
      user: authUser.user
    })

    await userController.deleteUser(mockReqDelete, mockRes);

    return createResponse(responseData, responseStatus);
    

  } catch (error) {
    console.log(error);
    
  }
}

