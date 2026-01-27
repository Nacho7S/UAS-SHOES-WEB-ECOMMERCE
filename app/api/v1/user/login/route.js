import userController from '../../../../controllers/userController';
import { createResponse } from '../../../../helper/createResponse';
import { hasToken, mockReq, mockRes, responseData, responseStatus, tokenValue } from '../../../../helper/moqReqRes';
import { parseRequestBody } from '../../../../helper/parseRequestBody';
import { cookies } from 'next/headers';


export async function POST(request) {
  try {
    const body = await parseRequestBody(request)
    const mockReqBody = mockReq({body})
   
    

    await userController.login(mockReqBody, mockRes);

    if (hasToken && tokenValue) {
      const cookieStore = await cookies();
      cookieStore.set('auth-token', tokenValue, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24,
        sameSite: 'strict',
        path: '/',
      });
    }

    return createResponse(responseData, responseStatus);

  } catch (error) {
    console.error('Login error:', error);
    return Response.json({
      success: false,
      message: 'Internal server error during login',
      error: error.message
    }, { status: 500 });
  }
}
