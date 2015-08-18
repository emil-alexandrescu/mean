'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  crypto = require('crypto'),
  validator = require('validator');

/*
 * Material Schema
 */
var MaterialSchema = new Schema({
  title: {
    type: String,
    trim: true,
    default: '',
    required: 'Please fill in title'
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  updated: {
    type: Date
  },
  created: {
    type: Date,
    default: Date.now
  },
});

mongoose.model('Material', MaterialSchema);
