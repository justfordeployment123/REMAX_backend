const User = require('../models/User');

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.status(200).json({
      success: true,
      data: {
        user
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const { firstName, lastName } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { firstName, lastName },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: {
        user
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.addAddress = async (req, res) => {
  try {
    const { type, street, city, state, zipCode, country } = req.body;
    
    const user = await User.findById(req.user.id);
    
    const newAddress = {
      type,
      street,
      city,
      state,
      zipCode,
      country
    };
    
    user.addresses.push(newAddress);
    await user.save();

    res.status(200).json({
      success: true,
      data: {
        user
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const { street, city, state, zipCode, country } = req.body;
    
    const user = await User.findById(req.user.id);
    const address = user.addresses.id(addressId);
    
    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }
    
    address.street = street;
    address.city = city;
    address.state = state;
    address.zipCode = zipCode;
    address.country = country;
    
    await user.save();

    res.status(200).json({
      success: true,
      data: {
        user
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    
    const user = await User.findById(req.user.id);
    user.addresses.pull(addressId);
    await user.save();

    res.status(200).json({
      success: true,
      data: {
        user
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.addPhoneNumber = async (req, res) => {
  try {
    const { type, number } = req.body;
    
    const user = await User.findById(req.user.id);
    
    const newPhone = {
      type,
      number
    };
    
    user.phoneNumbers.push(newPhone);
    await user.save();

    res.status(200).json({
      success: true,
      data: {
        user
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updatePhoneNumber = async (req, res) => {
  try {
    const { phoneId } = req.params;
    const { number } = req.body;
    
    const user = await User.findById(req.user.id);
    const phone = user.phoneNumbers.id(phoneId);
    
    if (!phone) {
      return res.status(404).json({
        success: false,
        message: 'Phone number not found'
      });
    }
    
    phone.number = number;
    await user.save();

    res.status(200).json({
      success: true,
      data: {
        user
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.deletePhoneNumber = async (req, res) => {
  try {
    const { phoneId } = req.params;
    
    const user = await User.findById(req.user.id);
    user.phoneNumbers.pull(phoneId);
    await user.save();

    res.status(200).json({
      success: true,
      data: {
        user
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


exports.updateNotifications = async (req, res) => {
  try {
    const { listingAlerts, favorites, newsletter } = req.body;
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.notifications) {
      user.notifications = {};
    }

    if (listingAlerts !== undefined) {
      user.notifications.listingAlerts = listingAlerts;
    }
    if (favorites !== undefined) {
      user.notifications.favorites = favorites;
    }
    if (newsletter !== undefined) {
      user.notifications.newsletter = newsletter;
    }

    await user.save();

    res.status(200).json({
      success: true,
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Error updating notifications:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
