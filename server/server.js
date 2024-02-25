

const express = require('express');
const path = require('path');

const app = express();
const PORT =  3000;

// Serve static files from the 'build' directory
app.use(express.static(path.join(__dirname, 'build')));

// Serve the React app for any request that doesn't match a static file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
