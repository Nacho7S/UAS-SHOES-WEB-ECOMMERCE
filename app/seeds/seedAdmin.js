import { hashPasswordSync } from '../helper/bcrypt.js';
import { connectDB } from '../libs/mongoDb.js';
import User from '../models/userModel.js';
import dotenv from 'dotenv';

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();
    
    console.log('🌱 Starting admin seed...');

    
    const adminConfig = {
      username: process.env.ADMIN_USERNAME || 'admin',
      email: process.env.ADMIN_EMAIL || 'admin@example.com',
      password: process.env.ADMIN_PASSWORD || 'admin123',
      role: 'admin',
    };


    if (adminConfig.password.length < 6) {
      throw new Error('Admin password must be at least 6 characters');
    }

    const existingAdmin = await User.findOne({
      $or: [{ username: adminConfig.username }, { email: adminConfig.email }]
    });

    if (existingAdmin) {
      console.log('⚠️  Admin already exists');
      process.exit(0);
    }

    const hashedPassword = hashPasswordSync(adminConfig.password);

    const admin = await User.create({
      username: adminConfig.username,
      email: adminConfig.email,
      password: hashedPassword,
      role: adminConfig.role,
      lastLogin: new Date()
    });

    console.log('✅ Admin created successfully!');
    console.log(`   Username: ${admin.username}`);
    console.log(`   Email: ${admin.email}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

seedAdmin();