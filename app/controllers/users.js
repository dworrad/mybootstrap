(function(){

    var locomotive = require('locomotive'),
    Controller = locomotive.Controller

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

    var UsersController = new Controller();


    UsersController.edit = function() {
        var controller = this
        controller.errors = [];

        controller.title = "User Edit"
        controller.render()


    }


    UsersController.update = function() {
        var controller = this
        controller.errors = [];

        User.findById(controller.req.user._id, function(err, user) {
            if(err){
                controller.req.flash("error", err)
                controller.render("msgs/error")
            }
            else
            {
                user.update(controller.req.body.phone, controller.req.body.firstname, controller.req.body.lastname, function(err){
                    if(err){
                        controller.req.flash("error", err)
                        controller.render("msgs/msg")
                    }
                    else{

                        controller.req.flash("info","Your profile has been updated.")
                        controller.redirect("/overview")

                    }

                })
            }
        })
    }

    UsersController.changepassword = function() {
        var controller = this
        User.findById(controller.req.user._id, function(err, user) {
            if(err){
                controller.req.flash("error", err)
                controller.render("msgs/error")
            }
            else
            {
                user.changepassword(controller.req.body.password, function(err, result){
                    if(err){
                        controller.req.flash("error", err)
                        controller.render("msgs/msg")
                    }
                    else{

                        controller.req.flash("info","Your password has been updated.")
                        controller.redirect("/overview")

                    }
                })
            }
        });
    }




    UsersController.before('*', function(req, res, next){ if(req.isAuthenticated()){  return next()  }else{ res.redirect('login') }})
    module.exports = UsersController;

}());