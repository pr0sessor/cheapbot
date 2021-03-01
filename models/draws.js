const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const Schema = mongoose.Schema(
  {
    discord: {
      type: Number,
    },
    tickets: {
      type: Number,
    },
    luck: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

Schema.plugin(toJSON);

const Draws = mongoose.model('Draws', Schema);

module.exports = Draws;
