const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const addressSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['primary', 'secondary'],
    default: 'primary'
  },
  street: String,
  city: String,
  state: String,
  zipCode: String,
  country: {
    type: String,
    default: 'United States'
  }
});


const phoneSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['primary', 'secondary'],
    default: 'primary'
  },
  number: String
});


const notificationSchema = new mongoose.Schema({
  listingAlerts: {
    type: Boolean,
    default: true
  },
  favorites: {
    type: Boolean,
    default: true
  },
  newsletter: {
    type: Boolean,
    default: true
  }
});


const goalsSchema = new mongoose.Schema({
  buying: {
    goal: {
      type: String,
      enum: ['first-home', 'next-home', 'right-sizing', 'moving-to-us', 'just-browsing', 'none'],
      default: 'none'
    },
    timeline: {
      type: String,
      enum: ['3-months', '3-6-months', '6-plus-months', 'none'],
      default: 'none'
    }
  },
  selling: {
    goal: {
      type: String,
      enum: ['sell-home', 'sell-for-larger', 'sell-for-smaller', 'none'],
      default: 'none'
    }
  },
  educational: {
    goal: {
      type: String,
      enum: ['learn-news', 'learn-trends', 'none'],
      default: 'none'
    }
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});


const agentSchema = new mongoose.Schema({
  licenseNumber: {
    type: String,
    trim: true
  },
  licenseStates: [{
    type: String,
    enum: ['AK', 'AL', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA', 'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME', 'MI', 'MN', 'MO', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VA', 'VT', 'WA', 'WI', 'WV', 'WY']
  }],
  yearsOfExperience: {
    type: Number,
    min: 0,
    max: 50
  },
  specialties: [{
    type: String,
    enum: ['Rentals', 'Auctions', 'Business Opportunities', 'Buyer Brokerage', 'Condominiums', 'Development Land', 'Farm Land', 'Farm/Ranch', 'First Time Buyers', 'Foreclosure Property', 'Historic Property', 'Horse Property', 'Hospitality', 'Industrial', 'International', 'Investments', 'Lake/Beach Property', 'Land', 'Luxury Homes', 'Military', 'Multi-Family', 'New Construction', 'None', 'Office', 'Power of Sale', 'Property Management', 'RE/MAX Other', 'Relocation', 'Residential Acreages', 'Retail', 'Senior Communities', 'Short Sales', 'Time Share', 'Vacation and Resorts', 'Vineyards']
  }],
  languages: [{
    type: String
  }],
  expertise: {
    type: String,
    enum: ['Commercial', 'Commercial / Residential', 'Residential', 'Residential / Commercial'],
    default: 'Residential'
  },
  office: {
    name: String,
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String
    },
    phone: String
  },
  bio: {
    type: String,
    maxlength: 2000
  },
  profileImage: {
    type: String
  },
  coverImage: {
    type: String
  },
  socialMedia: {
    facebook: String,
    twitter: String,
    linkedin: String,
    instagram: String
  },
  contact: {
    officePhone: String,
    mobilePhone: String,
    website: String
  },
  achievements: [{
    title: String,
    year: Number,
    description: String
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending'],
    default: 'active'
  },
  verified: {
    type: Boolean,
    default: false
  },
  propertyCount: {
    type: Number,
    default: 0
  },
  rating: {
    average: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    totalReviews: {
      type: Number,
      default: 0
    }
  }
});


const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
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
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['user', 'agent', 'admin'],
    default: 'user'
  },
  agentProfile: agentSchema,
  addresses: [addressSchema],
  phoneNumbers: [phoneSchema],
  goals: goalsSchema,
  notifications: {
    type: notificationSchema,
    default: () => ({})
  },
  profileImage: {
    type: String
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});


userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

module.exports = mongoose.model('User', userSchema);