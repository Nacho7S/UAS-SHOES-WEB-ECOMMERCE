import cartController from "../../../../controllers/cartController";
import { createResponse } from "../../../../helper/createResponse";
import { mockReq, mockRes, responseData, responseStatus } from "../../../../helper/moqReqRes";
import { parseRequestBody } from "../../../../helper/parseRequestBody";
import { authenticateUser } from "../../../../libs/aut";

export async function GET(request) {
  try {
    
    const auth = await authenticateUser(request);
    if (!auth.user) {
      const authMessage = await auth.json()
      return createResponse(authMessage, authUser.status)
    };
    
    const mockReqGet = mockReq({
      user: auth.user
    });
    
    await cartController.getCart(mockReqGet, mockRes);
    
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

export async function POST(request) {
  try {
    const auth = await authenticateUser(request);
    if (!auth.user) {
      const authMessage = await auth.json()
      return createResponse(authMessage, authUser.status)
    };

    const body = await parseRequestBody(request)

    const mockReqPost = mockReq({
      body,
      user: auth.user
    })

    await cartController.addToCart(mockReqPost, mockRes);

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

export async function PUT(request) {
  try {
    
    const auth = await authenticateUser(request);
    if (!auth.user) {
      const authMessage = await auth.json()
      return createResponse(authMessage, authUser.status)
    };

    const body = await parseRequestBody(request);
    const mockReqPut = mockReq({
      body,
      user: auth.user
    })

    await cartController.updateQuantity(mockReqPut, mockRes);

    return createResponse(responseData, responseStatus);

  } catch (error) {
    console.log(error);
    
  }
}

export async function DELETE(request) {
  try {
    const auth = await authenticateUser(request);
    if (!auth.user) {
      const authMessage = await auth.json()
      return createResponse(authMessage, authUser.status)
    };
    
    const mockReqDelete = mockReq({
      user: auth.user
    })

    await cartController.clearCart(mockReqDelete, mockRes);

    return createResponse(responseData, responseStatus);
    
  } catch (error) {
    console.log(error);
  }
}