'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  crypto = require('crypto'),
  validator = require('validator');

/*
 * Price Schema
 */
var PriceSchema = new Schema({
  material: {
    type: Schema.ObjectId,
    ref: 'Material'
  },
  girth: {
    type: Schema.ObjectId,
    ref: 'Girth'
  },
  price: {
    type: Number,
    default: 0,
    required: 'Please fill in price'
  },
  updated: {
    type: Date
  },
  created: {
    type: Date,
    default: Date.now
  },
});

mongoose.model('Price', PriceSchema);
