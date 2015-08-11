'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  crypto = require('crypto'),
  validator = require('validator');

/*
 * Customer Schema
 */
var CustomerSchema = new Schema({
  first_name: {
    type: String,
    trim: true,
    default: '',
    required: 'Please fill in first name'
  },
  last_name: {
    type: String,
    trim: true,
    default: '',
    required: 'Please fill in last name'
  },
  company: {
    type: String,
    trim: true,
    default: '',
    required: 'Please fill in company'
  },
  updated: {
    type: Date
  },
  created: {
    type: Date,
    default: Date.now
  },
});

mongoose.model('Customer', CustomerSchema);
