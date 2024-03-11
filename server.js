const express = require('express');

const app = express();

app.use(express.json()); 
app.use(express.static('public'));

// Define routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
