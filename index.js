//Initialize and set up app
var express = require('express');
var app = express();

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

//Setup CronJob
var cronJob = require('cron').CronJob;
var moment = require('moment');
var timeFormat = "MMM DD, hh:mm a";
var defaultReminderTime = "08:00 am";

var usersDB;  //Local copy of database


//Home Page View
app.get('/', function(request, response) {
  response.render('pages/index')
});

//What Happens when you receive a message
app.post('/message', function (req, res) {

  //TODO implement 1/0 med aherence functionality
  //TODO implement no response counter

  //TODO implement error checking on message contents
  //TODO implement total # of messages sent
  //TODO implement STOP functionality
  //TODO implement re-email if hanging registration
  //TODO implement HELP

  var resp = new twilio.TwimlResponse();
  var fromNum = req.body.From;
  var fromMsg = req.body.Body.trim();



  usersRef.once('value', function(snapshot) {

    //User has begin registration process, but not necessarily completed
    var beganRegistration = snapshot.hasChild(fromNum);
    var completedRegistration = (usersDB[fromNum].registrationStep === "complete");
    console.log(completedRegistration);

    // Unsubscribe functionality
    if(beganRegistration && fromMsg.toLowerCase() === "halt") {
      resp.message("We're sorry to see you go!  If you'd like to start receiving TextEd reminders again, please text BEGIN.");
      usersRef.child(fromNum).update({
        donotsend: true
      });
    }

    //New User - never began registration
    else if(!beganRegistration) {
      resp.message('Thank you for subscribing to Rohans TextEd! Please send us your preferred name. Reply HALT to cancel.');
      usersRef.child(fromNum).set({
        name: null,
        age: null,
        gender: null,
        zipcode: null,
        diagnosis: null,
        startDate: moment().subtract(4, 'h').format("MMM DD, YYYY"),
        missedDoseCounter: 0,
        failedTexts: 0,
        totalSent: 1,
        nextReminder: moment().subtract(4, 'h').add(1, 'd').format("MMM DD, ") + defaultReminderTime,
        satisfaction: null,
        donotsend: false,
        registrationStep: "name" //[name, age, gender, zipcode, time, complete]
      });
    }

    else if(beganRegistration) {

      if(usersDB[fromNum].registrationStep === "name") {
        resp.message('Hello ' + fromMsg + "!  How old are you?");
        usersRef.child(fromNum).update({
          name: fromMsg,
          registrationStep: "age"
        });
      }

      else if(usersDB[fromNum].registrationStep === "age") {
        resp.message('Are you male or female?  Enter M or F.');
        usersRef.child(fromNum).update({
          age: fromMsg,
          registrationStep: "gender"
        });
      }

      else if(usersDB[fromNum].registrationStep === "gender") {
        resp.message('What is your 5-digit zipcode?');
        usersRef.child(fromNum).update({
          gender: fromMsg,
          registrationStep: "zipcode"
        });
      }

      else if(usersDB[fromNum].registrationStep === "zipcode") {
        resp.message('What is your preferred time to receive daily reminders e.g. (hh:mm am/pm)?');
        usersRef.child(fromNum).update({
          zipcode: fromMsg,
          registrationStep: "time"
        });
      }

      else if(usersDB[fromNum].registrationStep === "time"){
        resp.message('Thank you - your registration is complete!');

        var newNextReminder = moment().subtract(4, 'h').format("MMM DD, ") + fromMsg;
        usersRef.child(fromNum).update({
          registrationStep: "complete",
          nextReminder: newNextReminder
          //nextReminder: fromMsg TODO Add next reminder functionality
        });
      }

      else {
        resp.message("Hello " + usersDB[fromNum].name + "!  Your next reminder is: " + usersDB[fromNum].nextReminder);
      }

    }

    // TODO increment total sent here
    res.writeHead(200, {
      'Content-Type':'text/xml'
    });
    res.end(resp.toString());
  });

});







// Log every time the database is changed
usersRef.on("value", function(snapshot) {
  console.log(snapshot.val());
  usersDB = snapshot.val();
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code)
});


//Cronjob every minute
var textJob = new cronJob( '* * * * *', function() {

  console.log("sending Messages.");

  for (var patientID in usersDB) {

    //Has their reminder time passed? If not, then don't send a message.
    var reminderTime = moment(usersDB[patientID].nextReminder, timeFormat);
    var currentTime = moment();
    currentTime.subtract(4, 'h'); //UTC Offset.  TODO: FIX time zone issues.
    //console.log("Loop Current Time: " + currentTime.format(timeFormat));
    //console.log("Reminder Time" + reminderTime.format(timeFormat));
    if( !(currentTime.isAfter(reminderTime))  || !(usersDB[patientID].registrationStep === "complete") || usersDB[patientID].donotsend) {
      console.log("Skipping Reminder!");
      continue;
    }

    console.log("Sending Reminder.");
    //Update reminder to next day
    reminderTime.add(1, 'days');
    usersRef.child(patientID).update({
      nextReminder: reminderTime.format(timeFormat)
    });

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
function craftReminderMessage(user, clientMsg) {
  return "Please remember to take your medication today!";
}







//Set Up Port Listening
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
