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

router.param('groupId', function(req, res, next, groupId) {
	req.groupId = groupId;
	next();
});

router.param('imageName', function(req, res, next, imageName) {
	req.imageName = imageName;
	next();
});


// get question list
router.get('/getQuestions', function(req, res) {
	mongoose.model('questions').find({}, (function(err, questions) {
		res.format({
			json: function() {
				res.json(questions);
			}
		});
	}));
});

//insert questions in questions collection
router.post('/insertquestion', function(req, res) {
	console.log("inside add questions api ");
	var questionId = shortid.generate();
	var questionType = req.body.questionType;
	var questionText = req.body.questionText;
	var quesImgUrl=req.body.quesImgUrl;
	var category = req.body.category;
	var marks = req.body.marks;
	var ans = req.body.answers;
	var updatedDate = new Date();
	var createdDate = new Date();
	mongoose.model('questions').create({
		questionId: questionId,
		questionType: questionType,
		questionText: questionText,
		quesImgUrl:quesImgUrl,
		marks: marks,
		category: category,
		createdDate: createdDate,
		updatedDate: updatedDate,
		answers: ans
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
});



// Add questions to Assesment collections
router.post('/:id/addQuesToAss', function(req, res) {
	var id = req.id;
	var qId = req.body.questionId;
	mongoose.model('assessquest').findOne({
		assessmentId: id,
	}, function(err, result) {
		if (result!=null){
			result.update({
				questionId: qId
			},function(err, result) {
				if (err) {
					res.send("There was a problem fetching information from the database.");
				} else {
					res.send("Data updating successfully!");
				}
			})
		}else{
			mongoose.model('assessquest').create({
				assessmentId: id,
				questionId: qId
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


//upload que image
router.post('/uploadQuesImg', function(req, res) {
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
router.post('/:id/updatequestion', function(req, res) {
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

	mongoose.model('questions').findOne({
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
		console.log(answer);
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
router.post('/:id/deletequestion', function(req, res) {
	mongoose.model('questions').remove({
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
router.post('/:id/getQuestionsById', function(req, res) {
	console.log("inside question by Id");
	var id = req.id;
	mongoose.model('questions').findOne({
		questionId: id
	}, (function(err, questions) {
		res.format({
			json: function() {
				res.json(questions);
			}
		});
	}));
});

//get question by group
router.post('/getQuesByGroup', function(req, res) {
	console.log("inside question by grp");
	var groupId = req.body.groupId;
	mongoose.model('questions').find({
		groupId: groupId
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

router.post('/askArticalById', function(req, res) {
  var articalNo=0;
  var userId = req.body.userId;
  var articalId = shortid.generate();
  var articalType = req.body.articalType;
  var articalText = req.body.articalText;
  var email=req.body.email;
  var updatedDate = new Date();
  var createdDate = new Date();

  mongoose.model('articals').findOne({
    userId:userId,
  },function(err, result) {
    if (result!=null) {
      articalNo = result.articalNo;
    }else {
      mongoose.model('users').findOne({
        userId:userId,
      },function(err, result) {
        if (result!=null) {
          console.log("result");
        }else{
          res.format({
            json: function() {
              res.json([{success : false,
                msg: "Something went wrong"}]);
            }
          });
        }
      }).sort({
        _id:-1
      });
    } //end of else first visit

    //Prepare the User visit obj
    articalNo=articalNo+1;
    var userStatusObj = {
    userId: userId,
    articalId: articalId,
    articalType: articalType,
    articalText: articalText,
    email:email,
    createdDate: createdDate,
    updatedDate: updatedDate
    };
    //Insert the user visit 
    addarticalCount(userStatusObj);
    res.format({
      json: function() {
        res.json([{success : true}]);
      }
    });
  }).sort({_id:-1});
});

function addarticalCount(statusObject) {
  var userId = statusObject.userId;
  mongoose.model('articals').create(
    statusObject
    , function(err, result) {
      mongoose.model('users').findOne({
        userId:userId
      }, function(err, aResult) {
        var articalCount=0;
        if (aResult.articalCount!=undefined && aResult.articalCount!=null) {
          articalCount = aResult.articalCount;
        }
        aResult.update({
          articalCount:articalCount+1 
        },function (err,status) {
          if (!err) {
           console.log("error");
         }
       })
      }).sort({
        _id:-1
      });
    }
  )
}

module.exports = router;