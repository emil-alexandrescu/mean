'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  crypto = require('crypto'),
  validator = require('validator');

/*
 * Drawing Schema
 */
var DrawingSchema = new Schema({
  girth: {
    type: Schema.ObjectId,
    ref: 'Girth'
  },
  material: {
    type: Schema.ObjectId,
    ref: 'Material'
  },
  title: {
    type: String,
    trim: true,
    default: '',
  },
  body: {
    type: Object,
    trim: true,
    default: '',
  },
  updated: {
    type: Date
  },
  created: {
    type: Date,
    default: Date.now
  },
});

mongoose.model('Drawing', DrawingSchema);
