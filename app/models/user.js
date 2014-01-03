var mongoose = require('mongoose'),
    bcrypt = require('bcrypt');
    fs = require('fs');

// Bootstrap helpers
var helpers_path = __dirname + '/../../code/helpers'
var helpers_files = fs.readdirSync(helpers_path)
helpers_files.forEach(function(file){
    require(helpers_path+'/'+file)
})

var userSchema = new mongoose.Schema({
  email: { type: String, index: { unique: true }},
  hash: String,
  phone: String,
  name: {
      first: String,
      last: String
  },
  passwordresetkey : String,
  activationkey : String,
  isadmin : Boolean,
  active : Boolean
});

userSchema.statics.registerUser = function(email, password, cb) {
  var Model = this;

  bcrypt.hash(password, 8, function(err, hash) {
    var user = new Model({ email:email.trim(), hash:hash, siteadmin: false});
    var activationkey = guid()
    user.activationkey = activationkey
    
        user.save(function (err) {
          if(err){
            console.log(err);
            cb(err, user);
          }
          else
          {
              var data = {}
              data.activationkey = activationkey
              data.dns = conf[environment].dns
              var email = user.email

              if(process.env.NODE_ENV == "production"){

                sendemail(email, "Please activate your account", data, "./htmltemplates/email/accountactivation.mustache", function(err){

                })
                
              }else{

                sendemail(email, "Please activate your account (Not Production)", data, "./htmltemplates/email/accountactivation.mustache", function(err){

                })

              }

              cb(null, user);
          }

        });


  });
};

userSchema.methods.validPassword = function(password, cb) {
  bcrypt.compare(password, this.hash, function(err, same) {
      cb(!err && same);
  });
};

userSchema.methods.activate = function(cb) {
  this.active = true
  this.save(function(err){
    cb()
  })
};

userSchema.methods.isActive = function(password, cb) {
  if(this.active){
    cb(true)
  }
  else{
    cb(false)
  }
};

userSchema.methods.update = function(phone, firstname, lastname, cb) {
    this.phone = phone
    this.name.first = firstname
    this.name.last = lastname
    this.save(function(err){
        cb(err)
    })
};

userSchema.methods.passwordreset = function(cb) {
    var user = this;
    user.passwordresetkey = guid();
    user.save(function(err){
        var data = {}
        data.dns = conf[environment].dns
        data.passwordresetkey = user.passwordresetkey
        sendemail(user.email, "Password Reset", data, "./htmltemplates/email/passwordreset.mustache", function(err){})
        cb(err)
    })
};

userSchema.methods.changepassword = function(newpassword, cb){
    var user = this;
    bcrypt.hash(newpassword, 8, function(err, hash) {
        user.hash = hash
        user.passwordresetkey = ""
        user.save(function (err) {
            if(err){
                console.log(err);
                cb(err, false);
            }else{
                cb(err, true);
            }
        });
    });
}

module.exports = User = mongoose.connection.model('User', userSchema);
