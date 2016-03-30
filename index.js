/**
* @file Main file for TextEd.
* @author Rohan Bansal
*
**/

//Initialize and set up app
var express = require('express');
var app = express();
var textedStrings = require('./js/textedStrings');
var textedHelpers = require('./js/textedHelpers.js');

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

//Twilio Account Details
var accountSid = process.env.TWILIO_ACCOUNT_SID;
var authToken = process.env.TWILIO_AUTH_TOKEN;
var twilio = require('twilio');
var client = twilio(accountSid, authToken);

//List of all numbers owned on Twilio
var fromNumbers = ["+17183952719", "+17183952719"];

//Firebase Database Access
var DBSTRING = process.env.DB_URL;
var Firebase = require('firebase');
var usersRef = new Firebase(DBSTRING + "Users/");
var adherenceRef = new Firebase(DBSTRING + "Adherence/");
var usersDB = {};  //Local copy of database

//Setup CronJob
var cronJob = require('cron').CronJob;
var moment = require('moment');
var timeFormat = "MMM DD, hh:mm a";


//Home Page View
app.get('/', function(request, response) {
  response.render('pages/index');
});


/**
Request to join TextEd.
Content-Type: application/x-www-form-urlencoded
@param phoneNumber: 10 digit number, no spaces.
*/
app.post('/join', function(req, res) {
  var phoneNumber = req.body.phoneNumber;
  var resp;
  var userNum = "+1" + phoneNumber;

  console.log(userNum);
  //Already started registration process
  if(usersDB[userNum] != null) resp = "Already registered!";
  else {
    var randomTwilioNum = fromNumbers[Math.floor(Math.random()*fromNumbers.length)];
    console.log("sending from: " + randomTwilioNum);
    textedHelpers.createNewUser(usersRef, userNum);
    textedHelpers.updateUser(usersRef, userNum, 'associatedTwilioNum', randomTwilioNum);

    client.sendMessage({
      to: userNum,
      from: randomTwilioNum,
      body: textedStrings.en.newUser
    }, function(err, message) {
      if(err) {console.log(err.message);}
    });

    resp = "Now you're signed up!";
  }
  res.redirect('/');
});

//Receiving Text Message
app.post('/message', function (req, res) {

  //TODO implement no response counter - 3 and 24 hours
  //TODO implement re-email if hanging registration
  //TODO implement "begin" after "halt"
  //TODO update timeFormat
  //TODO skipping steps
  //TODO help --> spanish

  var resp = new twilio.TwimlResponse();
  var fromMsg = req.body.Body.trim();
  var patientID = req.body.From;
  var twilioNum = req.body.To;
  var localeString = textedStrings.en;

  var beganRegistration = (usersDB[patientID] != null); //User at least began registration

  var completedRegistration = false; //User completed registration

  if(beganRegistration) {
    var completedRegistration = (usersDB[patientID].registrationStep === "complete");
    if(usersDB[patientID].preferredLanguage === "es") localeString = textedStrings.es;
  }

  //New User - never began registration
  if(!beganRegistration) {
    resp.message(localeString.newUser);
    textedHelpers.createNewUser(usersRef, patientID);
    textedHelpers.updateUser(usersRef, patientID, 'associatedTwilioNum', twilioNum);
  }

  //FIXME:  remove.  temporary to delete record from DB.
  else if(beganRegistration && fromMsg.toLowerCase() === "remove") {
    resp.message("Removed from database.");
    usersRef.child(patientID).remove();
    res.writeHead(200, {
      'Content-Type':'text/xml'
    });
    res.end(resp.toString());
    return;
  }

  // Unsubscribe functionality
  //TODO implement "begin" to restart texting
  else if(beganRegistration && fromMsg.toLowerCase() === "halt") {
    resp.message(localeString.unsubscribeMsg);
    textedHelpers.updateUser(usersRef, patientID, "donotsend", true);
  }

  // Help functionality
  else if(beganRegistration && fromMsg.toLowerCase() === "helpme") {
    resp.message(localeString.helpMeMsg);
    textedHelpers.updateUser(usersRef, patientID, "donotsend", true);
  }

  // Continue Registration
  else if(beganRegistration && !completedRegistration) {

    if(usersDB[patientID].registrationStep == "start") {
      //TODO switch newUser to say "Reply espanol for spanish"
      if(fromMsg.toLowerCase() === "espanol") {  //switch language to spanish
        localeString = textedStrings.es;
        resp.message(localeString.newUser);
        textedHelpers.updateUser(usersRef, patientID, 'preferredLanguage', 'es');
      }
      else { //begin registration process with name
        resp.message(localeString.nameRegistration);
        textedHelpers.updateUser(usersRef, patientID, 'registrationStep', 'name');
      }
    }

    else if(usersDB[patientID].registrationStep === "name") {
      var msg = fromMsg;
      if(fromMsg.toLowerCase() == textedStrings.registrationSkipTxt) msg = null;

      var validName = textedHelpers.checkValid(fromMsg, "name");
      if(!validName && (msg != null)) resp.message(localeString.invalidName);
      else {
        resp.message(localeString.ageRegistration(fromMsg));
        textedHelpers.updateUser(usersRef, patientID, 'name', msg, 'registrationStep', 'age');
      }
    }

    else if(usersDB[patientID].registrationStep === "age") {
      var msg = fromMsg;
      if(fromMsg.toLowerCase() == textedStrings.registrationSkipTxt) msg = null;

      var validAge = textedHelpers.checkValid(fromMsg, "age");
      if(!validAge && (msg != null)) resp.message(localeString.invalidAge);
      else {
        resp.message(localeString.genderRegistration);
        textedHelpers.updateUser(usersRef, patientID, 'age', fromMsg, 'registrationStep', 'gender');
      }

    }

    else if(usersDB[patientID].registrationStep === "gender") {
      var msg = fromMsg;
      if(fromMsg.toLowerCase() == textedStrings.registrationSkipTxt) msg = null;

      var validGender = textedHelpers.checkValid(fromMsg, "gender");
      if(!validGender && (msg != null)) resp.message(localeString.invalidGender);
      else {
        resp.message(localeString.zipcodeRegistration);
        textedHelpers.updateUser(usersRef, patientID, 'gender', fromMsg.toLowerCase(), 'registrationStep', 'zipcode');
      }
    }

    else if(usersDB[patientID].registrationStep === "zipcode") {
      var msg = fromMsg;
      if(fromMsg.toLowerCase() == textedStrings.registrationSkipTxt) msg = null;

      var validZipcode = textedHelpers.checkValid(fromMsg, "zipcode");
      if(!validZipcode && (msg != null)) resp.message(localeString.invalidZipcode);
      else {
        resp.message(localeString.preferredTimeRegistration);
        textedHelpers.updateUser(usersRef, patientID, 'zipcode', fromMsg, 'registrationStep', 'time');
      }
    }

    else if(usersDB[patientID].registrationStep === "time") {
      var validTime = textedHelpers.checkValid(fromMsg, "time");
      var validAMAppendTime = textedHelpers.checkValid(fromMsg + "am", "time");
      if(!validTime && !validAMAppendTime) resp.message(localeString.invalidTime);
      else {
        if(!validTime) fromMsg = fromMsg + "am";  // assume AM reminder
        resp.message(localeString.registrationComplete(usersDB[patientID].name, fromMsg));

        var newNextReminder = moment().subtract(4, 'h').format("MMM DD, ") + fromMsg; //TODO update to add 1 day so reminders start tomorrow
        textedHelpers.updateUser(usersRef, patientID, 'nextReminder', newNextReminder, 'registrationStep', 'complete');
      }
    }
  }

  //Adherence Message
  else if (completedRegistration && (fromMsg === "1" || fromMsg === "0")){
    var dateAdherence = {};
    dateAdherence[moment().subtract(4, 'h').add(1, 'd').format("MMM DD, YYYY")] = fromMsg;
    textedHelpers.updateUser(adherenceRef, patientID, moment().subtract(4, 'h').format("MMM DD, YYYY"), fromMsg);
    if(fromMsg === "1") resp.message(localeString.takenMedication);
    else if (fromMsg === "0") resp.message(localeString.missedMedication);
  }

  // Respond with user's next reminder with any other message
  else if (completedRegistration) resp.message(localeString.nextReminderMsg(usersDB[patientID]));

  else res.message("Sorry, we did not understand that message.  Please contact us for more information.");

  //FIXME Get rid of this
  textedHelpers.updateUser(usersRef, patientID, 'totalSent', usersDB[patientID].totalSent + 1);

  res.writeHead(200, {
    'Content-Type':'text/xml'
  });
  console.log("Sending registration message.");
  res.end(resp.toString());
});



// Function called every time database is changed.
usersRef.on("value", function(snapshot) {
  usersDB = snapshot.val();
  if(snapshot.val() == null) usersDB = {};
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code)
});


//Run Cronjob every minute to send reminders that are due
var textJob = new cronJob( '* * * * *', function() {

  console.log("sending Messages.");

  for (var patientID in usersDB) {
    //Has their reminder time passed? If not, then don't send a message.
    var reminderTime = moment(usersDB[patientID].nextReminder, timeFormat);
    var currentTime = moment().subtract(4, 'h'); //UTC Offset.  FIXME: FIX time zone issues.

    if( !(currentTime.isAfter(reminderTime))  || //patient's reminder is for later
    !(usersDB[patientID].registrationStep === "complete") || //patient has not finished registration
    usersDB[patientID].donotsend) continue;  //patient does not message

    //TODO check adherence database - did they respond yesterday?

    //Update reminder to next day, and increment totalSent
    reminderTime.add(1, 'days');
    textedHelpers.updateUser(usersRef, patientID, 'nextReminder', reminderTime.format(timeFormat), 'totalSent', usersDB[patientID].totalSent + 1);

    //Send Message
    if(usersDB[patientID].preferredLanguage === "es") localeString = textedStrings.es;
    else localeString = textedStrings.en;

    client.sendMessage({
      to: patientID,
      from: usersDB[patientID].associatedTwilioNum,
      body: localeString.reminderMsg(usersDB[patientID])
    }, function(err, message) {
      if(err) {console.log(error.message);}
    });

  }

  console.log("Done sending messages.");
}, null, true);


//Set Up Port Listening
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
