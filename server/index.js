const express = require('express');
const cors = require('cors');
require('./db/db');

const app = express();

app.use(express.json());
app.use(cors());

// Import Routes
const fileRoute = require('./routes/file');
app.use(fileRoute);

// Import auth Route
const authRoute = require('./routes/auth');
app.use(authRoute);

app.listen(3001, () => {
  console.log('server started on port 3001');
});