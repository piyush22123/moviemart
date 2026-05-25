const mongoose = require("mongoose");


const movieSchema = new mongoose.Schema({
  movieName: {
    type: String,
    required: true,
    trim: true,
  },

  downloadLinks: [
    {
      type: String,
      required: true,
    },
  ],

  posterLink: {
    type: String,
    required: true,
  },

  storyline: {
    type: String,
    required: true,
  },

  category: [
    {
      type: String,
      required: true,
    },
  ],
  imdbId:{
    type: String,
  },
  screenshots: [
    {
      type: String,
      required: false,
    }
  ]
},
{
  timestamps: true,
});

const movieModel = mongoose.model("Movie", movieSchema);

module.exports = movieModel;