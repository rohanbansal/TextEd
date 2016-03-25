
var es = {

};
exports.timeFormat = "MMM DD, hh:mm a";
exports.defaultReminderTime = "08:00 am";




var en = {
  unsubscribeMsg: "We're sorry to see you go!  If you'd like to start receiving TextEd reminders again, please text BEGIN.",
  newUser: "Thank you for subscribing to TextEd! Please send us your preferred name. Reply HALT to cancel.",
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
  missedMedication: "I'm sorry - any reason you didn't take your medication today?"
};

en.ageRegistration = function(name) {
  return ("Hello " + name + "! How old are you?");
}

en.nextReminderMsg = function(user) {
  return ("Hello " + user.name + "! Your next reminder is: " + user.nextReminder);
}

exports.en = en;
