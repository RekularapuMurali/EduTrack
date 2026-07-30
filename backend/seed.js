// backend/seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const User     = require('./models/User');
const Student  = require('./models/Student');

const seed = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected:', mongoose.connection.host);

    console.log('\nClearing existing data...');
    await User.deleteMany({});
    await Student.deleteMany({});

    console.log('Creating admin...');
    await User.create({
      name:     'Kavita Reddy',
      email:    'admin@edutrack.org',
      password: 'password123',
      role:     'admin',
      avatar:   'KR',
      isActive: true,
    });

    console.log('Creating volunteer...');
    const volunteer = await User.create({
      name:     'Priya Nair',
      email:    'priya@edutrack.org',
      password: 'password123',
      role:     'volunteer',
      avatar:   'PN',
      isActive: true,
    });

    console.log('Creating student user...');
    const studentUser = await User.create({
      name:     'Arjun Sharma',
      email:    'arjun@student.org',
      password: 'password123',
      role:     'student',
      avatar:   'AS',
      isActive: true,
    });

    console.log('Creating student profile...');
    await Student.create({
      user:        studentUser._id,
      volunteer:   volunteer._id,
      grade:       '8th',
      school:      'Delhi Public School',
      parentName:  'Ramesh Sharma',
      parentPhone: '+91 98765 43210',
      address:     'Sector 14, Noida',
      status:      'active',
      greenPoints: 0,
    });

    console.log('\n✅ Seed complete! Login credentials:');
    console.log('  Admin     → admin@edutrack.org  / password123');
    console.log('  Volunteer → priya@edutrack.org  / password123');
    console.log('  Student   → arjun@student.org   / password123');

  } catch (err) {
    console.error('❌ Seed failed:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB.');
    process.exit(0);
  }
};

seed();