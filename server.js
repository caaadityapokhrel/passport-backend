const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Route 1: Check by Reference Number
app.get('/check-ref', async (req, res) => {
  const { ref } = req.query;
  if (!ref) return res.json({ success: false, message: 'Reference number required' });
  try {
    const response = await axios.post(
      'https://nepalpassport.gov.np/api/status',
      JSON.stringify({ referenceId: ref }),
      {
        headers: {
          'Content-Type': 'text/plain;charset=UTF-8',
          'Origin': 'https://nepalpassport.gov.np',
          'Referer': 'https://nepalpassport.gov.np/en',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      }
    );
    if (response.data) {
      res.json({ success: true, data: JSON.stringify(response.data, null, 2) });
    } else {
      res.json({ success: false, message: 'No status found. Please check your reference number.' });
    }
  } catch (err) {
    res.json({ success: false, message: 'Could not connect to passport system. Try again later.' });
  }
});

// Route 2: Check by Personal Details
app.get('/check-detail', async (req, res) => {
  const { citizenship, dob, pob, surname } = req.query;
  if (!citizenship || !dob || !pob || !surname) {
    return res.json({ success: false, message: 'All fields are required' });
  }
  try {
    const response = await axios.post(
      'https://nepalpassport.gov.np/api/status/details',
      JSON.stringify({ citizenship, dob, pob, surname }),
      {
        headers: {
          'Content-Type': 'text/plain;charset=UTF-8',
          'Origin': 'https://nepalpassport.gov.np',
          'Referer': 'https://nepalpassport.gov.np/en',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      }
    );
    if (response.data) {
      res.json({ success: true, data: JSON.stringify(response.data, null, 2) });
    } else {
      res.json({ success: false, message: 'No status found. Please check your details.' });
    }
  } catch (err) {
    res.json({ success: false, message: 'Could not connect to passport system. Try again later.' });
  }
});

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'Nepal Passport Backend is running!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
