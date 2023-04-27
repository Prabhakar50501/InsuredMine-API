require('dotenv').config();
const mongoose = require('mongoose')
const URI = 'mongodb+srv://prabhakar50501:NL3z3JzSQbFyKzFT@main-cluster.64ovr9e.mongodb.net/insuredb';

mongoose.set('strictQuery', true)
mongoose.connect(URI);

const start = () => {
  mongoose.connection.on('Error', () => console.log('Error connecting database.'))
  mongoose.connection.once('Success', () => console.log('Connected to database'));
};

module.exports = {start};