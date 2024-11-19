const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/locations.json', express.static(path.join(__dirname, 'locations.json')));

// Endpoint to save location data
app.post('/save-location', (req, res) => {
  const { latitude, longitude } = req.body;

  if (latitude && longitude) {
    const locationData = { latitude, longitude, timestamp: new Date().toISOString() };

    // Append the data to a JSON file
    const filePath = path.join(__dirname, 'locations.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
      let locations = [];
      if (!err) {
        locations = JSON.parse(data || '[]');
      }

      locations.push(locationData);

      fs.writeFile(filePath, JSON.stringify(locations, null, 2), (writeErr) => {
        if (writeErr) {
          console.error(writeErr);
          res.status(500).send('Failed to save location.');
        } else {
          res.status(200).send('Location saved successfully.');
        }
      });
    });
  } else {
    res.status(400).send('Invalid location data.');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
