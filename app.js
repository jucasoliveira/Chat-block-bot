let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');

//security modules
let helmet = require('helmet');
let ExpressBrute = require('express-brute');
let csrf = require('csurf');

let csrfProtection = csrf({ cookie: true });
let parseForm = bodyParser.urlencoded({ extended: false });

let store = new ExpressBrute.MemoryStore(); // stores state locally, don't use this in production
let bruteforce = new ExpressBrute(store);

let methodOverride = require('method-override'),
    session = require('express-session'),
    passport = require('passport'),
    index = require('./routes/index'),
    users = require('./routes/users'),
    dashboard = require('./routes/dashboard'),
    renderText = require('./routes/renderFile');

// import passport configuration to login
require('./config/passport')(passport);

// Simple route middleware to ensure user is authenticated.
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    req.session.error = 'Please sign in!';
    res.redirect('/signin');
}

// realtime chatbot
let socket = require('./config/sock');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public/images', 'chatbotico.png')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet());
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(session({secret: 'supernova', saveUninitialized: true, resave: true}));
app.use(passport.initialize());
app.use(passport.session());

// Session-persisted message middleware
app.use(function(req, res, next){
    let err = req.session.error,
        msg = req.session.notice,
        success = req.session.success;

    delete req.session.error;
    delete req.session.success;
    delete req.session.notice;

    if (err) res.locals.error = err;
    if (msg) res.locals.notice = msg;
    if (success) res.locals.success = success;

    next();
});


app.use('/', csrfProtection, index);
app.use('/users', users);
app.use('/users/dashboard',parseForm, csrfProtection, dashboard);

// displays our signup page
app.use('/singing', parseForm, csrfProtection, function(req, res){
    res.render('singing', {csrfToken: req.csrfToken()});
});

// sends the request through our local signup strategy, and if successful takes user to homepage, otherwise returns then to signin page
app.use('/local-reg', passport.authenticate('local-signup', {
        successRedirect: '/users/dashboard',
        failureRedirect: '/singing'
    })
);

// sends the request through our local login/signin strategy, and if successful takes user to homepage, otherwise returns then to signin page
app.use('/login',bruteforce.prevent, passport.authenticate('local-signin', {
        successRedirect: '/users/dashboard',
        failureRedirect: '/singing'
    })
);


// route for facebook authentication and login
app.use('/auth/facebook', passport.authenticate('facebook', { scope : ['public_profile', 'email'] }));

// handle the callback after facebook has authenticated the user
app.use('/auth/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect : '/users/dashboard',
        failureRedirect : '/singing'
    }));


app.use('/.well-known/pki-validation/31DA46F43E6F35E344DEB5D3581BBFBE.txt', renderText);

app.use('/download/:idHash', parseForm, csrfProtection, function (req, res) {
    console.log('on download', req.params.idHash);
    res.download(__dirname + `/public/tempfile/${req.params.idHash}.jpg`, `${req.params.idHash}.jpg`);
});

// logs user out of site, deleting them from the session, and returns to homepage
app.use('/logout', function(req, res){
    let name = req.user.username;
    console.log("LOGGIN OUT " + req.user.username)
    req.logout();
    res.redirect('/');
    req.session.notice = "You have successfully been logged out " + name + "!";
});


// Socket connection
let server = require('http').Server(app);
socket.fromClient(server);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = {app: app, server: server};
