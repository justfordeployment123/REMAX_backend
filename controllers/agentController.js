const User = require('../models/User');

exports.getAllAgents = async (req, res) => {
  try {
    const {
      city,
      state,
      zip,
      name,
      language,
      specialty,
      experience,
      licenseState,
      expertise,
      page = 1,
      limit = 10
    } = req.query;

    let query = { role: 'agent', 'agentProfile.status': 'active' };

    if (city || state || zip) {
      query['agentProfile.office.address'] = {};
      if (city) query['agentProfile.office.address'].city = new RegExp(city, 'i');
      if (state) query['agentProfile.office.address'].state = new RegExp(state, 'i');
      if (zip) query['agentProfile.office.address'].zipCode = new RegExp(zip, 'i');
    }

    if (name) {
      query.$or = [
        { firstName: new RegExp(name, 'i') },
        { lastName: new RegExp(name, 'i') },
        { 'agentProfile.office.name': new RegExp(name, 'i') }
      ];
    }

    if (language) {
      query['agentProfile.languages'] = new RegExp(language, 'i');
    }

    if (specialty) {
      query['agentProfile.specialties'] = specialty;
    }

    if (experience) {
      const expRange = experience.split('-');
      if (expRange.length === 2) {
        query['agentProfile.yearsOfExperience'] = {
          $gte: parseInt(expRange[0]),
          $lte: parseInt(expRange[1])
        };
      }
    }

    if (licenseState) {
      query['agentProfile.licenseStates'] = licenseState;
    }

    if (expertise) {
      query['agentProfile.expertise'] = expertise;
    }

    const agents = await User.find(query)
      .select('firstName lastName email phoneNumbers agentProfile')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ 'agentProfile.rating.average': -1, createdAt: -1 });

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        agents,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


exports.getAgentById = async (req, res) => {
  try {
    const agent = await User.findOne({ 
      _id: req.params.id, 
      role: 'agent' 
    }).select('-password');

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        agent
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


exports.createAgent = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      licenseNumber,
      licenseStates,
      yearsOfExperience,
      specialties,
      languages,
      expertise,
      office,
      bio,
      contact
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    const agentData = {
      firstName,
      lastName,
      email,
      password,
      role: 'agent',
      agentProfile: {
        licenseNumber,
        licenseStates,
        yearsOfExperience,
        specialties,
        languages,
        expertise,
        office,
        bio,
        contact,
        status: 'active',
        verified: true
      }
    };

    const agent = await User.create(agentData);

    res.status(201).json({
      success: true,
      data: {
        agent
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


exports.updateAgent = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      licenseNumber,
      licenseStates,
      yearsOfExperience,
      specialties,
      languages,
      expertise,
      office,
      bio,
      contact,
      status,
      verified
    } = req.body;

    const updateData = {};
    
    if (firstName !== undefined) {updateData.firstName = firstName;}
    if (lastName !== undefined) {updateData.lastName = lastName;}
    if (email !== undefined) {updateData.email = email;}

    const agentProfileUpdate = {};
    if (licenseNumber !== undefined) {agentProfileUpdate.licenseNumber = licenseNumber;}
    if (licenseStates !== undefined) {agentProfileUpdate.licenseStates = licenseStates;}
    if (yearsOfExperience !== undefined) {agentProfileUpdate.yearsOfExperience = yearsOfExperience;}
    if (specialties !== undefined) {agentProfileUpdate.specialties = specialties;}
    if (languages !== undefined) {agentProfileUpdate.languages = languages;}
    if (expertise !== undefined) {agentProfileUpdate.expertise = expertise;}
    if (office !== undefined) {agentProfileUpdate.office = office;}
    if (bio !== undefined) {agentProfileUpdate.bio = bio;}
    if (contact !== undefined) {agentProfileUpdate.contact = contact;}
    if (status !== undefined) {agentProfileUpdate.status = status;}
    if (verified !== undefined) {agentProfileUpdate.verified = verified;}

    if (Object.keys(agentProfileUpdate).length > 0) {
      updateData.agentProfile = agentProfileUpdate;
    }

    console.log('Update Data:', updateData);

    const agent = await User.findOneAndUpdate(
      { _id: req.params.id, role: 'agent' },
      { $set: updateData },
      { 
        new: true, 
        runValidators: true,
        context: 'query'
      }
    ).select('-password');

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        agent
      }
    });
  } catch (error) {
    console.error('Update Agent Error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
      details: error.errors
    });
  }
};


exports.deleteAgent = async (req, res) => {
  try {
    const agent = await User.findOneAndDelete({ 
      _id: req.params.id, 
      role: 'agent' 
    });

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Agent deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


exports.uploadAgentImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file'
      });
    }

    const agent = await User.findOneAndUpdate(
      { _id: req.params.id, role: 'agent' },
      { 'agentProfile.profileImage': `/uploads/agents/${req.file.filename}` },
      { new: true }
    ).select('-password');

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        agent
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

