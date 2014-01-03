(function(){

    var locomotive = require('locomotive'),
    Controller = locomotive.Controller;

    var _ = require('underscore'),
    fs = require('fs');

    // Bootstrap helpers
    var helpers_path = __dirname + '/../../code/helpers'
    var helpers_files = fs.readdirSync(helpers_path)
    helpers_files.forEach(function(file){
        require(helpers_path+'/'+file)
    })

    // Bootstrap models
    var models_path = __dirname + '/../../app/models'
    var model_files = fs.readdirSync(models_path)
    model_files.forEach(function(file){
        require(models_path+'/'+file)
    })

    var PagesController = new Controller();


    PagesController.main = function() {
        this.render();
    };

    PagesController.about = function() {
      this.render();
    };

    PagesController.faqs = function() {
      this.render();
    };

    PagesController.contact = function() {

      if (this.req.method === 'GET') {
        this.render()
      }
      else
      {
        var data = {}
        data.Subject = this.req.body["frmsubject"]
        data.Message = this.req.body["frmmessage"]
        data.Name = this.req.body["frmname"]
        data.Email = this.req.body["frmemail"]

        this.req.flash("info", "Thank You for contacting us - Your message has been sent.")
        this.res.redirect("/");

        sendemail(conf[environment].adminemail, "Contact form", data, "htmltemplates/email/contact.mustache")
      }

    };

    PagesController.error = function() {
      this.render("msgs/msg");
    };


    module.exports = PagesController;

}());