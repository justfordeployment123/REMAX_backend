const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const User = require('./models/User');

async function testAgentCreation() {
  try {
    console.log('Testing agent creation...');
    
    // Test data that matches the form structure
    const testAgentData = {
      firstName: 'Test',
      lastName: 'Agent',
      email: 'testagent@example.com',
      password: 'testpass123',
      role: 'agent',
      agentProfile: {
        licenseNumber: 'TEST123',
        licenseStates: ['CA', 'NY'],
        yearsOfExperience: 5,
        specialties: ['First Time Buyers', 'Luxury Homes'],
        languages: ['English', 'Spanish'],
        expertise: 'Residential',
        office: {
          name: 'Test Office',
          address: {
            street: '123 Test St',
            city: 'Test City',
            state: 'CA',
            zipCode: '12345'
          },
          phone: '555-123-4567'
        },
        bio: 'Test agent bio',
        contact: {
          officePhone: '555-123-4567',
          mobilePhone: '555-987-6543',
          website: 'https://test.com'
        },
        status: 'active',
        verified: true
      }
    };

    // Check if user already exists
    const existingUser = await User.findOne({ email: testAgentData.email });
    if (existingUser) {
      console.log('Deleting existing test user...');
      await User.deleteOne({ email: testAgentData.email });
    }

    // Try to create the agent
    console.log('Creating test agent...');
    const agent = await User.create(testAgentData);
    console.log('✅ Agent created successfully:', {
      id: agent._id,
      name: `${agent.firstName} ${agent.lastName}`,
      email: agent.email,
      role: agent.role
    });

    // Clean up
    await User.deleteOne({ _id: agent._id });
    console.log('✅ Test agent cleaned up');

  } catch (error) {
    console.error('❌ Error creating agent:', error.message);
    if (error.errors) {
      console.error('Validation errors:');
      Object.keys(error.errors).forEach(key => {
        console.error(`  - ${key}: ${error.errors[key].message}`);
      });
    }
  } finally {
    mongoose.disconnect();
  }
}

testAgentCreation();