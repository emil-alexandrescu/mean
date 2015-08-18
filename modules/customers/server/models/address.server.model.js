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
var AddressSchema = new Schema({
  'first_name': {
    type: String,
    trim: true,
    default: ''
  },
  'last_name': {
    type: String,
    trim: true,
    default: ''
  },
  'street_line1': {
    type: String,
    trim: true,
    default: ''
  },
  'street_line2': {
    type: String,
    trim: true,
    default: ''
  },
  'street_line3': {
    type: String,
    trim: true,
    default: ''
  },
  'street_line4': {
    type: String,
    trim: true,
    default: ''
  },
  'city': {
    type: String,
    trim: true,
    default: ''
  },
  'state': {
    type: String,
    trim: true,
    default: ''
  },
  'country': {
    type: String,
    trim: true,
    default: ''
  },
  'zipcode': {
    type: String,
    trim: true,
    default: ''
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

mongoose.model('Address', AddressSchema);
