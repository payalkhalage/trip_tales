import express from 'express';
import axios from 'axios';

const router = express.Router();

router.get('/location-search', async (req, res) => {
  const query = req.query.q;

  if (!query) {
    return res.status(400).json({ message: 'Query is required' });
  }

  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: query,
        format: 'json',
        addressdetails: 1,
        limit: 5
      },
      headers: {
        'User-Agent': 'TripTales/1.0 (your@email.com)' // Optional: add contact
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Location API error:', error.message);
    res.status(500).json({ message: 'Location search failed' });
  }
});

export default router;
