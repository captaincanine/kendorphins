var express = require('express');
var swig = require('swig');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var firebase = require("firebase");
var markdown = require( "markdown");
var extras = require('swig-extras');
var nodemailer = require('nodemailer');
var request = require('request');

extras.useFilter(swig, 'markdown');

var index = require('./routes/index');
var invite = require('./routes/invite');
var users = require('./routes/users');

var app = express();

if (app.get('env') === 'development') {
	var RECAPTCHA_PUBLIC_KEY  = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';
	var RECAPTCHA_PRIVATE_KEY = '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe';
	var ADMIN_EMAIL = 'keith@marran.com';
}

if (app.get('env') === 'production') {
	var RECAPTCHA_PUBLIC_KEY  = '6LdLHSUTAAAAAAivtlfkbffOQKMz3jgPJe2DZukS';
	var RECAPTCHA_PRIVATE_KEY = '6LdLHSUTAAAAAB5XuXwXpfLX_kGSVAMFwsj3cQ0v';
	var ADMIN_EMAIL = 'kenneth@kendorphins.com';
}

// view engine setup
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));
app.set('view cache', false);
swig.setDefaults({ cache: false });

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/invite', function(req, res) {
	res.render('invite');
});
app.use('/birthday', function(req, res) {
	res.render('invite');
});app.use('/admin', function(req, res) {
	res.render('editor');
});

app.post('/rsvp', function(req, res) {
	
	try {

		if (req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
			return res.json({ "responseCode" : 1, "responseDesc" : "Please select captcha"});
		}
		
		// Put your secret key here.
		var secretKey = RECAPTCHA_PRIVATE_KEY;
		
		// req.connection.remoteAddress will provide IP address of connected user.
		var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
		
		// Hitting GET request to the URL, Google will respond with success or error scenario.
		request(verificationUrl, function(error, response,body) {
	
			body = JSON.parse(body);
	
			// Success will be true or false depending upon captcha validation.
			if (body.success !== undefined && !body.success) {				
				return res.json({ "responseCode" : 1, "responseDesc" : "Failed captcha verification"});
			}
			
			var Firebase = require('firebase');
			var fire = new Firebase('https://kendorphins.firebaseio.com/events/birthday2016');
			
			fire.push({ attendee: { name: req.body.name, attending: req.body.attending, note: req.body.note }});

		});

	} catch(e) {
		
		console.log(e);
	}

});


app.post('/contact', function(req, res) {
	
	try {

		if (req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
			return res.json({ "responseCode" : 1, "responseDesc" : "Please select captcha"});
		}
		
		// Put your secret key here.
		var secretKey = RECAPTCHA_PRIVATE_KEY;
		
		// req.connection.remoteAddress will provide IP address of connected user.
		var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
		
		// Hitting GET request to the URL, Google will respond with success or error scenario.
		request(verificationUrl, function(error, response,body) {
	
			body = JSON.parse(body);
	
			// Success will be true or false depending upon captcha validation.
			if (body.success !== undefined && !body.success) {				
				return res.json({ "responseCode" : 1, "responseDesc" : "Failed captcha verification"});
			}
			
			// SEND EMAIL
		    var transporter = nodemailer.createTransport("smtps://admin%40kendorphins.com:PlHeLeHe@smtp.gmail.com");
		    
		    // setup e-mail data with unicode symbols
			var mailOptions = {
			    from: 		'admin@kendorphins.com', // sender address
			    to: 		ADMIN_EMAIL, // list of receivers
			    subject: 	'You have a message from kendorphins.com', // Subject line
			    html: 		'<p>You have a message from kendorphins.com. The following person filled out the contact form:</p><blockquote><p>name: <b>' + req.body.name + '</b></p><p>email: <b><a href="mailto:' + req.body.email + '">' + req.body.email + '</a></b></p><p>note: <b>' + req.body.note + '</b></p></blockquote>' // html body
			};
			
			// send mail with defined transport object
			transporter.sendMail(mailOptions, function(error, info){

			    if (error) {
			        console.log(error);
			    } else {
					res.json({"responseCode" : 0, "responseDesc" : "Sucess"});
			    }
			    
			});
	
		});

	} catch(e) {
		
		console.log(e);
	}

});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
