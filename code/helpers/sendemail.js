var email = require('mailer')

exports = sendemail = function(to, subject, data, template, cb){

  if(environment != "production"){
    console.log("Changing the TO address on sendemail to - (" + conf[environment].testemailaddress + ") as not production or demo!")
    to = conf[environment].testemailaddress
  }

    var settings = {
        domain: "smtp.sendgrid.net",
        host: "smtp.sendgrid.net",
        port : 587,
        authentication: "login",
        username: conf[environment].sendgriduser,
        password: conf[environment].sendgridpwd,
        to : to,
        from : conf[environment].EmailsFrom,
        subject : subject,
        data: data,
        template: template
    };

  
    if(conf[environment].sendgriduser && conf[environment].sendgridpwd){
      email.send(settings, function(err, result) {
          if(err) {
            console.log("Error - " + err)
            // An error occurred. Handle it

            cb(err)
          }
          else
          {
            console.log("Mail send result - " + result)
            cb(null)
          }
          // Your message has been sent!
      });
    }
    else
    {
      console.log("Email not being sent as send grid details not set!")
    }


}

