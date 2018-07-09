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

router.get('/getInstruction', function(req, res) {
  mongoose.model('instruction').find({
  }, function(err, result) {
    res.format({
        json: function() {
           res.json(result);
        }
    });
  });
});


// Add questions to Assesment collections //
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

// Add questions to Assesment collections //
router.post('/:id/addQuesToAss', function(req, res) {
  console.log("Inside addQuesToAss API");
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

router.post('/searchAssess', function(req, res) {
  console.log("inside assessmentName");
  var assessmentName=req.body.assessmentName;
  mongoose.model('assessment').find({ 
    assessmentName:new RegExp(assessmentName, 'i')
  },function(err,data){
    if (data!=null) {
      res.format({
        json: function() {
          res.json(data);
        }
      });
    }else{
      var msg = {
        success: true,
        msg: "No matches found!"
      };
      res.format({
        json: function() {
          res.json(msg);
        }
      });
    }
  });
});

// insert Assesment 
router.post('/insertassesment', function(req, res) {
  var shortid = require('shortid');
  getShortId = shortid.generate();
  var assessmentId = getShortId;
  var timePeriod = req.body.timePeriod;
  var passingMarks = req.body.passingMarks;
  var totalMarks = req.body.totalMarks;
  var assessmentName = req.body.assessmentName;
  var categoryName = req.body.categoryName;
  var groupName = req.body.groupName;
  var level = req.body.level;
  var updatedDate = new Date();
  var createdDate = new Date();
  mongoose.model('assessment').create({
    assessmentId: assessmentId,
    timePeriod: timePeriod,
    passingMarks: passingMarks,
    totalMarks: totalMarks,
    categoryName : categoryName,
    groupName : groupName,
    level :  level,
    assessmentName: assessmentName,
    updatedDate: updatedDate,
    createdDate: createdDate
  }, function(err, result) {
    if (err) {
      res.send("There was a problem adding the information in the database.");
    } else {
      res.format({
        json: function() {
          res.json(result);
        }
      });
    }
  })
});


router.post('/updateAssessment', function(req, res) {
    var assessmentId=req.body.assessmentId;
    var updatedDate=new Date();
    mongoose.model('assessment').findOne({
     assessmentId:assessmentId
    }, (function(err, updtResult) {
    if (updtResult!=null) {
      var timePeriod = ((req.body.timePeriod!=null && req.body.timePeriod!=undefined && req.body.timePeriod!="") ? req.body.timePeriod : updtResult.timePeriod);
      var passingMarks = ((req.body.passingMarks!=null && req.body.passingMarks!=undefined && req.body.passingMarks!="") ? req.body.passingMarks : updtResult.passingMarks);
      var category = ((req.body.category!=null && req.body.category!=undefined && req.body.category!="") ? req.body.category : updtResult.category);
      var totalMarks = ((req.body.totalMarks!=null && req.body.totalMarks!=undefined && req.body.totalMarks!="") ? req.body.totalMarks : updtResult.totalMarks);
      var groupName = ((req.body.groupName!=null && req.body.groupName!=undefined && req.body.groupName!="") ? req.body.groupName : updtResult.groupName);
      var level = ((req.body.level!=null && req.body.level!=undefined && req.body.level!="") ? req.body.level : updtResult.level);
      var assessmentName = ((req.body.assessmentName!=null && req.body.assessmentName!=undefined && req.body.assessmentName!="") ? req.body.assessmentName : updtResult.assessmentName);
      var newObj = {
        'assessmentName': assessmentName,
        'groupName': groupName,
        'category': category,
        'timePeriod': timePeriod,
        'passingMarks': passingMarks,
        'totalMarks': totalMarks,
        'level' : level,
        'updatedDate':new Date()
       }
        updtResult.update(newObj,(function(err, updatedInfo) {
          if (err) {
            var msg =[{
              success: false,
              msg: "Something went wrong. Please try again."
            }];
            res.format({
              json: function() {
                res.json(msg);
              }
            });
          } else {
            res.format({
              json: function() {
                res.json([{success:true}]);
              }
            });
          }
        }));
    }else{
      var msg =[{
        success: false,
        msg: "Unable to find data with this username."
      }];
      res.format({
        json: function() {
          res.json(msg);
        }
      });
    }
  }));
});

//delete assesment
router.post('/:id/deleteassessment', function(req, res) {
  var assessmentId=req.id;
  mongoose.model('assessment').remove({
    assessmentId: assessmentId,
  }, function(err, result) {
    if (err) {
      var msg = {
        success: false,
        msg: "There was a problem adding the information to the users database."
      };
      res.format({
        json: function() {
          res.json(msg);
        }
      });
    } else {
      console.log("result" + assessresult);
      res.format({
        json: function() {
          res.json(assessresult);
        }
      });
    }
  });
});

//count assessment
router.get('/countAllAssesment', function(req, res) {
  mongoose.model('assessment').count({}, (function(err, assessment) {
    res.format({
      json: function() {
        res.json(assessment);
      }
    });
  }))
});

router.post('/getAssessmentByName', function(req, res) {
  var assessmentName=req.body.assessmentName;
  mongoose.model('assessment').findOne({
    assessmentName:assessmentName
  }, (function(err, assessment) {
    res.format({
      json: function() {
        res.json([assessment]);
      }
    });
  }));
});


router.get('/getAllAssessment', function(req, res) {
  mongoose.model('assessment').find({
  }, (function(err, assessment) {
    res.format({
      json: function() {
        res.json(assessment);
      }
    });
  }));
});

router.post('/:id/getAssessmentById', function(req, res) {
  var assessmentId=req.id;
  mongoose.model('assessment').findOne({
    assessmentId:assessmentId
  }, (function(err, assessment) {
    res.format({
      json: function() {
        res.json([assessment]);
      }
    });
  }));
});

router.post('/searchAssess', function(req, res) {
  console.log("inside searchAssess");
  var assessmentName=req.body.assessmentName;
  mongoose.model('assessment').find({ 
    assessmentName:new RegExp(assessmentName, 'i')
  },function(err,data){
    if (data!=null) {
      res.format({
        json: function() {
          res.json(data);
        }
      });
    }else{
      var msg = {
        success: true,
        msg: "No matches found!"
      };
      res.format({
        json: function() {
          res.json(msg);
        }
      });
    }
    console.log('data',data);
  });
});

//Fetch data for Start Assessments from two collections assessments & assessques based on assessment Id
router.post('/:id/startAssessment', function(req, res) {
  var moment = require('moment');
  var assessmentId = req.id;
  var startTime = req.body.currentTime;
  var createdDate = new Date();
  var FinalRes=[];
  var timeDifference=[];
  var startedTestRes=[];
  var submitType;
  var userAnswers;
  mongoose.model('userassessments').findOne({
    assessmentId: assessmentId,
  }, (function(err, userAssessResult) {
    if (userAssessResult!=null) {
      submitType=userAssessResult.submitType;
      var sTime=userAssessResult.createdDate;
      var fTime=userAssessResult.updateDate;
      var startDate = moment(sTime, 'mm');
      var endDate = moment(fTime, 'mm');
      var timeDiff=moment.utc(moment(endDate,"mm").diff(moment(startDate,"mm"))).format("mm");
      timeDifference.push(timeDiff);
      userAssessResult.update({
        assessmentId: assessmentId,
        // socialId:socialId,
        startTime: startTime,
        finishTime:"",
        obtainedMarks:"",
        status:"",
        submitType:submitType,
        updateDate: createdDate,
      }, (function(err, userUpdated) {
        if (userUpdated!=null) {
          mongoose.model('usersans').findOne({
            assessmentId: assessmentId,
            // socialId:socialId,
          }, (function(err, userAnsResult) {
            if (err) {
              var msg = {
                success: true,
                msg: "There is a problem to updating data! Please try again."
              };
              res.format({
                json: function() {
                  res.json(msg);
                }
              });
            } else {
              if (userAnsResult!=null) {
                userAnswers=userAnsResult.answerDetail;
              }
            }
          }));
        }
      }));
    }else{
      mongoose.model('userassessments').create({
        assessmentId: assessmentId,
        startTime: startTime,
        finishTime:"",
        obtainedMarks:"",
        status:"",
        submitType:"",
        updateDate: createdDate,
        createdDate: createdDate,
      }, (function(err, userAssessResult) {
      }));
    }
  }));
  mongoose.model('assessment').find({
    assessmentId: assessmentId
  }, (function(err, assessresult) {
    mongoose.model('assessqueid').findOne({
      assessmentId: {
        $in: assessmentId
      }
    }, function(err, assessQuestResult) {
      if (assessQuestResult!=null) {
        var questionIds=assessQuestResult.questionId;
        mongoose.model('questions').find({
          questionId: {
            $in: questionIds
          }
        }, function(err, quesresult) {
          for (var i = 0; i < quesresult.length; i++) {
            var addObj= new Object();
            var id=quesresult[i]._id;
            var qId=quesresult[i].questionId;
            var questionType=quesresult[i].questionType;
            var questionText=quesresult[i].questionText;
            var quesImgUrl=quesresult[i].quesImgUrl;
            var marks=quesresult[i].marks;
            var answers=quesresult[i].answers; 
            if (timeDifference[0]>0) {
              addObj.timePeriod = timeDifference[0];
            }else{
              addObj.timePeriod = assessresult[0].timePeriod;
            }
            addObj.assessmentId = assessresult[0].assessmentId;
            addObj.assessName = assessresult[0].assessmentName;
            addObj.passingMarks = assessresult[0].passingMarks;
            addObj.totalMarks = assessresult[0].totalMarks;
            addObj.questionType = questionType;
            addObj.questionText = questionText;
            addObj.quesImgUrl = quesImgUrl;
            addObj.questionId = qId;
            addObj._id = id;
            addObj.marks = marks;
            addObj.answers = answers;
            addObj.submitType = submitType;
            addObj.userAnswers = userAnswers;
            FinalRes.push(addObj);
          }
          res.format({
            json: function() {
              res.json(FinalRes);
            }
          });
        });
      }
    });      
  }));
});


router.post('/:id/submitAssessAns', function(req, res) {
  var assessid = req.id;
  var ansD=req.body.ansDetails;
  var createdDate = new Date();
  var qDetail=new Object();
  var ans=[];
  ans.push(ansD);
  mongoose.model('usersans').findOne({
    assessmentId: assessid,
  }, (function(err, uassessresult) {
    if (uassessresult!=null) {
      var answerDetail=[];
      var assessmentId="";
      for (var i = 0; i < uassessresult.length; i++) {
        var answerDetail=  uassessresult[i].answerDetail;
        var assessmentId=  uassessresult[i].assessmentId;
      };
      if (answerDetail!=null) {
        answerDetail.push(ansD);
      };
      uassessresult.update({
        answerDetail:answerDetail,
        updatedDate: createdDate
      }, function(err, uAsssessUpdated) {
        if (err) {
          var msg = {
            success: true,
            msg: "There is a problem to updating data! Please try again."
          };
          res.format({
            json: function() {
              res.json(msg);
            }
          });
        } else {
          res.format({
            json: function() {
              res.json(uAsssessUpdated);
            }
          });
        }
      });
    }else{
      mongoose.model('usersans').create({
        assessmentId: assessid,
        answerDetail:ans,
        createdDate:createdDate,
        updatedDate:createdDate
      }, function(err, useransResult) {
        res.format({
          json: function() {
            res.json(useransResult);
          }
        });
      });
    }
  }));
});



//Calculate Assessment Result and update user assessment collection details API
router.post('/:id/submitAssessDetails', function(req, res) {
  var assessmentId=req.id;
  var socialId=req.body.socialId;
  var obtainedMarks=req.body.obtainedMarks;
  var finishTime=req.body.finishTime;
  var submitType=req.body.submitType;
  mongoose.model('assessments').findOne({
    assessmentId:assessmentId,
  }, (function(err, assess) {
    var passingMarks=assess.passingMarks;
    if (err) {
      var msg = [{
        success: false,
        msg: "There was a problem finding  information from assessments database."
      }];
      res.format({
        json: function() {
          res.json(msg);
        }
      });
    } else {
      mongoose.model('userassessments').findOne({
        assessmentId:assessmentId,
        socialId:socialId,
      }, (function(err, userAssess) {
        if (userAssess!=null) {
          var status;
          if (obtainedMarks>=passingMarks) {
            status="Pass";
          }else{
            status="Fail";
          }
          var startTime =userAssess.startTime;
          var createdDate =userAssess.createdDate;
          var updatedDate=new Date();
          userAssess.update({
            startTime:startTime,
            finishTime:finishTime,
            obtainedMarks:obtainedMarks,
            status:status,
            submitType:submitType,
            createdDate:createdDate,
            updateDate:updatedDate
          }, (function(err, updatedUserAssess) {
            if (err) {
              var msg = [{
                success: false,
                msg: "There was a problem updating  information to the userassessments collection."
              }];
              res.format({
                json: function() {
                  res.json(msg);
                }
              });
            }else{
              res.format({
                json: function() {
                  res.json(updatedUserAssess);
                }
              });
            };
          }));
        };
      }));
    }
  }));
});

module.exports = router;