import shoeController from "../../../../../controllers/shoeController";
import { createResponse } from "../../../../../helper/createResponse";
import { mockReq, mockRes, responseData, responseStatus } from "../../../../../helper/moqReqRes";
import { parseRequestBody } from "../../../../../helper/parseRequestBody";
import { adminAndModOnly, adminOnly } from "../../middleware";


export async function PUT(request, { params }) {
  const authUser = await adminAndModOnly(request, mockRes);
  if (!authUser.user) {
                const authMessage = await authUser.json()
                return createResponse(authMessage, authUser.status)
  }
  
  try {
    const body = await parseRequestBody(request);
    const mockReqPut = mockReq({
      params,
      body,
      user: authUser.user

    })
    await shoeController.editShoe(mockReqPut, mockRes);

    return createResponse(responseData, responseStatus);

  } catch (error) {
    console.log(error); 
  }
}

export async function DELETE(request, { params }) {
  try {
    const authUser = await adminOnly(request, mockRes);

    
    if (!authUser.user) {
                const authMessage = await authUser.json()
                return createResponse(authMessage, authUser.status)
    }
    
    const mockReqDelete = mockReq({
      params,
      user: authUser.user
    })

    await shoeController.deleteShoe(mockReqDelete, mockRes);

    return createResponse(responseData, responseStatus);
  } catch (error) {
    console.log(error);
  }
}

export async function PATCH(request, { params }) {
  const authUser = await adminAndModOnly(request, mockRes);
  if (!authUser.user) {
                const authMessage = await authUser.json()
                return createResponse(authMessage, authUser.status)
  }
  
  try {
    const body = await parseRequestBody(request);
    const mockReqPatch = mockReq({
      params,
      body,
      user: authUser.user

    })
    await shoeController.updateStock(mockReqPatch, mockRes);

    return createResponse(responseData, responseStatus);

  } catch (error) {
    console.log(error); 
  }
}