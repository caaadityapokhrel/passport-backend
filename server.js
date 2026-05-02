const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
app.get('/check-ref', async (req, res) => {
  const { ref } = req.query;
  if (!ref) return res.json({ success: false, message: 'Reference number required' });
  try {
    const response = await axios.post('https://nepalpassport.gov.np/en/passport-status', new URLSearchParams({ reference_no: ref }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://nepalpassport.gov.np/en' } });
    const $ = cheerio.load(response.data);
    const result = $('.passport-status, .status-result, table, .alert').text().trim();
    if (result) { res.json({ success: true, data: result }); }
    else { res.json({ success: false, message: 'No status found.' }); }
  } catch (err) { res.json({ success: false, message: 'Could not connect. Try again later.' }); }
});
app.get('/check-detail', async (req, res) => {
  const { citizenship, dob, pob, surname } = req.query;
  if (!citizenship || !dob || !pob || !surname) return res.json({ success: false, message: 'All fields required' });
  try {
    const response = await axios.post('https://nepalpassport.gov.np/en/passport-status-detail', new URLSearchParams({ citizenship_no: citizenship, dob: dob, pob: pob, surname: surname }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://nepalpassport.gov.np/en' } });
    const $ = cheerio.load(response.data);
    const result = $('.passport-status, .status-result, table, .alert').text().trim();
    if (result) { res.json({ success: true, data: result }); }
    else { res.json({ success: false, message: 'No status found.' }); }
  } catch (err) { res.json({ success: false, message: 'Could not connect. Try again later.' }); }
});
app.get('/', (req, res) => { res.json({ status: 'Nepal Passport Backend is running!' }); });
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => { console.log(`Server running on port ${PORT}`); });