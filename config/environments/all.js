var express = require('express')
var poweredBy = require('connect-powered-by')
var util = require('util')
var passport = require('../passport')
var MongoStore = require('connect-mongo')(express)

module.exports = function() {
  var app = this;

  console.log("Env: " + environment + " - DB: " + conf[environment].database_connection)

  if (this.version !== require('locomotive').version) {
    console.warn(util.format('version mismatch between local (%s) and global (%s) Locomotive module', require('locomotive').version, this.version));
  }

  this.set('views', __dirname + '/../../app/views');
  this.set('view engine', 'ejs');

  this.datastore(require('locomotive-mongoose'));

  this.use(poweredBy('Locomotive'));

  this.set('mongodb uri', conf[environment].database_connection);

  // Winston Logging - Not needed at the moment
  // var winston = require('winston')
  // var logger = new (winston.Logger)({
  //   transports: [ 
  //   new (winston.transports.File)({ filename: 'logs/' + new Date().getTime() + '.log', level: 'info' })
  //   ]
  // })

  // logger.extend(this);
  // this.set('logger', logger);


  this.use(express.favicon());
  this.use(express['static'](__dirname + '/../../public'));
  this.use(express.cookieParser());
  this.use(express.bodyParser());
  store = new MongoStore({url: conf[environment].database_connection, clear_interval: 600});
  app.use(express.session({
      secret: 'esoognom',
      store: store
      }));
  this.use(passport.initialize());
  this.use(passport.session());
  this.use(require('connect-flash')());

  this.use(function(req, res, next) {
    res.locals.user = req.user;
    res.locals.flash = req.flash();
    res.locals.session = req.session;
    next();
  });

  this.use(this.router);
};
