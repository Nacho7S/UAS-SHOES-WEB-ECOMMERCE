import { verifyToken } from '../helper/jwtToken.js';


export const extractToken = async (cookie) => {
  try {
    
    const cookies = Object.fromEntries(
      cookie.split(';').map(cookie => {
        const [key, ...value] = cookie.trim().split('=');
        return [key, value.join('=')];
      })
    );

    
    const token = cookies['auth-token'];
    
    if (!token) {
      return { authenticated: false, user: null };
    }
    return token
  } catch (error) {
    console.error('Authentication error:', error);
    return { authenticated: false, user: null };
  }
}


export const authenticateUser = async (req, res) => {
  try {
    const cookieHeader = req.headers.get('cookie');
    if (!cookieHeader) {
      return { authenticated: false, user: null,  status: 401, message: "unauthenticated"};
    }

    const token = await extractToken(cookieHeader);
    const decoded = await verifyToken(token);
      return { authenticated: true, user: { id: decoded.userId || decoded.id, role: decoded.role } };
    } catch (error) {
      console.error('Token verification error:', error);
      return { authenticated: false, user: null };
    }
};

export const requireRole = (roles = []) => {
  return (req) => {
    const auth = authenticateUser(req);
    if (!auth.authenticated) return auth;

    if (roles.length > 0 && !roles.includes(auth.user.role)) {
      return {
        success: false,
        error: 'Forbidden: Insufficient permissions',
        status: 403,
      };
    }
    return auth
  }
}