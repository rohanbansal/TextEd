var moment = require('moment');
var textedStrings = require('./textedStrings');


//Initialize Validator for registration setup
var validator = require('validator');

var updateUser = function(database, userID, userKey, userValue) {
  var tempObj = {};
  for(var i = 2; i < arguments.length; i = i+2) {
    tempObj[arguments[i]] = arguments[i+1];
  }
  database.child(userID).update(tempObj);
}

exports.updateUser = updateUser;


var createNewUser = function(database, userID) {
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
    registrationStep: "name", //[name, age, gender, zipcode, time, complete]
    preferredLanguage: "en"
  });
}

exports.createNewUser = createNewUser;

var checkValid = function(input, type) {
  if(type === "name") return validator.isLength(input, {min:1, max:25});
  else if(type === "age") return validator.isInt(input, {min:1, max:100});
  else if(type === "gender") return validator.isIn(input, ['M', 'F', 'm', 'f']);
  else if(type === "zipcode") return (validator.isLength(input, {min:5, max:5}) && validator.isNumeric(input));
  else if(type === "time") return (validator.matches(input, /^(0?[1-9]|1[0-2]):[0-5][0-9]\s*[ap]m$/i));
  else return false;
}

exports.checkValid = checkValid;
