var mongoose = require('mongoose'),
    bcrypt = require('bcrypt');

var EmailSchema = new mongoose.Schema({
    email  : String,
    name  : String,
    created  : Date
});

EmailSchema.statics.new = function(email, name, cb) {
	var Model = this;

	var email = new Model({ email: email, name: name, created: new Date()});
	email.save(function(err) {
      cb(err, email);
    });
}


module.exports = Email = mongoose.connection.model("Email", EmailSchema)