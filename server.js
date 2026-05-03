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
      'https://nepalpassport.gov.np/en/passport-status',
      new URLSearchParams({ reference_no: ref }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Referer': 'https://nepalpassport.gov.np/en'
        }
      }
    );

    const $ = cheerio.load(response.data);
    const result = $('.passport-status, .status-result, table, .alert').text().trim();

    if (result) {
      res.json({ success: true, data: result });
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
      'https://nepalpassport.gov.np/en/passport-status-detail',
      new URLSearchParams({
        citizenship_no: citizenship,
        dob: dob,
        pob: pob,
        surname: surname
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Referer': 'https://nepalpassport.gov.np/en'
        }
      }
    );

    const $ = cheerio.load(response.data);
    const result = $('.passport-status, .status-result, table, .alert').text().trim();

    if (result) {
      res.json({ success: true, data: result });
    } else {
      res.json({ success: false, message: 'No status found. Please check your details.' });
    }
  } catch (err) {
    res.json({ success: false, message: 'Could not connect to passport system. Try again later.' });
  }
});

// Health check
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});