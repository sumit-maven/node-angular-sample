var express = require('express'),
router = express.Router(),
mongoose = require('mongoose'),
bodyParser = require('body-parser'),
methodOverride = require('method-override');
var nodemailer = require('nodemailer');
var shortid = require('shortid');
const fileUpload = require('express-fileupload');
router.use(fileUpload());

router.use(bodyParser.urlencoded({
	extended: true
}))

router.use(methodOverride(function(req, res) {
	if (req.body && typeof req.body === 'object' && '_method' in req.body) {
		var method = req.body._method
		delete req.body._method
		return method
	}
}))

router.param('groupId', function(req, res, next, groupId) {
  req.groupId = groupId;
  next();
});

router.param('language', function(req, res, next, language) {
  req.language = language;
  next();
});

///Get last 10 chat of group//
router.get('/:groupId/getChat', function(req, res) {
  console.log("inside grt chat");
  var groupId = req.groupId;
  mongoose.model('chat').find({
  groupId: groupId
  }, (function(err, result) {
    res.format({
      json: function() {
        res.json(result);
      }
    });
  })).sort({_id:-1}).limit(10);
});

module.exports = router;