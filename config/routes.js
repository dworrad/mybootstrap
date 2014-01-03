var passport = require('./passport');

module.exports = function routes() {

  this.root('pages#main');
  
  this.match('about', 'pages#about', { via: ['get'] });
  this.match('faqs', 'pages#faqs', { via: ['get'] });
  this.match('contact', 'pages#contact', { via: ['get', 'post'] });
  this.match('error', 'pages#error', { via: ['get'] });

  this.match('login', 'auth#login', { via: ['get'] });
  this.match('login', 'auth#authenticate', { via: ['post'] });

  this.match('logout', 'auth#logout');
  this.match('signup', 'auth#signup', { via: ['get', 'post'] });
  this.match('login/activation/:activationkey', 'auth#activate', { via: ['get'] })

  this.match('forgot', 'auth#forgot', { via: ['get'] });
  this.match('forgot', 'auth#sendresetkey', { via: ['post'] });
  this.match('forgot/:passwordresetkey', 'auth#passwordreset', { via: ['get'] });
  this.match('forgot/reset', 'auth#setpassword', { via: ['post'] });

  //Misc
  this.match('githubhook', "github#hook", { via: ['post'] })

};
