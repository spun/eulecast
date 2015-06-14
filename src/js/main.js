/** @jsx React.DOM */
var DriveAPI = require('./utils/DriveAPI');
//var CastAPI = require('./utils/CastAPI');
var APP = require('./components/app');
var React = require('react');

// polyfills
require('es6-promise').polyfill();
require("whatwg-fetch");

React.render(
  <APP />,
  document.body);