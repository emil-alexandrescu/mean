'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  crypto = require('crypto'),
  validator = require('validator');

/**
 * Address Schema
 */
var ContactInfoSchema = new Schema({
  'contact_type': {
    type: String,
    default: 'email',
    required: 'Please fill in contact type'
  },
  'contact_value': {
    type: String,
    trim: true,
    required: 'Please fill in contact value'
  },
  customer: {
    type: Schema.ObjectId,
    ref: 'Customer'
  },
  updated: {
    type: Date
  },
  created: {
    type: Date,
    default: Date.now
  },
});

mongoose.model('ContactInfo', ContactInfoSchema);
