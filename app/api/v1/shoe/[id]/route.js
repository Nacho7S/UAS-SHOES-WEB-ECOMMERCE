import shoeController from "../../../../controllers/shoeController";
import { createResponse } from "../../../../helper/createResponse";
import { mockReq, mockRes, responseData, responseStatus } from "../../../../helper/moqReqRes";

export async function GET(request, {params}) {
  try {
    const mockReqGet = mockReq({
      params,
    })
    await shoeController.getShoeById(mockReqGet, mockRes);
    return createResponse(responseData, responseStatus);
  } catch (error) {
    console.log(error);
  }
}