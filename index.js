//Initialize and set up app
var express = require('express');
var app = express();
var textedStrings = require('./js/textedStrings')

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

//Initialize Validator for registration setup
var validator = require('validator');

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


//Twilio Account Details
var accountSid = 'AC6a81927144f093104da4c55719686ca8';
var authToken = '8f867cee5898249629bc247bac039b70';
var twilio = require('twilio');
var client = twilio(accountSid, authToken);
var fromNumber = "+17183952719";

//Firebase Database Access
var Firebase = require('firebase');
var usersRef = new Firebase('dazzling-fire-2240.firebaseio.com/Users/');
var adherenceRef = new Firebase('dazzling-fire-2240.firebaseio.com/Adherence/');

//Setup CronJob
var cronJob = require('cron').CronJob;
var moment = require('moment');

var usersDB = {};  //Local copy of database

//Home Page View
app.get('/', function(request, response) {
  response.render('pages/index')
});


//What Happens when you receive a message
app.post('/message', function (req, res) {

  //TODO implement 1/0 med aherence functionality
  //TODO implement no response counter
  //TODO implement STOP functionality
  //TODO implement re-email if hanging registration
  //TODO implement HELP

  var resp = new twilio.TwimlResponse();
  var fromMsg = req.body.Body.trim();
  var patientID = req.body.From;


  var beganRegistration = (usersDB[patientID] != null); //User at least began registration

  var completedRegistration = false; //User completed registration
  if(beganRegistration) {
    var completedRegistration = (usersDB[patientID].registrationStep === "complete");
  }

  // Unsubscribe functionality
  if(beganRegistration && fromMsg.toLowerCase() === "halt") {
    resp.message(textedStrings.unsubscribeMsg);
    usersRef.child(patientID).update({
      donotsend: true
    });
  }

  //New User - never began registration
  else if(!beganRegistration) {
    resp.message(textedStrings.newUser);
    usersRef.child(patientID).set({
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
      registrationStep: "name" //[name, age, gender, zipcode, time, complete]
    });
  }

  // Continue Registration
  else if(beganRegistration && !completedRegistration) {

    if(usersDB[patientID].registrationStep === "name") {
      var validName = checkValid(fromMsg, "name");
      if(!validName) resp.message('Sorry, names must be less than 25 characters.  Please try again, or send DECLINE to skip.');
      else {
        resp.message('Hello ' + fromMsg + "!  How old are you?");
        usersRef.child(patientID).update({
          name: fromMsg,
          registrationStep: "age"
        });
      }
    }

    else if(usersDB[patientID].registrationStep === "age") {
      var validAge = checkValid(fromMsg, "age");
      if(!validAge) resp.message('Sorry, your age must be a number between 18-100.  Please try again, or send DECLINE to skip.');
      else {
        resp.message('Are you male or female?  Enter M or F.');
        usersRef.child(patientID).update({
          age: fromMsg,
          registrationStep: "gender"
        });
      }
    }

    else if(usersDB[patientID].registrationStep === "gender") {
      var validGender = checkValid(fromMsg, "gender");
      if(!validGender) resp.message('Sorry, please send either M or F.  Please try again, or send DECLINE to skip.');
      else {
        resp.message('What is your 5-digit zipcode?');
        usersRef.child(patientID).update({
          gender: fromMsg,
          registrationStep: "zipcode"
        });
      }
    }

    else if(usersDB[patientID].registrationStep === "zipcode") {
      var validZipcode = checkValid(fromMsg, "zipcode");
      if(!validZipcode) resp.message('Sorry, please enter a valid 5-digit US zipcode.  Please try again, or send DECLINE to skip.');
      else {
        resp.message('What is your preferred time to receive daily reminders e.g. (hh:mm am/pm)?');
        usersRef.child(patientID).update({
          zipcode: fromMsg,
          registrationStep: "time"
        });
      }
    }

    else if(usersDB[patientID].registrationStep === "time"){
      var validTime = checkValid(fromMsg, "time");
      var validAMAppendTime = checkValid(fromMsg + "am", "time");

      if(!validTime && !validAMAppendTime) {
        resp.message('Sorry, please send your preferred time in the format "hh:mm am/pm".  Please try again, or send DECLINE to skip.');
      }
      else {
        if(!validTime) {
          fromMsg = fromMsg + "am";
        }
        resp.message('Thank you - your registration is complete!');

        var newNextReminder = moment().subtract(4, 'h').format("MMM DD, ") + fromMsg; //TODO update to add 1 day so reminders start tomorrow
        usersRef.child(patientID).update({
          registrationStep: "complete",
          nextReminder: newNextReminder
        });
      }
    }

  }

  //Adherence Message
  else if (completedRegistration && (fromMsg === "1" || fromMsg === "0")){
    var dateAdherence = {};
    dateAdherence[moment().subtract(4, 'h').add(1, 'd').format("MMM DD, YYYY")] = fromMsg;
    adherenceRef.child(patientID).update(dateAdherence);
    if(fromMsg === "1") resp.message("Congratulations!  Keep taking your medication.");
    else if (fromMsg === "0") resp.message("I'm sorry - any reason you didn't take your medications today?");
  }

  // Respond with user's next reminder with any other message
  else if (completedRegistration){
    resp.message("Hello " + usersDB[patientID].name + "!  Your next reminder is: " + usersDB[patientID].nextReminder);
  }



  usersRef.child(patientID).update({
    totalSent: usersDB[patientID].totalSent + 1
  });
  res.writeHead(200, {
    'Content-Type':'text/xml'
  });
  res.end(resp.toString());
});



// Check if registration values are valid
function checkValid(input, type) {
  if(type === "name") return validator.isLength(input, {min:1, max:25});
  else if(type === "age") return validator.isInt(input, {min:1, max:100});
  else if(type === "gender") return validator.isIn(input, ['M', 'F', 'm', 'f']);
  else if(type === "zipcode") return (validator.isLength(input, {min:5, max:5}) && validator.isNumeric(input));
  else if(type === "time") return (validator.matches(input, /^(0?[1-9]|1[0-2]):[0-5][0-9]\s*[ap]m$/i));
  else return false;
}


// Log every time the database is changed
usersRef.on("value", function(snapshot) {
  console.log("Current Database: " + snapshot.val());
  usersDB = snapshot.val();
  if(snapshot.val() == null) usersDB = {};
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code)
});


//Cronjob every minute
var textJob = new cronJob( '* * * * *', function() {

  console.log("sending Messages.");

  for (var patientID in usersDB) {

    //Has their reminder time passed? If not, then don't send a message.
    var reminderTime = moment(usersDB[patientID].nextReminder, textedStrings.timeFormat);
    var currentTime = moment();
    currentTime.subtract(4, 'h'); //UTC Offset.  TODO: FIX time zone issues.
    //console.log("Loop Current Time: " + currentTime.format(timeFormat));
    if( !(currentTime.isAfter(reminderTime))  ||
    !(usersDB[patientID].registrationStep === "complete") ||
    usersDB[patientID].donotsend) {
      console.log("Skipping Reminder!");
      continue;
    }


    console.log("Sending Reminder.");

    //check adherence database - did they respond yesterday?


    //Update reminder to next day, and increment totalSent
    reminderTime.add(1, 'days');
    usersRef.child(patientID).update({
      nextReminder: reminderTime.format(textedStrings.timeFormat),
      totalSent: usersDB[patientID].totalSent + 1
    });

    //Send Message
    var clientMsg = craftReminderMessage(usersDB[patientID]);

    client.messages.create({
      body: clientMsg,
      to: patientID,
      from: fromNumber
    }, function(err, message) {
      if(err) {console.log(error.message);}
    });
  }

}, null, true);


//Craft message to send user
function craftReminderMessage(user) {
  return "Please remember to take your medication today!";
}




//Set Up Port Listening
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
