const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const User = require('./models/User');

async function diagnoseAgentCreation() {
  try {
    console.log('🔍 Diagnosing agent creation issues...\n');
    
    // Test with minimal required data (what a user might enter)
    const minimalAgentData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe.test@example.com',
      password: 'password123',
      role: 'agent',
      agentProfile: {
        status: 'active',
        verified: true
      }
    };

    console.log('1️⃣ Testing minimal agent creation...');
    try {
      const existingUser = await User.findOne({ email: minimalAgentData.email });
      if (existingUser) {
        await User.deleteOne({ email: minimalAgentData.email });
      }
      
      const minimalAgent = await User.create(minimalAgentData);
      console.log('✅ Minimal agent created successfully');
      await User.deleteOne({ _id: minimalAgent._id });
    } catch (error) {
      console.log('❌ Minimal agent creation failed:', error.message);
      if (error.errors) {
        Object.keys(error.errors).forEach(key => {
          console.log(`   - ${key}: ${error.errors[key].message}`);
        });
      }
    }

    // Test with form data that might have issues
    const problematicData = {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith.test@example.com',
      password: 'password123',
      role: 'agent',
      agentProfile: {
        licenseNumber: '',  // Empty string
        licenseStates: [],  // Empty array
        yearsOfExperience: '', // Empty string instead of number
        specialties: [], // Empty array
        languages: [], // Empty array
        expertise: 'Residential',
        office: {
          name: '',
          address: {
            street: '',
            city: '',
            state: '',
            zipCode: ''
          },
          phone: ''
        },
        bio: '',
        contact: {
          officePhone: '',
          mobilePhone: '',
          website: ''
        },
        status: 'active',
        verified: true
      }
    };

    console.log('\n2️⃣ Testing with empty/problematic values...');
    try {
      const existingUser = await User.findOne({ email: problematicData.email });
      if (existingUser) {
        await User.deleteOne({ email: problematicData.email });
      }
      
      const problematicAgent = await User.create(problematicData);
      console.log('✅ Agent with empty values created successfully');
      await User.deleteOne({ _id: problematicAgent._id });
    } catch (error) {
      console.log('❌ Agent with empty values failed:', error.message);
      if (error.errors) {
        Object.keys(error.errors).forEach(key => {
          console.log(`   - ${key}: ${error.errors[key].message}`);
        });
      }
    }

    // Test with invalid enum values
    const invalidEnumData = {
      firstName: 'Bob',
      lastName: 'Wilson',
      email: 'bob.wilson.test@example.com',
      password: 'password123',
      role: 'agent',
      agentProfile: {
        licenseStates: ['INVALID_STATE'],
        specialties: ['Invalid Specialty'],
        expertise: 'Invalid Expertise',
        status: 'active',
        verified: true
      }
    };

    console.log('\n3️⃣ Testing with invalid enum values...');
    try {
      const existingUser = await User.findOne({ email: invalidEnumData.email });
      if (existingUser) {
        await User.deleteOne({ email: invalidEnumData.email });
      }
      
      const invalidAgent = await User.create(invalidEnumData);
      console.log('✅ Agent with invalid enums created (unexpected!)');
      await User.deleteOne({ _id: invalidAgent._id });
    } catch (error) {
      console.log('❌ Agent with invalid enums failed (expected):', error.message);
      if (error.errors) {
        Object.keys(error.errors).forEach(key => {
          console.log(`   - ${key}: ${error.errors[key].message}`);
        });
      }
    }

    console.log('\n📋 Valid enum values:');
    console.log('License States:', ['AK', 'AL', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA', 'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME', 'MI', 'MN', 'MO', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VA', 'VT', 'WA', 'WI', 'WV', 'WY']);
    console.log('Specialties:', ['Rentals', 'Auctions', 'Business Opportunities', 'Buyer Brokerage', 'Condominiums', 'Development Land', 'Farm Land', 'Farm/Ranch', 'First Time Buyers', 'Foreclosure Property', 'Historic Property', 'Horse Property', 'Hospitality', 'Industrial', 'International', 'Investments', 'Lake/Beach Property', 'Land', 'Luxury Homes', 'Military', 'Multi-Family', 'New Construction', 'None', 'Office', 'Power of Sale', 'Property Management', 'RE/MAX Other', 'Relocation', 'Residential Acreages', 'Retail', 'Senior Communities', 'Short Sales', 'Time Share', 'Vacation and Resorts', 'Vineyards']);
    console.log('Expertise:', ['Commercial', 'Commercial / Residential', 'Residential', 'Residential / Commercial']);

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  } finally {
    mongoose.disconnect();
  }
}

diagnoseAgentCreation();