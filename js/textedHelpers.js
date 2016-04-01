/**
* @file Helper functions for TextEd.
* @author Rohan Bansal
*
**/

var moment = require('moment');
var textedStrings = require('./textedStrings');
var validator = require('validator');

var defaultReminderTime = "08:00 am";

/**
* @function updateUser
* @summary Updates the user's information in the database with {userKey: userValue}
*/
exports.updateUser = function(database, userID, userKey, userValue) {
  var tempObj = {};
  for(var i = 2; i < arguments.length; i = i+2) {
    tempObj[arguments[i]] = arguments[i+1];
  }
  database.child(userID).update(tempObj);
}

/**
* @function createNewUser
* @summary creates a new user in database with the specified userID (phone number)
*/
exports.createNewUser = function(database, userID) {
  database.child(userID).set({
    name: null,
    age: null,
    gender: null,
    zipcode: null,
    diagnosis: null,
    startDate: moment().subtract(4, 'h').format("MMM DD, YYYY"),
    missedDoseCounter: 0,
    failedTexts: 0,
    totalSent: 0,
    nextReminder: moment().subtract(4, 'h').add(1, 'd').format("MMM DD, ") + textedStrings.defaultReminderTime,
    satisfaction: null,
    donotsend: false,
    registrationStep: "start", //[start, name, age, gender, zipcode, time, complete]
    preferredLanguage: "en",
    associatedTwilioNum: null
  });
}

/**
* @function checkValid
* @summary Checks to see in input is valid
*/
exports.checkValid = function(input, type) {
  if(type === "name") return validator.isLength(input, {min:1, max:22});
  else if(type === "age") return validator.isInt(input, {min:18, max:150}); //TODO Is 18 allowed?
  else if(type === "gender") return validator.isIn(input, ['M', 'F', 'm', 'f', 'O', 'o']);
  else if(type === "zipcode") return (validator.isLength(input, {min:5, max:5}) && validator.isNumeric(input));
  else if(type === "time") return (validator.matches(input, /^(0?[1-9]|1[0-2]):?[0-5][0-9]\s*[ap]m$/i));
  else return false;
}

exports.validNumber = function(input) {
  if( validator.isLength(input, {min:10, max:10}) && validator.isInt(input)) return true;
  else return false;
}

exports.dateToday = function() {
  return moment().subtract(4, 'h').format("MMM DD, YYYY");
}

exports.dateYesterday = function() {
  return moment().subtract(4, 'h').subtract(1,'d').format("MMM DD, YYYY");
}
