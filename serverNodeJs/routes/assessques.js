var express = require('express'),
router = express.Router(),
//fs = require("fs");
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

router.param('id', function(req, res, next, id) {
	req.id = id;
	next();
});

router.param('status', function(req, res, next, status) {
	req.status = status;
	next();
});

router.param('date', function(req, res, next, date) {
	req.date = date;
	next();
});

router.param('groupId', function(req, res, next, groupId) {
	req.groupId = groupId;
	next();
});

router.param('imageName', function(req, res, next, imageName) {
	req.imageName = imageName;
	next();
});


// get question list
router.get('/getAssessques', function(req, res) {
	mongoose.model('assessques').find({}, (function(err, questions) {
		res.format({
			json: function() {
				res.json(questions);
			}
		});
	}));
});

//insert questions in questions collection
router.post('/insertAssessques', function(req, res) {
	console.log("inside add questions api ");
	var questionId = shortid.generate();
	var questionType = req.body.questionType;
	var questionText = req.body.questionText;
	var quesImgUrl=req.body.quesImgUrl;
	var categoryName = req.body.categoryName;
	var marks = req.body.marks;
	var ans = req.body.answers;
	var updatedDate = new Date();
	var createdDate = new Date();
	mongoose.model('assessques').create({
		questionId: questionId,
		questionType: questionType,
		questionText: questionText,
		quesImgUrl:quesImgUrl,
		marks: marks,
		categoryName: categoryName,
		createdDate: createdDate,
		updatedDate: updatedDate,
		answers: ans
	}, function(err, result) {
		if (err) {
			res.send("There was a problem adding the information to the database.");
		} else {
			res.format({
				json: function() {
					res.json(result);
				}
			});
		}
	})
});

// Add questions to Assesment collections
router.post('/:id/addQuesToAss', function(req, res) {
	var id = req.id;
	var qIds = req.body.questionId;
	mongoose.model('assessqueid').findOne({
		assessmentId: id,
	}, function(err, result) {
		if (result!=null){
			result.update({
				questionId: qIds.split(",")
			},function(err, result) {
				if (err) {
					res.send("There was a problem fetching information from the database.");
				} else {
					res.send("Data updating successfully!");
				}
			})
		}else{
			mongoose.model('assessqueid').create({
				assessmentId: id,
				questionId: qIds.split(",")
			}, function(err, result) {
				if (err) {
					res.send("There was a problem adding the information to the database.");
				} else {
					console.log("result" + result);
					res.format({
						json: function() {
							res.json(result);
						}
					});
				}
			})
		}
	})
});
//getAllquestion

router.get('/getAssessQuestions', function(req, res) {
	mongoose.model('assessques').find (function(err, result) {
		res.format({
			json: function() {
				res.json(result);
			}
		});
	})
});
//Fetch questions list of an assessment, based on question id from two collections assessquest & questions
router.post('/:id/fetchQuestOfAssess', function(req, res) {
	var assessmentId = req.id;
	mongoose.model('assessqueid').findOne({	
		assessmentId: assessmentId,
	}, function(err, assessresult) {
		if (err) {
			var msg = [{
				success: false,
				msg: "There was a problem adding the information to the users database."
			}];
			res.format({
				json: function() {
					res.json(msg);
				}
			});
		} else {
			if (assessresult != null) {
				mongoose.model('assessques').find({
					questionId: {
						$in: assessresult.questionId
					}

				}, function(err, quesresult) {
					res.format({
						json: function() {
							res.json(quesresult);
						}
					});
				});
			};
		}
	})
});

//upload que image
router.post('/uploadQuesImg', function(req, res) {
	console.log("inside upload q img ");
	if (!req.files)
		return res.status(400).send('No files were uploaded.');
	let quesImg = req.files.file;
	var newFileName= req.body.newfilename;
	var imageName=quesImg.name;
	var path = '/home/ec2-user/baduga/uploads/QuesImages/'+newFileName;
	quesImg.mv(path, function(err) {
		if (err)
			return res.status(500).send(err);
		res.send('File uploaded!');
	});
});

//update a particular questions on question collection
router.post('/:id/updateAssessques', function(req, res) {
	var id = req.id;
	var questionId = req.body.questionId;
	var questionType = req.body.questionType;
	var questionText = req.body.questionText;
	var marks = req.body.marks;
	var ans1 = req.body.ans1;
	var ans2 = req.body.ans2;
	var ans3 = req.body.ans3;
	var ans4 = req.body.ans4;
	var correctans = req.body.correctans;
	var updatedDate = new Date();
	var createdDate = new Date();

	mongoose.model('assessques').findOne({
		questionId: id
	}, function(err, result) {
		if (questionId == null) {
			questionId = result.questionId;
		}
		if (questionType == null) {
			questionType = result.questionType;
		}
		if (questionText == null) {
			questionText = result.questionText;
		}
		if (marks == null) {
			marks = result.marks;
		}
		if (ans1 == null) {
			ans1 = (result.Options!=undefined)? result.Options.ans1 : null;
		}
		if (ans2 == null) {
			ans2 = (result.Options!=undefined)? result.Options.ans2 : null;
		}
		if (ans3 == null) {
			ans3 = (result.Options!=undefined)? result.Options.ans3 : null;
		}
		if (ans4 == null) {
			ans4 = (result.Options!=undefined)? result.Options.ans4 : null;
		}
		if (correctans == null) {
			correctans = result.correctans;
		}

		var answer = {
			"Options": {
				"ans1": ans1,
				"ans2": ans2,
				"ans3": ans3,
				"ans4": ans4
			},
			"Correctans": correctans
		};
		if (updatedDate == null) {
			updatedDate = result.updatedDate;
		}
		if (createdDate == null) {
			createdDate = result.createdDate;
		}
		if (err) {
			console.log(err);
		} else {
			if (result != null) {
        //update it
        result.update({
        	questionId: questionId,
        	questionType: questionType,
        	updatedDate: updatedDate,
        	questionText: questionText,
        	marks: marks,
        	answers: answer
        }, function(err, resultID) {
        	if (err) {} else {
        		var msg = {
        			success: true,
        			msg: "data updated successfully."
        		};
        		res.format({
        			json: function() {
        				res.json(resultID);
        			}
        		});
        	}
        });
    }
}
});
});

//delete a single question collection
router.post('/:id/deleteAssessques', function(req, res) {
	mongoose.model('assessques').remove({
		questionId: req.id,
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

//get question by id
router.post('/:id/getAssessquesById', function(req, res) {
	console.log("inside question by Id");
	var id = req.id;
	mongoose.model('assessques').findOne({
		questionId: id
	}, (function(err, questions) {
		res.format({
			json: function() {
				res.json(questions);
			}
		});
	}));
});

//count questions(We need to show the total count on footer)
router.get('/countAllQuestions', function(req, res) {
	mongoose.model('questions').count({}, (function(err, questions) {
		res.format({
			json: function() {
				res.json(questions);
			}
		});
	}))
});

module.exports = router;