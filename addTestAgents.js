require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const testAgents = [
  {
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@remax.com',
    password: 'password123',
    role: 'agent',
    agentProfile: {
      licenseNumber: 'TX123456',
      licenseStates: ['TX', 'OK'],
      yearsOfExperience: 8,
      specialties: ['First Time Buyers', 'Luxury Homes'],
      languages: ['English', 'Spanish'],
      expertise: 'Residential',
      office: {
        name: 'RE/MAX Premier',
        address: {
          street: '123 Main St',
          city: 'Dallas',
          state: 'TX',
          zipCode: '75201'
        },
        phone: '(214) 555-0123'
      },
      bio: 'Experienced real estate agent specializing in luxury residential properties in the Dallas area.',
      contact: {
        officePhone: '(214) 555-0123',
        mobilePhone: '(214) 555-0124',
        website: 'https://sarah-johnson-remax.com'
      }
    }
  },
  {
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'michael.chen@remax.com',
    password: 'password123',
    role: 'agent',
    agentProfile: {
      licenseNumber: 'CA789012',
      licenseStates: ['CA', 'NV'],
      yearsOfExperience: 12,
      specialties: ['Industrial', 'Investments'],
      languages: ['English', 'Mandarin', 'Cantonese'],
      expertise: 'Commercial',
      office: {
        name: 'RE/MAX Gold Coast',
        address: {
          street: '456 Ocean Blvd',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90210'
        },
        phone: '(310) 555-0456'
      },
      bio: 'Commercial real estate specialist with over a decade of experience in high-value transactions.',
      contact: {
        officePhone: '(310) 555-0456',
        mobilePhone: '(310) 555-0457',
        website: 'https://michael-chen-remax.com'
      }
    }
  },
  {
    firstName: 'Emily',
    lastName: 'Rodriguez',
    email: 'emily.rodriguez@remax.com',
    password: 'password123',
    role: 'agent',
    agentProfile: {
      licenseNumber: 'FL345678',
      licenseStates: ['FL'],
      yearsOfExperience: 5,
      specialties: ['Condominiums', 'Lake/Beach Property'],
      languages: ['English', 'Spanish', 'Portuguese'],
      expertise: 'Residential',
      office: {
        name: 'RE/MAX Sunshine',
        address: {
          street: '789 Beach Ave',
          city: 'Miami',
          state: 'FL',
          zipCode: '33101'
        },
        phone: '(305) 555-0789'
      },
      bio: 'Passionate about helping clients find their dream homes in beautiful Miami.',
      contact: {
        officePhone: '(305) 555-0789',
        mobilePhone: '(305) 555-0790',
        website: 'https://emily-rodriguez-remax.com'
      }
    }
  },
  {
    firstName: 'David',
    lastName: 'Thompson',
    email: 'david.thompson@remax.com',
    password: 'password123',
    role: 'agent',
    agentProfile: {
      licenseNumber: 'NY901234',
      licenseStates: ['NY', 'NJ'],
      yearsOfExperience: 15,
      specialties: ['Luxury Homes', 'Historic Property'],
      languages: ['English', 'French'],
      expertise: 'Residential',
      office: {
        name: 'RE/MAX Manhattan',
        address: {
          street: '321 Park Ave',
          city: 'New York',
          state: 'NY',
          zipCode: '10001'
        },
        phone: '(212) 555-0321'
      },
      bio: 'Luxury real estate expert serving Manhattan\'s most discerning clients for over 15 years.',
      contact: {
        officePhone: '(212) 555-0321',
        mobilePhone: '(212) 555-0322',
        website: 'https://david-thompson-remax.com'
      }
    }
  },
  {
    firstName: 'Lisa',
    lastName: 'Wang',
    email: 'lisa.wang@remax.com',
    password: 'password123',
    role: 'agent',
    agentProfile: {
      licenseNumber: 'WA567890',
      licenseStates: ['WA', 'OR'],
      yearsOfExperience: 7,
      specialties: ['New Construction', 'Relocation'],
      languages: ['English', 'Mandarin', 'Korean'],
      expertise: 'Residential',
      office: {
        name: 'RE/MAX Northwest',
        address: {
          street: '654 Pine St',
          city: 'Seattle',
          state: 'WA',
          zipCode: '98101'
        },
        phone: '(206) 555-0654'
      },
      bio: 'Specializing in helping tech professionals find sustainable and modern homes in the Pacific Northwest.',
      contact: {
        officePhone: '(206) 555-0654',
        mobilePhone: '(206) 555-0655',
        website: 'https://lisa-wang-remax.com'
      }
    }
  }
];

async function addTestAgents() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected successfully');

    for (const agentData of testAgents) {
      // Check if agent already exists
      const existingAgent = await User.findOne({ email: agentData.email });
      if (existingAgent) {
        console.log(`Agent ${agentData.firstName} ${agentData.lastName} already exists, skipping...`);
        continue;
      }

      const agent = new User(agentData);
      await agent.save();
      console.log(`Created agent: ${agentData.firstName} ${agentData.lastName}`);
    }

    console.log('All test agents added successfully!');
  } catch (error) {
    console.error('Error adding test agents:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

addTestAgents();