exports.timeFormat = "MMM DD, hh:mm a";
exports.defaultReminderTime = "08:00 am";

var es = {
  unsubscribeMsg: "Esp: We're sorry to see you go!  If you'd like to start receiving TextEd reminders again, please text BEGIN.",
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
  helpMeMsg: "Esp:  Help message."
};

es.ageRegistration = function(name) {
  return ("Esp: Hello " + name + "! How old are you?");
}

es.nextReminderMsg = function(user) {
  return ("Esp: Hello " + user.name + "! Your next reminder is: " + user.nextReminder);
}

es.reminderMsg = function(user) {
  return ("Esp: Hello " + user.name + " - please remember to take your medication today!");
}




var en = {
  unsubscribeMsg: "We're sorry to see you go!  If you'd like to start receiving TextEd reminders again, please text BEGIN.",
  newUser: "Thank you for subscribing to TextEd! Please send us your preferred name. Reply HALT to cancel. Para espanol, mande \"espanol\"",
  invalidName: "Sorry, names must be less than 25 characters.  Please try again, or send DECLINE to skip.",
  invalidAge: "Sorry, your age must be a number between 18-100.  Please try again, or send DECLINE to skip.",
  genderRegistration: "Are you male or female? Enter M or F.",
  invalidGender: "Sorry, please send either M or F.  Please try again, or send DECLINE to skip",
  zipcodeRegistration: "What is your 5-digit zipcode?",
  invalidZipcode: "Sorry, please enter a valid 5-digit US zipcode.  Please try again, or send DECLINE to skip.",
  preferredTimeRegistration: "What is your preferred time to receive daily reminders e.g. (hh:mm am/pm)?",
  invalidTime: "Sorry, please send your preferred time in the format \"hh:mm am/pm\".  Please try again, or send DECLINE to skip.",
  registrationComplete: "Thank you - your registration is complete!",
  takenMedication: "Congratulations!  Keep taking your medication.",
  missedMedication: "I'm sorry - any reason you didn't take your medication today?",
  helpMeMsg: "Help message."
};

en.ageRegistration = function(name) {
  return ("Hello " + name + "! How old are you?");
}

en.nextReminderMsg = function(user) {
  return ("Hello " + user.name + "! Your next reminder is: " + user.nextReminder);
}

en.reminderMsg = function(user) {
  return ("Hello " + user.name + " - please remember to take your medication today!");
}

exports.en = en;
exports.es = es;
