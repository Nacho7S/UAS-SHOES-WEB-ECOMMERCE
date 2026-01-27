import { NextResponse } from 'next/server';
import { mockReq, mockRes, responseData, responseStatus } from '../../../helper/moqReqRes';
import shoeController from '../../../controllers/shoeController';
import { createResponse } from '../../../helper/createResponse';

export async function GET(request) {
  try {
    const searchParams = new URL(request.url).searchParams;
    
    const mockReqGet = mockReq({
      query: Object.fromEntries(searchParams)
    })
    await shoeController.getAllshoe(mockReqGet, mockRes);

    return createResponse(responseData, responseStatus);

  } catch (err) {
    console.log(err);
    
  }
};