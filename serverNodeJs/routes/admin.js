var express = require('express'),
router = express.Router(),
mongoose = require('mongoose'),
bodyParser = require('body-parser'),
methodOverride = require('method-override');
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

router.param('date', function(req, res, next, date) {
	req.date = date;
	next();
});

router.param('adminId', function(req, res, next, adminId) {
	req.adminId = adminId;
	next();
});

// Update admin profile //
router.post('/updateAdmin', function(req, res) {
	console.log("inside updateAdmin");
	var adminId=req.body.adminId;
	var adName=req.body.adName;
	var email = req.body.email;
	var password=req.body.password;
	updatedDate=new Date();
	mongoose.model('admin').findOne({
		adminId:adminId,
	}, (function(err, userResult) {
		var adName = ((req.body.adName!=null) ? req.body.adName : userResult.adName);
		var password = ((req.body.password!=null) ? req.body.password : userResult.password);
		var email = ((req.body.email!=null) ? req.body.email : userResult.email);
		var userdata=[userResult];
		if (userResult!=null) {
			userResult.update({
				adName:adName,
				email:email,
				password:password,
				updatedDate:updatedDate
			}, (function(err, userUpdated) {
				if (err) {
					var msg =[{
						success: false,
						msg: ""
					}];
					res.format({
						json: function() {
							res.json(msg);
						}
					});
				} else {
					res.format({
						json: function() {
							res.json([userUpdated]);
						}
					});
				}
			}));
		}else{
			var msg =[{
				success: false,
				msg: "There is no data found"
			}];
			res.format({
				json: function() {
					res.json(msg);
				}
			});
		}
	}));
});

//Create or add new admin account//
router.post('/addAdmin', function(req, res) {
	console.log("inside add Admin");
	var adminId = shortid.generate();
	var adName = req.body.adName; 
	var email = req.body.email;
	var password = req.body.password;
	var createdDate = new Date();
	var updatedDate = new Date();
	mongoose.model('admin').findOne({
		email: email,
	}, function(err, result) {
		if (result!=null) {
			res.format({
				json: function() {
					res.json([{
						success: false,
						msg: "This email is already exist."
					}]);
				}
			});
		}else{
			mongoose.model('admin').create({
				adName:adName,
				adminId:adminId,
				email:email,
				password: password,
				createdDate: createdDate,
				updatedDate: updatedDate
			}, function(err, result) {
				if (err) {
					res.format({
						json: function() {
							res.json([{
								success: false,
								msg: "Something went wrong. Please try again."
							}]);
						}
					});
				} else {
					res.format({
						json: function() {
							res.json([{
								success: true,
								msg: "Data Inserted successfully."
							}]);
						}
					});
				}
		    })
	    }
    })
});

//// Get admin profile ///
router.post('/getAdminProfile', function(req, res) {
	console.log("inside getAdminProfile");
	var adminId=req.body.adminId;
	mongoose.model('admin').findOne({
		adminId: adminId,
	}, function(err, result) {
		var msg;
		if (err == null) {
			msg = {
				success: true,
				msg: "Admin profile data"
			};
		} else {
			msg = {
				success: true,
				msg: "Error while fetching data"
			};
		}
		res.format({
			json: function() {
				res.json(result);
			}
		});
	});
});

//// Sign In for admin //// 
router.post('/adminSignin', function(req, res) {
	console.log("inside adminSignin");
	var email=req.body.email;
	var password=req.body.password;
	mongoose.model('admin').findOne({
		email:email,
		password:password
	}, function(err, result) {
		var msg;
		if (err == null) {
			msg = {
				success: true,
				msg: "Admin Sign In data"
			};
		} else {
			msg = {
				success: true,
				msg: "Error while fetching data"
			};
		}
		res.format({
			json: function() {
				res.json(result);
			}
		});
	});
});

//Delete a Single admin(This API is useful for deleting single user from admin collection)
router.post('/:adminId/deleteAdmin', function(req, res) {
	console.log("inside deleteAdmin");
	mongoose.model('admin').remove({
		adminId: req.adminId,
	}, function(err) {
		var msg;
		if (err == null) {
			msg = {
				success: true,
				msg: "data deleted successfully."
			};
		} else {
			msg = {
				success: true,
				msg: "data delete error."
			};
		}
		res.format({
			json: function() {
				res.json(msg);
			}
		});
	});
});

module.exports = router;