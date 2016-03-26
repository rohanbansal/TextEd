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
var accountSid = 'AC6a81927144f093104da4c55719686ca8';
var authToken = '8f867cee5898249629bc247bac039b70';
var twilio = require('twilio');
var client = twilio(accountSid, authToken);
var fromNumber = "+17183952719";

//Firebase Database Access
var Firebase = require('firebase');
var usersRef = new Firebase('dazzling-fire-2240.firebaseio.com/Users/');
var adherenceRef = new Firebase('dazzling-fire-2240.firebaseio.com/Adherence/');
var usersDB = {};  //Local copy of database

//Setup CronJob
var cronJob = require('cron').CronJob;
var moment = require('moment');



//Home Page View
app.get('/', function(request, response) {
  response.render('pages/index')
});

//Playground testing
console.log("squash 3");

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
  }

  // Unsubscribe functionality
  else if(beganRegistration && fromMsg.toLowerCase() === "halt") {
    resp.message(localeString.unsubscribeMsg);
    textedHelpers.updateUser(usersRef, patientID, "donotsend", true);
  }

  // Continue Registration
  else if(beganRegistration && !completedRegistration) {

    if(usersDB[patientID].registrationStep === "name") {
      //Switch to spanish if user selects
      if(fromMsg.toLowerCase() === "espanol") {
        localeString = textedStrings.es;
        resp.message(localeString.newUser);
        textedHelpers.updateUser(usersRef, patientID, 'preferredLanguage', 'es');
      }
      else {
        var validName = textedHelpers.checkValid(fromMsg, "name");
        if(!validName) resp.message(localeString.invalidName);
        else {
          resp.message(localeString.ageRegistration(fromMsg)); //FIXME
          textedHelpers.updateUser(usersRef, patientID, 'name', fromMsg, 'registrationStep', 'age');
        }
      }
    }

    else if(usersDB[patientID].registrationStep === "age") {
      var validAge = textedHelpers.checkValid(fromMsg, "age");
      if(!validAge) resp.message(localeString.invalidAge);
      else {
        resp.message(localeString.genderRegistration);
        textedHelpers.updateUser(usersRef, patientID, 'age', fromMsg, 'registrationStep', 'gender');
      }
    }

    else if(usersDB[patientID].registrationStep === "gender") {
      var validGender = textedHelpers.checkValid(fromMsg, "gender");
      if(!validGender) resp.message(localeString.invalidGender);
      else {
        resp.message(localeString.zipcodeRegistration);
        textedHelpers.updateUser(usersRef, patientID, 'gender', fromMsg.toLowerCase(), 'registrationStep', 'zipcode');
      }
    }

    else if(usersDB[patientID].registrationStep === "zipcode") {
      var validZipcode = textedHelpers.checkValid(fromMsg, "zipcode");
      if(!validZipcode) resp.message(localeString.invalidZipcode);
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
        resp.message(localeString.registrationComplete);

        var newNextReminder = moment().subtract(4, 'h').format("MMM DD, ") + fromMsg; //TODO update to add 1 day so reminders start tomorrow
        textedHelpers.updateUser(usersRef, patientID, 'nextReminder', newNextReminder, 'registrationStep', 'complete');
      }
    }
  }

  //Adherence Message
  else if (completedRegistration && (fromMsg === "1" || fromMsg === "0")){
    var dateAdherence = {};
    dateAdherence[moment().subtract(4, 'h').add(1, 'd').format("MMM DD, YYYY")] = fromMsg;
    textedHelpers.updateUser(adherenceRef, patientID, moment().subtract(4, 'h').add(1, 'd').format("MMM DD, YYYY"), fromMsg);
    if(fromMsg === "1") resp.message(localeString.takenMedication);
    else if (fromMsg === "0") resp.message(localeString.missedMedication);
  }

  // Respond with user's next reminder with any other message
  else if (completedRegistration){
    resp.message(localeString.nextReminderMsg(usersDB[patientID]));
  }

  textedHelpers.updateUser(usersRef, patientID, 'totalSent', usersDB[patientID].totalSent + 1);

  res.writeHead(200, {
    'Content-Type':'text/xml'
  });
  res.end(resp.toString());
});



// Log every time the database is changed
usersRef.on("value", function(snapshot) {
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

    if( !(currentTime.isAfter(reminderTime))  || //patient's reminder is for later
    !(usersDB[patientID].registrationStep === "complete") || //patient has not finished registration
    usersDB[patientID].donotsend) continue;  //patient does not message

    //check adherence database - did they respond yesterday?


    //Update reminder to next day, and increment totalSent
    reminderTime.add(1, 'days');
    textedHelpers.updateUser(usersRef, patientID, 'nextReminder', reminderTime.format(textedStrings.timeFormat), 'totalSent', usersDB[patientID].totalSent + 1);

    //Send Message
    if(usersDB[patientID].preferredLanguage === "es") localeString = textedStrings.es;
    else localeString = textedStrings.en;

    client.messages.create({
      body: localeString.reminderMsg(usersDB[patientID]),
      to: patientID,
      from: fromNumber
    }, function(err, message) {
      if(err) {console.log(error.message);}
    });
  }

}, null, true);


//Set Up Port Listening
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
