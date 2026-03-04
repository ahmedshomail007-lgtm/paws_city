const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Admin = require('./models/Admin');
const User = require('./models/User');
const Vet = require('./models/Vet');
const Pet = require('./models/Pet');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pawcity');
    
    // Clear existing data
    await Admin.deleteMany({});
    await User.deleteMany({});
    await Vet.deleteMany({});
    await Pet.deleteMany({});
    
    // Create admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = new Admin({
      name: 'System Admin',
      email: 'admin@pawcity.com',
      password: hashedPassword
    });
    await admin.save();
    
    // Create users
    const users = await User.insertMany([
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: await bcrypt.hash('password123', 10),
        type: 'Pet Owner',
        phone: '+1234567890'
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: await bcrypt.hash('password123', 10),
        type: 'Pet Owner',
        phone: '+1234567891'
      },
      {
        name: 'Dr. Wilson',
        email: 'wilson@example.com',
        password: await bcrypt.hash('password123', 10),
        type: 'Veterinarian',
        phone: '+1234567892'
      }
    ]);
    
    // Create vets
    await Vet.insertMany([
      {
        name: 'Dr. Sarah Johnson',
        email: 'sarah@vetclinic.com',
        phone: '+1234567893',
        specialization: 'General Practice',
        experience: '5 years',
        licenseNumber: 'VET001',
        clinicName: 'City Vet Clinic',
        consultationFee: 75,
        status: 'Pending'
      },
      {
        name: 'Dr. Mike Brown',
        email: 'mike@petcare.com',
        phone: '+1234567894',
        specialization: 'Surgery',
        experience: '8 years',
        licenseNumber: 'VET002',
        clinicName: 'Pet Care Center',
        consultationFee: 100,
        status: 'Approved'
      },
      {
        name: 'Dr. Lisa Wang',
        email: 'lisa@animalhealth.com',
        phone: '+1234567895',
        specialization: 'Dermatology',
        experience: '3 years',
        licenseNumber: 'VET003',
        clinicName: 'Animal Health Clinic',
        consultationFee: 85,
        status: 'Pending'
      }
    ]);
    
    // Create pets
    await Pet.insertMany([
      {
        name: 'Buddy',
        type: 'Dog',
        breed: 'Golden Retriever',
        age: { years: 2, months: 0 },
        gender: 'Male',
        owner: users[0]._id,
        status: 'Pending'
      },
      {
        name: 'Whiskers',
        type: 'Cat',
        breed: 'Persian',
        age: { years: 1, months: 0 },
        gender: 'Female',
        owner: users[1]._id,
        status: 'Approved'
      },
      {
        name: 'Max',
        type: 'Dog',
        breed: 'Labrador',
        age: { years: 3, months: 0 },
        gender: 'Male',
        owner: users[0]._id,
        status: 'Pending'
      }
    ]);
    
    console.log('Seed data created successfully!');
    console.log('Admin login: admin@pawcity.com / admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
