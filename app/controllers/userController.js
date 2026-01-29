import { comparePasswordSync, hashPasswordSync } from '../helper/bcrypt';
import { generateToken, verifyToken } from '../helper/jwtToken';
import { connectDB } from '../libs/mongoDb';
import User from '../models/userModel';


class userController {

  static async register(req, res, next) {
    try {
      const currentUserRole = req.user?.role;
      connectDB();
      const { username, password, email, role } = req.body;

      if (!username || !password || !email) {
      return res.status(400).json({
        success: false,
        message: 'Username, password, and email are required'
      });
      }
      
      const existingUser = await User.findOne({
      $or: [{ username }, { email }]
      });
      
      if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this username or email already exists'
      });
      }
      
      if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
      }
      
    const hashedPassword = hashPasswordSync(password);

      let newUserTemp = {
      username,
      password: hashedPassword,
      email,
      lastLogin: new Date()
      }

      if (currentUserRole === 'admin') {
        newUserTemp["role"] = role
      }
      
      
    const newUser = await User.create(
      newUserTemp
    );
      

    const token = await generateToken({
      userId: newUser._id.toString(),
      username: newUser.username,
      role: newUser.username
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        id: newUser._id.toString(),
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      }
    });

    } catch (error) {
      console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during registration',
      error:error.message
    });
    }
  }

  static async login(req, res, next) {
    connectDB();
    try {
      
      const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

   const user = await User.findOneAndUpdate(
    { $or: [{ username:username }, { email:username }] },
    { $set: { lastLogin: new Date() } },
    { new: true }  
);
      
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isPasswordValid = comparePasswordSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = await generateToken({
      userId: user._id.toString(),
      username: user.username,
      role: user.role
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
    } catch (error) {
      console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during login',
      error: error.message
    });
    }
  }

  static async currentUser(id) {
    await connectDB();

    try {
      const user = await User.findById(id).select('-password');

      if (!user) {
        return {
          success: false,
          status: 404,
          message: 'User not found',
          user: null
        };
      }

      return {
        success: true,
        status: 200,
        user: {
          userId: user._id.toString(),
          username: user.username,
          email: user.email,
          role: user.role
        }
      };
    } catch (verificationError) {
      return {
        success: false,
        status: 401,
        message: 'Invalid or expired token',
        user: null
      };
    }

    
  }

  static async getAllUser(req, res, next) {
    try {
      await connectDB();

      const page = parseInt(req.query?.page) || 1;
      const limit = parseInt(req.query?.limit) || 10;
      const skip = (page - 1) * limit;

      
      const filter = {};
      if (req.query?.role) filter.role = req.query.role;
      if (req.query?.search) {
        filter.$or = [
          { username: { $regex: req.query.search, $options: 'i' } },
          { email: { $regex: req.query.search, $options: 'i' } }
        ];
      }

      const users = await User.find(filter)
        .select('-password')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      const total = await User.countDocuments(filter);
      
      res.status(200).json({
        success: true,
        data: users,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalUsers: total,
          limit
        }
      });
    } catch (error) {
      console.error('Get all users error:', error);
      return {
        success: false,
        message: 'Internal server error while fetching users',
        data: error.message
      };
    }
  }

  static async editUser(req, res, next) {
    try {
      await connectDB();

      const { id } = await req.params || await req.body;
      const { username, email, role, password } = req.body;
      const currentUserId = req.user?.id; 
      const currentUserRole = req.user?.role;      

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
      }

    
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      

      if (currentUserRole !== 'admin' && currentUserId !== id) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: You can only edit your own profile'
        });
      }

     
      if (role && user.role !== role && currentUserRole !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: Only admin can change user role'
        });
      }

     
      if (currentUserId === id && role && role !== 'admin' && user.role === 'admin') {
        const adminCount = await User.countDocuments({ role: 'admin' });
        if (adminCount <= 1) {
          return res.status(400).json({
            success: false,
            message: 'Cannot remove the last admin'
          });
        }
      }

     
      if (username || email) {
        const duplicateCheck = await User.findOne({
          _id: { $ne: id },
          $or: [
            ...(username ? [{ username }] : []),
            ...(email ? [{ email }] : [])
          ]
        });

        if (duplicateCheck) {
          return res.status(409).json({
            success: false,
            message: 'Username or email already taken by another user'
          });
        }
      }

  
      const updateData = {};
      if (username) updateData.username = username;
      if (email) updateData.email = email;
      if (role && currentUserRole === 'admin') updateData.role = role;
      if (password) {
        if (password.length < 6) {
          return res.status(400).json({
            success: false,
            message: 'Password must be at least 6 characters long'
          });
        }
        updateData.password = hashPasswordSync(password);
      }

      const updatedUser = await User.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      ).select('-password');

      res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: updatedUser
      });

    } catch (error) {
      console.error('Edit user error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while updating user',
        error: error.message
      });
    }
  }

  static async deleteUser(req, res, next) {
    try {
      await connectDB();

      const { id } = await req.params || await req.body;
      const currentUserId = req.user?.id;
      const currentUserRole = req.user?.role;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
      }

   
      if (id === currentUserId) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete your own account'
        });
      }

      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }


      if (user.role === 'admin') {
        const adminCount = await User.countDocuments({ role: 'admin' });
        if (adminCount <= 1) {
          return res.status(400).json({
            success: false,
            message: 'Cannot delete the last admin account'
          });
        }
      }

      await User.findByIdAndDelete(id);

      res.status(200).json({
        success: true,
        message: 'User deleted successfully',
        data: {
          deletedUserId: id,
          username: user.username
        }
      });

    } catch (error) {
      console.error('Delete user error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while deleting user',
        error: error.message
      });
    }
  }

  static async getUserById(req, res, next) {
    try {
      await connectDB();

      const { id } = await req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
      }

      const user = await User.findById(id).select('-password');

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'User retrieved successfully',
        data: user
      });

    } catch (error) {
      console.error('Get user by ID error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while fetching user',
        error: error.message
      });
    }
  }

  static async changePassword(req, res, next) {
    try {
      await connectDB();

      const { currentPassword, newPassword } = req.body;
      const userId = req.user?.userId;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Current password and new password are required'
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'New password must be at least 6 characters long'
        });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      const isCurrentValid = comparePasswordSync(currentPassword, user.password);
      if (!isCurrentValid) {
        return res.status(401).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }

      user.password = hashPasswordSync(newPassword);
      await user.save();

      res.status(200).json({
        success: true,
        message: 'Password changed successfully'
      });

    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while changing password',
        error: error.message
      });
    }
  }
}

export default userController