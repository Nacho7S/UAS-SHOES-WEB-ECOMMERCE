import cartController from "../../../../../controllers/cartController";
import { createResponse } from "../../../../../helper/createResponse";
import { mockReq, mockRes, responseData, responseStatus } from "../../../../../helper/moqReqRes";
import { authenticateUser } from "../../../../../libs/aut";

export async function DELETE(request, {params}) {
  try {
    const auth = await authenticateUser(request);
    console.log(auth, "auth");
    
    if (!auth.user) {
      const authMessage = await auth.json()
      return createResponse(authMessage, authUser.status)
    };

    const mockReqDelete = mockReq({
      user: auth.user,
      params
    })

    await cartController.removeFromCart(mockReqDelete, mockRes);

    return createResponse(responseData, responseStatus);

  } catch (error) {
    console.log(error);
  }
}