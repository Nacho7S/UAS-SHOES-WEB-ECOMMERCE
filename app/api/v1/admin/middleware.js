import { authenticateUser } from "../../../libs/aut";

export const adminOnly = async (request, res) => {
  try {
    const auth = await authenticateUser(request);
    

    if (!auth.authenticated) {
      return res.status(auth.status).json({ success: false, message: auth.message });
    }
  
    if (auth.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    } else {
      return auth
    }

  } catch (error) {
    console.log(error);
    
  }
}

export const adminAndModOnly = async (request, res) => {
  try {
    const auth = await authenticateUser(request);
    

    if (!auth.authenticated) {
      return res.status(auth.status).json({ success: false, message: auth.message });
    }
  
    if (auth.user.role !== 'admin' && auth.user.role !== 'moderator') {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    } else {
      return auth
    }

  } catch (error) {
    console.log(error);
    
  }
}