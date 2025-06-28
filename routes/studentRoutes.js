const express = require('express');
const router = express.Router();
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const Student = require('../models/Student');
const path = require('path');

// File upload setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),

  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ storage });

// POST route to save students
router.post('/add', upload.array('photos'), async (req, res) => {
  try {
    const { names, descriptions } = req.body;
    const uniqueLink = uuidv4();
    const studentData = [];

    // Ensure names/descriptions are arrays
    const nameArray = Array.isArray(names) ? names : [names];
    const descArray = Array.isArray(descriptions) ? descriptions : [descriptions];

    for (let i = 0; i < nameArray.length; i++) {
      studentData.push({
        name: nameArray[i],
        description: descArray[i],
        photoUrl: `/uploads/${req.files[i].filename}`,
        uniqueLink
      });
    }

    await Student.insertMany(studentData);
    res.json({ message: 'Saved!', link: `${uniqueLink}` });

  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET route to view students by link
router.get('/view/:id', async (req, res) => {
  try {
    const data = await Student.find({ uniqueLink: req.params.id });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving data', error: error.message });
  }
});

module.exports = router;
