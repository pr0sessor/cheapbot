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
  },
  {
    timestamps: true,
  }
);

Schema.plugin(toJSON);

const Entries = mongoose.model('Entries', Schema);

module.exports = Entries;
