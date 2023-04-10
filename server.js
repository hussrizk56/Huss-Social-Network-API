const mongoose = require('mongoose');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(require('./routes'));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/social-network')
.then(
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  })) 




