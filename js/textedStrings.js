/**
* @file List of English and Spanish text strings.
* @author Rohan Bansal
*
**/



/** @constant English object containing all phrases. */
var en = {
  newUser: "Welcome to TextEd, your personal health alert service. Standard fees may apply. To begin reply with START. Reply HELP for other languages or HALT to cancel.",
  nameRegistration: "Thank you for choosing TextEd. Together, we can stay healthy. Let’s get to know each other. What is your first name?",
  genderRegistration: "Great, almost done! What is your gender identity?  Respond M for male, F for female, or O for other.",
  zipcodeRegistration: "We would like to know what health services are in your area. Could you send us your 5-digit zip code so that we can find out? For example: 10010",
  preferredTimeRegistration: "Now let’s set up your medication reminder time. Please enter the time you would like a receive text reminder. For example, reply 900 AM or 1015 PM.",
  invalidName: "Oops, something went wrong. If you do not want to enter your name, reply SKIP. Otherwise, try entering your name again like this: John",
  invalidAge: "It looks like an error has occurred. If you do not want to enter your age, reply SKIP. Otherwise, try entering your age again as a number: 33",
  invalidGender: "It looks like an error has occurred. If you do not want to enter your gender, reply SKIP. Otherwise, try entering your gender again as M, F, or O.",
  invalidZipcode: "Oops, there was an error. If you do not want to enter your zip code, reply SKIP. Otherwise, try entering your zip code again as just 5 numbers like this: 10010",
  invalidTime: "It looks like an error has occurred. Reply with the time you would like your medication reminder like this: 1130 AM or 215 PM.",
  takenMedication: "Congratulations!  Keep taking your medication.",
  missedMedication: "I'm sorry - any reason you didn't take your medication today?",
  helpMeMsg: "Help message.",
  noRegistrationResponse: "TextEd is your partner in taking care of your health. Would you still like our help? If so, please reply back with START. If not, respond HALT.",
  unsubscribeMsg: "We're sorry to see you go!  If you'd like to start receiving TextEd reminders again, please text BEGIN."
};

en.registrationComplete = function(name, time) {
  var resp = "Thanks " + name + ". You will now receive a daily medication reminder at " + time + ".";
  return resp;
}

en.regCompletion = "hello";

en.ageRegistration = function(name) {
  var msg;
  if (name == null) msg = "Hello! Hold old are you? Please respond with a number (like 23 or 67).";
  else msg = "Hello  " + name + ". How old are you? Please respond with a number (like 23 or 67).";
  return (msg);
}

en.nextReminderMsg = function(user) {
  return ("Hello " + user.name + "! Your next reminder is: " + user.nextReminder);
}

en.reminderMsg = function(user) {
   return ("Hello " + user.name + " - please remember to take your medication today! Reply with 1 after you have taken your medication.");
}
en.midRegistrationConfirmation = function(name, age, gender, zipcode) {
  //TODO different messages for null values
  var resp = "Thanks " + Name + ". Let us make sure we have this all correct.  You are a " + age + " year-old who lives near " + zipcode + ". Is that correct? Please respond YES or NO.";
}

en.hello = "abc";

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
exports.registrationSkipTxt = "skip";
