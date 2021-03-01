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
    pool: {
      type: Object,
    },
  },
  {
    timestamps: true,
  }
);

Schema.plugin(toJSON);

const Users = mongoose.model('Users', Schema);

module.exports = Users;
