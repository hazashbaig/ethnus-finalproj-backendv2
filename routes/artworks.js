const express = require('express');
const jwt = require('jsonwebtoken');
const Artwork = require('../model/Artwork');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get 10 random artworks (public)
router.get('/random', async (req, res) => {
  try {
    const artworks = await Artwork.aggregate([{ $sample: { size: 10 } }]);
    res.json(artworks);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Middleware to authenticate the token
router.use(authMiddleware);

// Get user's artworks
router.get('/my-artworks', async (req, res) => {
  try {
    const userId = req.userId;
    const artworks = await Artwork.find({ userId });
    res.json(artworks);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add new artwork
router.post('/add', async (req, res) => {
  try {
    const { title, description, imageUrl } = req.body;
    const userId = req.userId;
    const artwork = new Artwork({ title, description, imageUrl, userId });
    await artwork.save();
    res.status(201).json({ message: 'Artwork added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' }); 
  }
});

// Update artwork
router.put('/update/:id', async (req, res) => {
  try {
    const { title, description, imageUrl } = req.body;
    const artworkId = req.params.id;
    const artwork = await Artwork.findById(artworkId);
    if (!artwork) return res.status(404).json({ error: 'Artwork not found' });
    artwork.title = title;
    artwork.description = description;
    artwork.imageUrl = imageUrl;
    await artwork.save();
    res.json({ message: 'Artwork updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete artwork
router.delete('/delete/:id', async (req, res) => {
  try {
    const artworkId = req.params.id;
    await Artwork.findByIdAndDelete(artworkId);
    res.json({ message: 'Artwork deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
