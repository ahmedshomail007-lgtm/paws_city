const mongoose = require('mongoose');

const vetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  specialization: {
    type: String,
    required: true,
    trim: true
  },
  experience: {
    type: String,
    required: true
  },
  qualifications: [{
    degree: String,
    institution: String,
    year: Number
  }],
  licenseNumber: {
    type: String,
    required: true,
    unique: true
  },
  clinicName: {
    type: String,
    trim: true
  },
  clinicAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  services: [{
    type: String
  }],
  availability: {
    days: [String],
    hours: {
      start: String,
      end: String
    }
  },
  consultationFee: {
    type: Number
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  profileImage: {
    type: String
  },
  documents: [{
    type: String,
    url: String
  }],
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  approvedAt: {
    type: Date
  },
  rejectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  rejectedAt: {
    type: Date
  },
  rejectionReason: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Vet', vetSchema);
