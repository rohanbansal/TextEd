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

  var resp = new twilio.TwimlResponse();
  var fromNum = req.body.From;
  var fromMsg = req.body.Body.trim();

  usersRef.once('value', function(snapshot) {

    var registeredUser = snapshot.hasChild(fromNum);

    //New User
    if(!registeredUser) {
      resp.message('Thank you for subscribing to TextEd! Please send us your preferred name. Reply STOP to cancel.');
      // usersRef.push(fromNum);
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
        nextReminder: moment().subtract(4, 'h').add(0, 'd').format("MMM DD, ") + defaultReminderTime,
        satisfaction: null,
        donotsend: false,
        registrationComplete: false
      });
    }

    if(registeredUser) {

      if(usersDB[fromNum].name == null) {
        resp.message('Hello ' + fromMsg + "!  How old are you?");
        usersRef.child(fromNum).update({
          name: fromMsg
        });
      }

      else if(usersDB[fromNum].age == null) {
        resp.message('Are you male or female?  Enter M or F.');
        usersRef.child(fromNum).update({
          age: fromMsg
        });
      }

      else if(usersDB[fromNum].gender == null) {
        resp.message('What is your 5-digit zipcode?');
        usersRef.child(fromNum).update({
          gender: fromMsg
        });
      }

      else if(usersDB[fromNum].zipcode == null) {
        resp.message('What is your preferred time to receive daily reminders e.g. (hh:mm)?');
        usersRef.child(fromNum).update({
          zipcode: fromMsg
        });
      }

      else if(!usersDB[fromNum].registrationComplete){
        resp.message('Thank you - your registration is complete!');
        usersRef.child(fromNum).update({
          registrationComplete: true
          //nextReminder: fromMsg
        });
      }

      else {
        resp.message("Hello " + usersDB[fromNum].name + "!  Your next reminder is: " + usersDB[fromNum].nextReminder);
      }

    }

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
    if( !(currentTime.isAfter(reminderTime))  || !usersDB[patientID].registrationComplete) {
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
