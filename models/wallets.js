const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const Schema = mongoose.Schema(
  {
    discord: {
      type: Number,
    },
    address: {
      type: String,
    },
    privateKey: {
      type: Object,
    },
  },
  {
    timestamps: true,
  }
);

Schema.plugin(toJSON);

const Wallets = mongoose.model('Wallets', Schema);

module.exports = Wallets;
