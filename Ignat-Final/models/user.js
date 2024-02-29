const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, unique: true },
    password: String,
    email: String,
    firstName: String,
    lastName: String,
    role: { type: String, default: 'regular' } 
});

const User = mongoose.model('User', userSchema);

module.exports = User;