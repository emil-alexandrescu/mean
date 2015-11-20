'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/*
 * Work Schema
 */
var WorkSchema = new Schema({
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
  bill_address: {
    type: Schema.ObjectId,
    ref: 'Address'
  },
  ship_address: {
    type: Schema.ObjectId,
    ref: 'Address'
  },
  sub_total: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    default: 0
  },
  tax: {
    type: Number,
    default: 0
  },
  po: {
    type: String,
    default: ''
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
  drawings: {
    type: Schema.Types.Mixed
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
