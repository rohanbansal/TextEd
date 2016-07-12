/**
* @file List of English and Spanish text strings.
* @author Rohan Bansal
*
**/

var moment = require('moment');
var textedHelpers = require('./textedHelpers');

/** @constant English object containing all phrases. */
var study = {
  newUser: "Welcome to TextEd, your medication reminder service. Standard fees may apply. To begin reply with START. Reply ASSIST for help, or HALT to cancel.", //FIXME add text to change language once implemented
  nameRegistration: "Thank you for choosing TextEd. Together, we can stay healthy. Let’s get to know each other. What is your first name?",
  genderRegistration: "Great, almost done! What is your gender identity?  Respond M for male, F for female, or O for other.",
  zipcodeRegistration: "We would like to know what health services are in your area. Could you send us your 5-digit zip code so that we can find out? For example: 10010",
  preferredTimeRegistration: "Let’s set up your medication reminder time. Please enter the time you would like a receive text reminder. For example, reply 900 AM or 1015 PM.",
  invalidName: "It looks like an error has ocurred. Try entering your name again - up to 20 letters long.",
  invalidAge: "It looks like an error has occurred. If you do not want to enter your age, reply SKIP. Otherwise, try entering your age again as a number like this: 33",
  invalidGender: "It looks like an error has occurred. If you do not want to enter your gender, reply SKIP. Otherwise, try entering your gender again as M, F, or O.",
  invalidZipcode: "Oops, there was an error. If you do not want to enter your zip code, reply SKIP. Otherwise, try entering your zip code again as just 5 numbers like this: 10010",
  invalidTime: "It looks like an error has occurred. Reply with the time you would like your medication reminder like this: 1130 AM or 215 PM.",
  helpMeMsg: "For emergencies call 911. For medical questions, contact your doctor. To change your reminder time, reply REMINDER. To stop TextEd, reply HALT. To contact TextEd, email team@textedhealth.com.", //FIXME Add language selection
  noRegistrationResponse: "TextEd is your partner in taking care of your health. Would you still like our help? If so, please reply back with START. If not, respond HALT.", //FIXME Add no registration functionality
  unsubscribeMsg: "We're sorry to see you go!  If you'd like to start receiving TextEd reminders again, please reply BEGIN."
};

study.takenMedication = function() {
  var resp1 = "Congratulations!  Keep taking your medication.";
  var resp2 = "Great work! Enjoy the rest of your day and we will see you tomorrow.";
  var resp3 = "It’s hard to remember to take your medicine, but you are doing a great job. Keep it up!";
  var resp4 = "Good job. We will send you another reminder tomorrow.";
  var resp5 = "Keep up the good work! ";
  var resp6 = "You are doing great! ";
  var resp7 = "It’s hard to remember to take your medicine, and we appreciate your hard work!";
  var resp8 = "Way to take control of your health!";
  var resp9 = "Awesome! You're making a difference.";
  var resp10 = "Well done. Enjoy the rest of your day!";
  var responses = [resp1, resp2, resp3, resp4, resp5, resp6, resp7, resp8, resp9, resp10];

  var randnum = Math.floor(Math.random()*responses.length);

  return responses[randnum];
}

study.reminderMsg = function(user) { //What they receive daily
  var resp1 = "Hello! Please remember to take your medication today. Reply with 1 after you have taken your medication.";
  var resp2 = "This is your daily medication reminder. Please reply \"1\" after you’ve taken your medication as prescribed.";
  var resp3 = "Did you remember to take your medication today? If not, here is your reminder! Reply \“1\” after you’ve taken your medication.";
  var responses = [resp1, resp2, resp3];

  var randnum = Math.floor(Math.random()*responses.length);

  return responses[randnum];
}

study.ageRegistration = function(user) {
  var resp = "Hello! How old are you? Please respond with a number (like 23 or 67).";
  return resp;
}

study.initialResubscribeMsg = function(user) {
  var resp = "Hello, and welcome back! Would you like to review your account details? Reply YES or NO.";
  return resp;
}

study.noConfirmResubscribe = function(user) {
  var resp = "Great! We are glad to have you back. Your next reminder is: " + textedHelpers.nextReminderString(user);
  return resp;
}

study.registrationComplete = function(user) {
  var resp = "Great! If you need help at any time, text ASSIST for more info. Your next reminder is: " + textedHelpers.nextReminderString(user);
  return resp;
}

study.nextReminderMsg = function(user) { //What user receives if they send a unsolicited text
  var resp = "Hello! Your next reminder is: " + textedHelpers.nextReminderString(user) + ".  Please reply ASSIST for help.";
  return resp;
}



study.registrationConfirmation = function(user) {
  var resp = "This is a test reminder. You will get one text every day to remind you to take your medicine. Remember to take your medicine as prescribed. Reply '1' to begin."

  return resp;
}

study.missedDosesAlertMsg = function(user) {  //FIXME Change text.  Create mechanic to not use "1".
  var resp = "Hello, we haven't heard from you in a few days, and we are checking in. Reply 1 if everything is okay. If you need help, contact your doctor.";
  return resp;
}


study.finalMissedDoseAlertMsg = function(user) {
  var resp = "Hello, we haven't heard from you in a long time.  If you'd like to continue receiving messages, reply 1.  If you need help, contact your doctor.";
  return resp;
}

study.changedReminder = function(user) { //What user receives if they send a unsolicited text
  var resp = "Thanks! Your next reminder is now: " + textedHelpers.nextReminderString(user) + ".";
  return resp;
}




/** @constant English object containing all phrases. */
var en = {
  newUser: "Welcome to TextEd, your personal health alert service. Standard fees may apply. To begin reply with START. Reply ASSIST for help, or HALT to cancel.", //FIXME add text to change language once implemented
  nameRegistration: "Thank you for choosing TextEd. Together, we can stay healthy. Let’s get to know each other. What is your first name?",
  genderRegistration: "Great, almost done! What is your gender identity?  Respond M for male, F for female, or O for other.",
  zipcodeRegistration: "We would like to know what health services are in your area. Could you send us your 5-digit zip code so that we can find out? For example: 10010",
  preferredTimeRegistration: "Let’s set up your medication reminder time. Please enter the time you would like a receive text reminder. For example, reply 900 AM or 1015 PM.",
  invalidName: "It looks like an error has ocurred. Try entering your name again - up to 20 letters long.",
  invalidAge: "It looks like an error has occurred. If you do not want to enter your age, reply SKIP. Otherwise, try entering your age again as a number like this: 33",
  invalidGender: "It looks like an error has occurred. If you do not want to enter your gender, reply SKIP. Otherwise, try entering your gender again as M, F, or O.",
  invalidZipcode: "Oops, there was an error. If you do not want to enter your zip code, reply SKIP. Otherwise, try entering your zip code again as just 5 numbers like this: 10010",
  invalidTime: "It looks like an error has occurred. Reply with the time you would like your medication reminder like this: 1130 AM or 215 PM.",
  helpMeMsg: "For emergencies call 911. For medical questions, contact your doctor. To change your reminder time, reply REMINDER. To stop TextEd, reply HALT. To contact TextEd, email team@textedhealth.com.", //FIXME Add language selection
  noRegistrationResponse: "TextEd is your partner in taking care of your health. Would you still like our help? If so, please reply back with START. If not, respond HALT.", //FIXME Add no registration functionality
  unsubscribeMsg: "We're sorry to see you go!  If you'd like to start receiving TextEd reminders again, please reply BEGIN."
};

en.takenMedication = function() {
  var resp = "Congratulations!  Keep taking your medication.";
  return resp;
}

en.ageRegistration = function(user) {
  var resp = "Hello  " + user.name + "! How old are you? Please respond with a number (like 23 or 67).";
  return resp;
}

en.initialResubscribeMsg = function(user) {
  var resp = "Hello " + user.name + ", welcome back! Would you like to review your account details? Reply YES or NO.";
  return resp;
}

en.noConfirmResubscribe = function(user) {
  var resp = "Great! We are glad to have you back. Your next reminder is: " + textedHelpers.nextReminderString(user);
  return resp;
}

en.registrationComplete = function(user) {
  var resp = "Thanks " + user.name + ". You will now receive a daily medication reminder, and your next one is: " + textedHelpers.nextReminderString(user);
  return resp;
}

en.nextReminderMsg = function(user) { //What user receives if they send a unsolicited text
  var resp = "Hello " + user.name + "! Your next reminder is: " + textedHelpers.nextReminderString(user) + ".  Please reply ASSIST for help.";
  return resp;
}

en.reminderMsg = function(user) { //What they receive daily
  var resp = "Hello " + user.name + " - please remember to take your medication today! Reply with 1 after you have taken your medication.";
  return resp;
}

en.registrationConfirmation = function(user) {
  var resp = "Thanks " + user.name + ". Let us make sure we have this all correct.  \n";
  if(user.age) resp = resp + "Age: " + user.age + "\n";
  if(user.zipcode) resp = resp + "Zip: " + user.zipcode + "\n";
  resp = resp + "Next reminder: " + textedHelpers.nextReminderString(user) + "\nIf everything looks ok, text OK. Otherwise, text RESTART to start the registration process again.";
  return resp;
}

en.missedDosesAlertMsg = function(user) {  //FIXME Change text.  Create mechanic to not use "1".
  var resp = "Hello " + user.name + ", we haven't heard from you in a few days, and we are checking in. Reply 1 if everything is okay. If you need help, contact your doctor.";
  return resp;
}


en.finalMissedDoseAlertMsg = function(user) {
  var resp = "Hello " + user.name + ", we haven't heard from you in a long time.  If you'd like to continue receiving messages, reply 1.  If you need help, contact your doctor.";
  return resp;
}

en.changedReminder = function(user) { //What user receives if they send a unsolicited text
  var resp = "Thanks " + user.name + "! Your next reminder is now: " + textedHelpers.nextReminderString(user) + ".";
  return resp;
}

/** @constant Spanish object containing all phrases. */
var es = {
  newUser: "Esp: Thank you for subscribing to TextEd! Please send us your preferred name. Reply HALT to cancel.",
  invalidName: "Esp: Sorry, names must be less than 25 characters.  Please try again, or send DECLINE to skip.",
  invalidAge: "Esp: Sorry, your age must be a number between 18-100.  Please try again, or send DECLINE to skip.",
  genderRegistration: "Esp: Are you male or female? Enter M or F.",
  invalidGender: "Esp: Sorry, please send either M or F.  Please try again, or send DECLINE to skip",
  zipcodeRegistration: "Esp: What is your 5-digit zipcode?",
  invalidZipcode: "Esp: Sorry, please enter a valid 5-digit US zipcode.  Please try again, or send DECLINE to skip.",
  preferredTimeRegistration: "Esp: What is your preferred time to receive daily reminders e.g. (hh:mm am/pm)?",
  invalidTime: "Esp: Sorry, please send your preferred time in the format \"hh:mm am/pm\".  Please try again, or send DECLINE to skip.",
  registrationComplete: "Esp: Thank you - your registration is complete!",
  takenMedication: "Esp: Congratulations!  Keep taking your medication.",
  missedMedication: "Esp: I'm sorry - any reason you didn't take your medication today?",
  helpMeMsg: "Esp:  Help message.",
  unsubscribeMsg: "Esp: We're sorry to see you go!  If you'd like to start receiving TextEd reminders again, please text BEGIN."
};

es.ageRegistration = function(name) { return ("Esp: Hello " + name + "! How old are you?"); }
es.nextReminderMsg = function(user) { return ("Esp: Hello " + user.name + "! Your next reminder is: " + user.nextReminder); }
es.reminderMsg = function(user) { return ("Esp: Hello " + user.name + " - please remember to take your medication today!"); }

exports.en = en;
exports.es = es;
exports.study = study;
