(function(){

    var locomotive = require('locomotive'),
    Controller = locomotive.Controller,
    passport = require('passport'),
    User = require('../models/user');

    var AuthController = new Controller();

    AuthController.login = function() {
      this.render();
    };

    AuthController.authenticate = function() {
      var controller = this;
      controller.redirect('/');
    }
    AuthController.before('authenticate', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }))

    AuthController.logout = function() {
      this.req.logOut();
      this.res.redirect('/');
    };

    AuthController.signup = function() {
      var controller = this;
      controller.errors = [];

      if (this.req.method === 'GET') {
           this.render();
      } else {
        var email = this.param('email').toLowerCase()

        User.findOne({"email": email}, function(err, u) {
          if (err) {
            controller.req.flash("error", err)
            controller.redirect("/signup")
          }
          else if (u) {
            controller.req.flash("error", "User already exists.")
            controller.redirect("/signup")
          }
          else{
            User.registerUser(email, controller.param('password'), function(err, user) {
              if(err)
              {
                controller.req.flash("error", err)
                controller.redirect("/signup")
              }
              else
              {
                controller.req.flash("info","We have sent you an activation email. Please follow the instructions in the email to activate your account.")
                controller.redirect('/login');
              }
            })
          }

        })

      }
    };

    AuthController.activate = function() {
      var controller = this;
        controller.errors = [];

      User.findOne({activationkey: controller.req.params.activationkey}, function(err, user) {
        if(err){
          controller.req.flash("error", err.join(", "))
          controller.flash = controller.req.flash()
          controller.render("msgs/error")
        }
        else
        {
          if(user){
            user.activate(function(){

              controller.req.flash("info","Your account is now active. Please login below.")
              controller.flash = controller.req.flash()
              controller.render("login")

            })

          }
          else
          {
            controller.req.flash("error","User couldn't be found")
            controller.flash = controller.req.flash()
            controller.render("msgs/error")
          }

        }

      })
    }

    AuthController.forgot = function(){
        var controller = this;
        controller.render();
    }

    AuthController.sendresetkey = function(){
        var controller = this;

        User.findOne({email: controller.req.body.email}, function(err, user) {
            if(err){
                controller.req.flash("error", err.join(", "))
                controller.flash = controller.req.flash()
                controller.render("auth/forgot")
            }else{
                if(user){

                    user.passwordreset(function(err){
                        if(err){
                            controller.req.flash("error", err.join(", "))
                            controller.flash = controller.req.flash()
                            controller.render("auth/forgot")
                        }else{
                            console.log(user.passwordresetkey)

                            controller.req.flash("info","A password reset key has been emailed to you. Please check your inbox!")
                            controller.flash = controller.req.flash()
                            controller.render("msgs/msg");
                        }
                    });

                }else{
                    controller.req.flash("error","Couldnt find user")
                    controller.flash = controller.req.flash()
                    controller.render("auth/forgot");
                }

            }
        });

    }

    AuthController.passwordreset = function(){
        var controller = this;
        controller.passwordresetkey = controller.req.param("passwordresetkey")
        controller.render();
    }

    AuthController.setpassword = function(){
        var controller = this;

        User.findOne({passwordresetkey: controller.req.body.passwordresetkey}, function(err, user) {
            if(err){
                controller.req.flash("error", err.join(", "))
                controller.flash = controller.req.flash()
                controller.render("msgs/msg")
            }else{
                if(user){

                    user.changepassword(controller.req.body.password, function(err, result){
                        if(err){
                            controller.req.flash("error", err)
                            controller.flash = controller.req.flash()
                            controller.render("msgs/msg")
                        }
                        else{

                            controller.req.flash("info","Your password has been changed!")
                            controller.redirect("login");

                        }
                    })

                }else{
                    controller.req.flash("error", "Password reset key is invalid.")
                    controller.flash = controller.req.flash()
                    controller.render("msgs/msg")
                }
            }
        });

    }

module.exports = AuthController;

}());