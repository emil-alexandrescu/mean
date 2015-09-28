'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  crypto = require('crypto'),
  validator = require('validator');

/*
 * Girth Schema
 */
var GirthSchema = new Schema({
  size: {
    type: Number,
    default: 0,
    required: 'Please fill in size'
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

mongoose.model('Girth', GirthSchema);
