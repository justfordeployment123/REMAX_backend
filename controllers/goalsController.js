const User = require('../models/User');

exports.getUserGoals = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.status(200).json({
      success: true,
      data: {
        goals: user.goals
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateUserGoals = async (req, res) => {
  try {
    const { buying, selling, educational } = req.body;
    
    const user = await User.findById(req.user.id);
    
    user.goals = {
      buying: buying || user.goals.buying,
      selling: selling || user.goals.selling,
      educational: educational || user.goals.educational,
      lastUpdated: new Date()
    };
    
    await user.save();

    res.status(200).json({
      success: true,
      data: {
        goals: user.goals
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};