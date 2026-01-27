import userController from '../../../../controllers/userController';
import { authenticateUser } from '../../../../libs/aut';

export async function GET(request) {
  try {
    const auth = await authenticateUser(request)

   if (!auth.user) {
      return Response.json({
        success: false,
        message: 'User not found'
      }, { status: 404 });
    }

    const result = await userController.currentUser(auth.user.id)



    return Response.json(
      {
        success: result.success,
        ...(result.user && { user: result.user }),
        ...(result.message && { message: result.message })
      },
      { status: result.status }
    );

  } catch (error) {
    console.error('Auth verification error:', error);
    return Response.json({
      success: false,
      message: 'Internal server error during verification',
      error: error.message
    }, { status: 500 });
  }
}