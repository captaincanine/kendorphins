var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/invite', function(req, res, next) {
	
  var myFirebaseRef = new Firebase("https://kendorphins.firebaseio.com/");
  myFirebaseRef.once("value", function(snapshot) {
  	var data = snapshot.val();
  	res.render('invite', { firebase: data });
  });
	
});

module.exports = router;