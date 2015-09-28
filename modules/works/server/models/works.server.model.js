'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  crypto = require('crypto'),
  validator = require('validator');

/*
 * Work Schema
 */
var WorkSchema = new Schema({
  title: {
    type: String,
    trim: true,
    default: '',
  },
  description: {
    type: String,
    trim: true,
    default: '',
  },
  order_number: {
    type: String,
    trim: true,
    default: ''
  },
  req_date: {
    type: Date
  },
  customer: {
    type: Schema.ObjectId,
    ref: 'Customer'
  },
  address: {
    type: Schema.ObjectId,
    ref: 'Address'
  },
  delivery_charge: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    default: 0
  },
  tax: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    trim: true,
    default: ''
  },
  order_or_quote:{
    type: String,
    trim: true,
    default: 'order'
  },
  drawing: {
    type: Schema.ObjectId,
    ref: 'Drawing'
  },
  updated: {
    type: Date
  },
  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('Work', WorkSchema);
