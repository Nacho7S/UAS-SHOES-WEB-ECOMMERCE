import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  role: {
    type: String,
    required: true,
    default: 'customer',
    enum: ['customer', 'admin', 'moderator']
  },
  lastLogin: {
    type: Date,
    default: null,
  },
  online: {
    type: Boolean
  }
}, {
  timestamps: true 
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User