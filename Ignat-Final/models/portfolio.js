const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const portfolioSchema = new Schema(
    {
      name: String,
      body: String,
      pictures: [String],
    },
    { timestamps: true } 
  );
const Portfolio = mongoose.model('Portfolio', portfolioSchema);

module.exports = Portfolio;