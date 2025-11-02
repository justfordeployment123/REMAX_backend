const express = require('express');
const multer = require('multer');
const path = require('path');
const {
  getAllAgents,
  getAgentById,
  createAgent,
  updateAgent,
  deleteAgent,
  uploadAgentImage
} = require('../controllers/agentController');

const { protect, authorize } = require('../middleware/auth');


const router = express.Router();


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/agents/');
  },
  filename: function (req, file, cb) {
    cb(null, `agent-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});


router.get('/', getAllAgents);
router.get('/:id', getAgentById);


router.use(protect);
router.use(authorize('admin'));


router.post('/', createAgent);
router.put('/:id', updateAgent);
router.delete('/:id', deleteAgent);
router.post('/:id/upload', upload.single('profileImage'), uploadAgentImage);

module.exports = router;