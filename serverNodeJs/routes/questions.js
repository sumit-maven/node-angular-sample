var express = require('express'),
router = express.Router(),
fs = require("fs");
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

var multer = require('multer'); 
var path   = require('path');

var storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, './uploadimages')
  },
  filename: function(req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})

router.param('id', function(req, res, next, id) {
	req.id = id;
	next();
});

router.param('status', function(req, res, next, status) {
	req.status = status;
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

router.param('userId', function(req, res, next, userId) {
  req.userId = userId;
  next();
});

router.param('language', function(req, res, next, language) {
  req.language = language;
  next();
});
router.param('questionId', function(req, res, next, questionId) {
  req.questionId = questionId;
  next();
});

router.param('imageName', function(req, res, next, imageName) {
	req.imageName = imageName;
	next();
});

// get question list
router.get('/getQuestions', function(req, res) {
  console.log("inside getQuestions");
	mongoose.model('questions').find({status:"Enabled"}, (function(err, result) {
		res.format({
			json: function() {
				res.json(result);
			}
		});
	}));
});

// get all feeds //
router.get('/getAllFeed', function(req, res) {
  console.log("inside getAllFeed ");
  mongoose.model('questions').find({}, (function(err, result) {
    res.format({
      json: function() {
        res.json(result);
      }
    });
  })).sort({
    _id:-1
  });
});

// get question detail by question id //
router.get('/:questionId/getQuestionsByDetails', function(req, res) {
  console.log("inside getQuestionsByDetails ");
  mongoose.model('questions').find({
    questionId: req.questionId,
  }, function(err, result) {
    if (err) {
      console.log('GET Error: There was a problem retrieving: ' + err);
    } else {
      res.format({
        json: function() {
          res.json(result);
        }
      });
    }
  });
});


// get all feeds on the basis of language //
router.get('/:language/getAllFeeds', function(req, res) {
  console.log("inside getAllFeed ");
  var language=req.language;
  mongoose.model('questions').find({
    language:language
  }, (function(err, result) {
    res.format({
     json: function() {
      res.json(result);
    }
  });
  })).sort({
    _id:-1
  }).limit(50);
});


//getUserByQues for Website
router.get('/:language/:userId/getUserByQues', function(req, res) {
  console.log("inside getUserByQues ");
  var userId = req.userId;
  var language = req.language;
  mongoose.model('questions').find({
    userId: userId,
    language: language
  }, (function(err, result) {
    res.format({
      json: function() {
        res.json(result);
      }
    });
  }));
});

//// Submit report for question ///
router.post('/submitReport', function(req, res) {
  console.log("inside submitReport ");
  var userId = req.body.userId;
  var questionId=req.body.questionId;
  var language=req.body.language;
  var incorrectTopicText=req.body.incorrectTopicText;
  var poorlyWrittenText=req.body.poorlyWrittenText;
  var insincereText=req.body.insincereText;
  var userName="";
  var userImage="";
  var createdDate=new Date();

  mongoose.model('users').findOne({
    userId:userId
  }, (function(err, result) {
   if(result!=null){
    mongoose.model('report').create({
     userId:userId,
     userName:result.userName,
     userImage:result.userImage,
     language:language,
     questionId:questionId,
     incorrectTopicText:incorrectTopicText,
     poorlyWrittenText:poorlyWrittenText,
     createdDate:createdDate,
     insincereText:insincereText
   }, (function(err, result) {
    if(err){
      console.log("Something has gone wrong!"+err);
    }else{
     res.format({
       json: function() {
         res.json([{
           success: true,
           msg: "Report submit successfully"
         }]);
       }
     });
   }
 }));
  }
}));
});

//Search Questions
router.post('/:language/searchQues', function(req, res) {
  console.log("inside searchQues language basis");
  var language=req.language;
  var questionText=req.body.questionText;
  mongoose.model('questions').find({ 
    language:language,
    questionText:new RegExp(questionText, 'i')
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

//For website search//
router.get('/searchQues', function(req, res) {
  console.log("inside searchQues");
  var questionText=req.body.questionText;
  mongoose.model('questions').find({ 
   questionText:new RegExp(questionText, 'i')
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

//Get Grops by userId //
router.post('/:language/getFeedsById', function(req, res) {
  console.log("inside getFeedsById ");
  var userId=req.body.userId;
  var language=req.language;
  mongoose.model('users').findOne({
    userId:userId
  }, function(err, userResult){
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
      var userdata=[]; 
      userdata=userResult.following;
      userdata.push({'userId':userId});
      if (userResult!=null) {
        if(userdata.length>0){
          var groupdatas=[];
          for (var i = 0;i < userdata.length;i++) {
            mongoose.model('questions').find({
              userId:userdata[i].userId,
              language:language
            }, function(err,Result){
              groupdatas.push(Result)
              if(groupdatas.length==userdata.length){
                res.format({
                 json: function() {
                  res.json(groupdatas.sort());
                }
              });
              }
            }).limit(2).sort({
             _id:-1
           });    
          }//end forloop
        }else{
         var msg =[{
          success: false,
          msg: "Something went wrong. Please try again."
        }];
        res.format({
          json: function() {
            res.json(msg);
          }
        });
      }
    }
  }
});
});//end main block



//insert questions in questions collection
router.post('/insertquestion', function(req, res) {
	console.log("inside add questions api ");
	var questionId = shortid.generate();
	var questionType = req.body.questionType;
	var questionText = req.body.questionText;
	var quesImgUrl=req.body.quesImgUrl;
	var categoryName = req.body.categoryName;
  var postedBy = req.body.postedBy;
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
    categoryName: categoryName,
    postedBy: postedBy,
    createdDate: createdDate,
    updatedDate: updatedDate,
    answers: ans
  }, function(err, result) {
    if (err) {
     res.send("There was a problem adding the information to the database.");
   } else {
     sendNotification("Test Baduga");
     res.format({
      json: function() {
       res.json(result);
     }
   });
   }
 })
});

//delete a single question collection
router.post('/:id/deletequestion', function(req, res) {
  console.log("inside deletequestion ");
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
	console.log("post Id " + id);
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
router.post('/:language/getQuesByGroup', function(req, res) {
	console.log("inside question by grp");
  var language = req.language;
  var groupId = req.body.groupId;
  mongoose.model('questions').find({
    groupId: groupId,
    language:language
  }, (function(err, questions) {
    res.format({
     json: function() {
      res.json(questions);
    }
  });
  }));
});
/////////////
router.post('/getQuesByGroup', function(req, res) {
  console.log("inside question by grp");
  var groupId = req.body.groupId;
  mongoose.model('questions').find({
    groupId: groupId,
  }, (function(err, questions) {
    res.format({
      json: function() {
        res.json(questions);
      }
    });
  }));
});
/////////////

router.get('/getQueImg/:imageName', function(req, res) {
  console.log("inside getQueImg");
  var imageName = req.imageName;
  var http = require('http');
  var fs = require('fs');
  var path = '/home/ec2-user/baduga/uploads/QueImg/'+imageName;
  fs.readFile(path, function(err, data) {
    res.writeHead(200, {'Content-Type': 'image/jpeg'});
    res.end(data);
  });
});

//count questions(We need to show the total count on footer)
router.get('/countAllQuestions', function(req, res) {
	console.log("inside countAllQuestions ");
  mongoose.model('questions').count({}, (function(err, questions) {
		res.format({
			json: function() {
				res.json(questions);
			}
		});
	}))
});

// update question //
router.post('/updateQuestion', function(req, res) {
  console.log("inside updateQuestion ");
  var questionId=req.body.questionId;
  var updatedDate=new Date();
  mongoose.model('questions').findOne({
   questionId:questionId
 }, (function(err, updtResult) {
  if (updtResult!=null) {
      var questionType = ((req.body.questionType!=null && req.body.questionType!=undefined && req.body.questionType!="") ? req.body.questionType : updtResult.questionType);
      var questionText = ((req.body.questionText!=null && req.body.questionText!=undefined && req.body.questionText!="") ? req.body.questionText : updtResult.questionText);
      var categoryName = ((req.body.categoryName!=null && req.body.categoryName!=undefined && req.body.categoryName!="") ? req.body.categoryName : updtResult.categoryName);
      var answers = ((req.body.answers!=null && req.body.answers!=undefined && req.body.answers!="") ? req.body.answers : updtResult.answers);
      var quesImgUrl = ((req.body.quesImgUrl!=null && req.body.quesImgUrl!=undefined && req.body.quesImgUrl!="") ? req.body.quesImgUrl : updtResult.quesImgUrl);
      var comments = ((req.body.comments!=null && req.body.comments!=undefined && req.body.comments!="") ? req.body.comments : updtResult.comments);
      var reply = ((req.body.reply!=null && req.body.reply!=undefined && req.body.reply!="") ? req.body.reply : updtResult.reply);
      var queStatus = ((req.body.queStatus!=null && req.body.queStatus!=undefined && req.body.queStatus!="") ? req.body.queStatus : updtResult.queStatus);
      var newObj = {
      	'questionId' : questionId,
        'questionType': questionType,
        'questionText': questionText,
        'categoryName': categoryName,
        'quesImgUrl':"http://35.154.169.9:4130/questions/getQueImg/"+quesImgUrl,
        'answers' : answers,
        'comments': comments,
        'queStatus': queStatus,
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
          	// addVoteCount(newObj);
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

//// update like in questions collection 
router.post('/Like', function(req, res) {
  console.log("inside Like ");
  var upVote =0;
  var userId=req.body.userId;
  var questionId=req.body.questionId;
  var updatedDate=new Date();
  var msgRes=[];
  mongoose.model('questions').findOne({
   questionId:questionId,
 }, (function(err, updtResult) {
  if (updtResult!=null) {
    upVote = updtResult.upVote; 
    var arrUpvote=[]; 
    arrUpvote=updtResult.upVoted;
    if(arrUpvote.length>0){
      var status=checkValue(userId,arrUpvote);
      if(status){
        arrUpvote.remove(userId);
        var upVote = ((req.body.upVote!=null && req.body.upVote!=undefined && req.body.upVote!="") ? req.body.upVote : updtResult.upVote);
        upVote =upVote-1;
        msgRes =[{  success: true,dislike : true, upVote: upVote}];
      }else{
        arrUpvote.push(userId);
        var upVote = ((req.body.upVote!=null && req.body.upVote!=undefined && req.body.upVote!="") ? req.body.upVote : updtResult.upVote);
        upVote =upVote+1;
        msgRes =[{  success: true,like : true, upVote: upVote}];
      }
    }else{
      arrUpvote.push(userId);
      var upVote = ((req.body.upVote!=null && req.body.upVote!=undefined && req.body.upVote!="") ? req.body.upVote : updtResult.upVote);
      upVote =upVote+1;
      msgRes =[{  success: true,like : true, upVote: upVote}];
    }
    var newObj = {
      'upVote': upVote,
      'upVoted':arrUpvote,
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
            res.json(msgRes);
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

function checkValue(value,arr){
  var status = false;
  for(var i=0; i<arr.length; i++){
    var name = arr[i];
    if(name == value){
      status = true;
      break;
    }
  }
  return status;
}


router.get('/:questionId/getQuesByDetails', function(req, res) {
    mongoose.model('questions').find({
        questionId: req.questionId,
        
    }, function(err, result) {
        if (err) {
            console.log('GET Error: There was a problem retrieving: ' + err);
        } else {
            res.format({
                json: function() {
                    res.json(result);
                }
            });
        }
    });
});

/// ask question by user with userId///
router.post('/askQuestionById', function(req, res) {
  console.log("inside askQuestionById ");
  var queNo=0;
  var userId = req.body.userId;
  var language = req.body.language;
  var groupId = req.body.groupId;
  var questionId = shortid.generate();
  var questionType = req.body.questionType;
  var groupName = req.body.groupName;
  var questionText = req.body.questionText;
  if(questionText!=null){
   questionText=questionText.trim();
 }
 var quesImgUrl=req.body.quesImgUrl;
 var userImage=req.body.userImage;
 var categoryName = req.body.categoryName;
 var postedBy = req.body.postedBy;
 var location =req.body.location;
 var anonymFlage=req.body.anonymFlage;
 var questionLink=req.body.questionLink;
 var updatedDate = new Date();
 var createdDate = new Date();

 if(userImage==null && userImage == "" && userImage==undefined){
     userImage="http://35.154.169.9:4130/users/getUserImg/default.png";
 }

 mongoose.model('questions').findOne({
  userId:userId,
},function(err, result) {
 if (result!=null) {
  queNo = result.queNo;
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
    queNo=queNo+1;
    var userStatusObj = {
      groupId: groupId,
      userId: userId,
      questionId: questionId,
      groupName: groupName,
      postedBy: postedBy,
      language : language,
      userImage : userImage,
      questionType: questionType,
      questionText: questionText,
      categoryName: categoryName,
      queStatus: "Approved",
      status: "Enabled",
      compliance:"Y",
      upVote: 0,
      location:location,
      anonymFlage:anonymFlage,
      questionLink:questionLink,
      createdDate: createdDate,
      updatedDate: updatedDate
    };
    //Insert the user visit 
    addQueCount(userStatusObj);
    // sendNotification(userStatusObj.quesImgUrl,userStatusObj.userId,"Test Baduga");
    res.format({
      json: function() {
        res.format({
          json: function() {
            res.json([{success : true,
              msg: "Question is added successfully"}]);
          }
        });
      }
    });
  }).sort({_id:-1});
});

function addQueCount(statusObject) {
  var userId = statusObject.userId;
  mongoose.model('questions').create(
    statusObject
    , function(err, result) {
     mongoose.model('users').findOne({
      userId:userId
    }, function(err, aResult) {
      var queCount=0;
      if (aResult.queCount!=undefined && aResult.queCount!=null) {
        queCount = aResult.queCount;
      }
      aResult.update({
        queCount:queCount+1 
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

function addVoteCount(statusObject) {
  var questionId = statusObject.questionId;
  mongoose.model('questions').create(
    statusObject
    , function(err, result) {
     mongoose.model('questions').findOne({
      questionId:questionId
    }, function(err, aResult) {
      var upVote=0;
      if (aResult.upVote!=undefined && aResult.upVote!=null) {
        upVote = aResult.upVote;
      }
      aResult.update({
        upVote:upVote+1 
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

function sendNotification(imageUrl,userId,notiType) {
  var FCM = require('fcm-push');
  var registrationIds = [];
  var tokenId="d1XB3_0x0Qo:APA91bFTjH4wE1AivYncvRnnXU7dOgRcKKppqhT_SvdikymB_nY2wDvJ91G1c0fNIvYyRetQgFrLiPzVoM2QNopNGcibCInK5JmKKVLhbe-bRCD9qptsDM_pmaTSqJmYBvRWHxz42NG_";
  var serverKey = 'AIzaSyAL0FwlYyn1zpqzZs7ub8M_UO-ZusuGFX0';
  var fcm = new FCM(serverKey);
  mongoose.model('users').findOne({
    userId:userId
  }, function(err, companyData) {
    if (companyData!=null) {
      if (companyData.notificationFlag) {
        mongoose.model('userstoken').find({
          userId:userId
        }, function(err, msg) {
          if (msg!=null){
            for(var i=0;i<msg.length;i++){
              var fbobj = msg[i];
              tokenId = fbobj.tokenId;
              var message = {
                "data": {
                  "icon":imageUrl,
                  "message": notiType,
                  "AnotherActivity": "True"
                },   
                to: tokenId
              };
              fcm.send(message, function(err, response){
                if (err) {
                  console.log("Something has gone wrong!"+err);
                } else {
                  mongoose.model('notifications').create({
                    userId:userId,
                    message:notiType,
                    imageUrl:imageUrl
                  }, (function(err, result) {
                    if(err){
                      console.log("Something has gone wrong!"+err);
                    }else{
                     console.log("insert notification data in db ");
                   }
                 }))
                  console.log("Successfully sent with response: ", response);
                }
              });
            }
          } else {
            console.log("There was a problem to fetching information from the database.");
          }
        });    
      }else{
        console.log("Notifications Disabled.");
      }
    } else {
      console.log("company not found.");
    }
  });
}

//sendNotification//
// router.post('/sendNotification', function(req, res) {
//  var FCM = require('fcm-push');
//  var msg = req.body.msg;
//  var imageurl = req.body.imageurl;
//  var tokenid = req.body.tokenid;

//   // in future if want to send notification based on usertype remove below comments.
//   // var userType = (req.body.userType==undefined)?"users":req.body.userType;
//   mongoose.model('userstoken').find({
//     tokenid:tokenid
//   }, function(err, userstokenData) {
//     //key generated by hrassist
//     var serverKey = 'AIzaSyAewv8GcBmQbS-ekWsxaRqnpEMeNAenQ2A';
//     var fcm = new FCM(serverKey);

//    if (userstokenData!=null){
//     for(var i=0;i<userstokenData.length;i++){
//         var fbobj = userstokenData[i];
//        var message = {};
//        if (imageurl!=null && imageurl!="" && imageurl!=undefined) {
//         message = {
//           "data": {
//             "icon": imageurl,
//             "message": msg,
//             "AnotherActivity": "True"
//           },   
//           to: fbobj.tokenId
//           //to: tokenId
//         };
//       } else {
//         message = {
//           "data": {
//             "message": msg,
//             "AnotherActivity": "True"
//           },   
//           to: fbobj.tokenId
//         };
//       }

//       fcm.send(message, function(err, response){
//         if (err) {
//           res.format({
//             json: function() {
//               res.json([{success:false,msg:'Something has gone wrong'}]);
//             }
//           })
//         } else {
//           res.format({
//             json: function() {
//               res.json([{success:true,msg:'Successfully sent'}]);
//             }
//           })
//         }
//       });
//     }
//   }else{
//     console.log("There was a problem fetching information from database.");
//   }
// });
// });

//getNotification//
router.get('/:userId/getNotification', function(req, res) {
  console.log("inside getNotification ");
  var userId=req.userId;
     var resArr=[];
     var flage=false;
  mongoose.model('notifications').find({
    userId:userId  
  }, (function(err, Result) {
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
                    res.json(Result);
                  }});
   }
     })).select({"userId":1,"message":1,"imageUrl":1});
}); 

router.post('/addUserTokens', function(req, res) {
  console.log("inside addUserTokens ");
  // in future if want to use usertype.
  // var userType = (req.body.userType==undefined)?"users":req.body.userType;
  var userId = req.body.userId;
  mongoose.model('userstoken').find({
    tokenId:req.body.tokenId
  }, function(err, userstokenData) {
    if (!err) {

      if (userstokenData.length>0) {
        res.format({
          json: function() {
            res.json([{success:true,msg:'Already available'}]);
          }
        });
      } else {
        mongoose.model('userstoken').create({
          tokenId: req.body.tokenId,
          userId:userId,
          createdDate: new Date()
        }, function(err, usrTokenRes) {
          res.format({
            json: function() {
              res.json([{success:true,msg:'Added successfully'}]);
            }
          });
        });
      }
    } else {
      res.format({
        json: function() {
          res.json([{success:false,msg:'Something went wrong'}]);
        }
      });
    }
  });
});

//Optimize api for feeds
router.post('/:language/optGetFeedsById', function(req, res) {
  console.log("inside optGetFeedsById ");
  var Res=res;
  var userId=req.body.userId;
  var language=req.language;
  var userdata=[],followGroupArray=[]; 
  mongoose.model('users').findOne({
    userId:userId
  }, function(err, userResult){

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
      userdata=userResult.following;
      followGroupArray=userResult.followingGroups;
      userdata.push({'userId':userId});
      if (userResult!=null) {
        if(userdata.length>0){
          var userdatas=[];
          for (var i = 0;i < userdata.length;i++) {
            mongoose.model('questions').find({
              userId:userdata[i].userId,
              language:language
            }, function(err,Result){
              userdatas.push(Result)
              if(userdatas.length==userdata.length){
               getFollowingGrp(userdatas,followGroupArray,Res,language);
              }
           }).select({"groupId":1,
           "groupName":1,"questionId":1,
           "postedBy":1,"language":1,"userImage":1,"questionText":1,
           "upVote":1,"location":1,"createdDate":1,"upVoted":1,"answers":1,
           "answerCount":1}).limit(2).sort({ _id:-1});    
          }//end forloop

        }else{
         var msg =[{
          success: false,
          msg: "Something went wrong. Please try again."
        }];
        res.format({
          json: function() {
            res.json(msg);
          }
        });
      }
    }
  }
});
});//end main block

//Optimize api for feeds-
router.post('/:language/getFeedsByIds', function(req, res) {
  console.log("inside getFeedsByIds ");
  var Res=res;
  var userId=req.body.userId;
  var language=req.language;
  var userdata=[],followGroupArray=[]; 
  mongoose.model('users').findOne({
    userId:userId
  }, function(err, userResult){

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
      userdata=userResult.following;
      followGroupArray=userResult.followingGroups;
      // userdata.push(userId);
      if (userResult!=null) {
        if(userdata.length>0){
          var userdatas=[];
          for (var i = 0;i < userdata.length;i++) {
            mongoose.model('questions').find({
              userId:userdata[i],
              status:"Enabled",
              language:language
            }, function(err,Result){
              userdatas.push(Result)
              if(userdatas.length==userdata.length){
               getFollowingGrp(userdatas,followGroupArray,Res,language,userId);
             }
           }).select({"groupId":1,"userId":1,"anonymFlage":1,"ansUserId":1,"ansUserName":1, "ansUserImage":1,
                       "groupName":1,"questionId":1,
                       "postedBy":1,"language":1,"userImage":1,"questionText":1,
                       "upVote":1,"location":1,"createdDate":1,"upVoted":1,"answers":1,
           "answerCount":1}).limit(2).sort({ _id:-1});    
          }//end forloop

        }else{
        getRecentFeeds(language,res,userId); 
        //  var msg =[{
        //   success: false,
        //   msg: "Something went wrong. Please try again."
        // }];
        // res.format({
        //   json: function() {
        //     res.json(msg);
        //   }
        // });
      }
    }
  }
});
});//end main block

function getFollowingGrp(followingUser,followingGrp,res,language,userId){                          
  var localArr=[],finalArray=[]; 
  var resArr=[];
  var flage=false;
  if(followingGrp.length>0){
    for(var i=0;i<followingGrp.length;i++){
      mongoose.model('questions').find({
       groupId:followingGrp[i],
       language:language,
       status:"Enabled"
     }, function(err,Result){
      localArr.push(Result)
      if(localArr.length==followingGrp.length){
                    //Loop get obj from groupArr
                    if(localArr.length>0){
                      for(var j=0;j<localArr.length;j++){
                              var array1=[];
                              array1=localArr[j];
                              if(array1.length>0){
                                for(var k=0;k<array1.length;k++){
                                  finalArray.push(array1[k]);
                                }
                              } 
                            }
                          }
                   //Loop get object from userFollowing Array          
                   if(followingUser.length>0){
                    for(var j=0;j<followingUser.length;j++){
                              var array1=[];
                              array1=followingUser[j];
                              if(array1.length>0){
                                for(var k=0;k<array1.length;k++){
                                  finalArray.push(array1[k]);
                                }
                              } 
                            }
                          }
                              //Final response
                              if(finalArray.length>0){
                                mongoose.model('questions').find({
                                  language:language,
                                  status:"Enabled"
                                }, function(err,Result){

                                 if(Result.length>0){
                                   for(var i=0;i<Result.length;i++){
                                     finalArray.push(Result[i]);         
                                   }
                                          //Condition check the question is liked
                                          for(var k=0;k<finalArray.length;k++){
                                           var upVotedarr=[];
                                           upVotedarr=finalArray[k].upVoted;
                                         if(upVotedarr.contains(userId)){
                                          flage=true;
                                        }else{
                                          flage=false;
                                        }
                                       //Construct obj for like flage
                                       var obj={
                                        groupId:finalArray[k].groupId,
                                        groupName:finalArray[k].groupName,
                                        questionId:finalArray[k].questionId,
                                        userId:finalArray[k].userId,
                                        postedBy:finalArray[k].postedBy,
                                        language:finalArray[k].language,
                                        userImage:finalArray[k].userImage,
                                        questionText:finalArray[k].questionText,
                                        upVote:finalArray[k].upVote,
                                        location:finalArray[k].location,
                                        createdDate:finalArray[k].createdDate,
                                        upVoted:finalArray[k].upVoted,
                                        answers:finalArray[k].answers,
                                        anonymFlage:finalArray[k].anonymFlage,
                                        ansUserId:finalArray[k].ansUserId,
                                        ansUserName:finalArray[k].ansUserName,
                                        ansUserImage:finalArray[k].ansUserImage,
                                        questionLiked:flage,
                                        answerCount:finalArray[k].answerCount
                                      };

                                      resArr.push(obj);
                                    } 

                                    res.format({
                                      json: function() {
                                        res.json(removeDuplicates(resArr));
                                      }}); 

                                  }else{
                                    var msg =[{ success: false, msg: "Something went wrong"}];
                                    res.format({
                                     json: function() {
                                      res.json(msg);
                                    }
                                  });              
                                  }
                                }).select({"groupId":1,"userId":1,"anonymFlage":1,
                                "groupName":1,"questionId":1,"ansUserId":1,"ansUserName":1, "ansUserImage":1,
                                "postedBy":1,"language":1,"userImage":1,"questionText":1,
                                "upVote":1,"location":1,"createdDate":1,"upVoted":1,"answers":1,
                                "answerCount":1}).limit(40).sort({ _id:-1}); 

                              }else{
                               getRecentFeeds(language,res,userId);                    
                             }
                           }

                         }).select({"groupId":1,"userId":1,"anonymFlage":1,
                         "groupName":1,"questionId":1,"ansUserId":1,"ansUserName":1, "ansUserImage":1,
                         "postedBy":1,"language":1,"userImage":1,"questionText":1,
                         "upVote":1,"location":1,"createdDate":1,"upVoted":1,"answers":1,
                         "answerCount":1}).limit(2).sort({ _id:-1});  
                       }
                     }else{
                      getRecentFeeds(language,res,userId);   
          }//end if
        }

//Fuction for getRecent
function getRecentFeeds(language,res,userId){
  var resArr=[];
  var flage=false;
  mongoose.model('questions').find({
   language:language,
   status:"Enabled"
 }, function(err,Result){

  if(Result.length>0){  
    for(var k=0;k<Result.length;k++){
     var upVotedarr=[];
     upVotedarr=Result[k].upVoted;

               if(upVotedarr.contains(userId)){
                flage=true;
              }else{
                flage=false;
              }
             //Construct obj for like flage
             var obj={
              groupId:Result[k].groupId,
              groupName:Result[k].groupName,
              questionId:Result[k].questionId,
              userId:Result[k].userId,
              postedBy:Result[k].postedBy,
              language:Result[k].language,
              userImage:Result[k].userImage,
              questionText:Result[k].questionText,
              upVote:Result[k].upVote,
              location:Result[k].location,
              createdDate:Result[k].createdDate,
              upVoted:Result[k].upVoted,
              answers:Result[k].answers,
              anonymFlage:Result[k].anonymFlage,
              ansUserId:Result[k].ansUserId,
              ansUserName:Result[k].ansUserName,
              ansUserImage:Result[k].ansUserImage,
              questionLiked:flage,
              answerCount:Result[k].answerCount
            };

            resArr.push(obj);
          }    
          res.format({  
            json: function() {
             res.json(resArr);
           }});
        }else{
         var msg =[{ success: false, msg: "Something went wrong"}];

         res.format({
           json: function() {
             res.json(msg);
           }
         });              
       }

     }).select({"groupId":1,"anonymFlage":1,
     "groupName":1,"questionId":1,"userId":1,"ansUserId":1,"ansUserName":1, "ansUserImage":1,
     "postedBy":1,"language":1,"userImage":1,"questionText":1,
     "upVote":1,"location":1,"createdDate":1,"upVoted":1,"answers":1,
     "answerCount":1}).limit(25).sort({ _id:-1}); 
   } 

//Function for check exist
Array.prototype.contains = function(element){
  return this.indexOf(element) > -1;
};

//Optimize getQuestion by groupId
//get question by group
router.post('/:language/optGetQuesByGroupId', function(req, res) {
  console.log("inside question by grp");
  var language = req.language;
  var groupId = req.body.groupId;
  var userId=req.body.userId;
  var resArr=[];
  var flage=false;
  mongoose.model('questions').find({
    groupId: groupId,
    status:"Enabled",
    language:language
  }, (function(err, Result) {

    if(Result.length>0){

       for(var k=0;k<Result.length;k++){
                     var upVotedarr=[];
                     upVotedarr=Result[k].upVoted;
                   // console.log("check userId "+upVotedarr.contains("Hk27RrHdM"));
                   if(upVotedarr.contains(userId)){
                    flage=true;
                   }else{
                    flage=false;
                   }
                 //Construct obj for like flage
                 var obj={
                    groupId:Result[k].groupId,
                    groupName:Result[k].groupName,
                    questionId:Result[k].questionId,
                    userId:Result[k].userId,
                    postedBy:Result[k].postedBy,
                    language:Result[k].language,
                    userImage:Result[k].userImage,
                    questionText:Result[k].questionText,
                    upVote:Result[k].upVote,
                    location:Result[k].location,
                    createdDate:Result[k].createdDate,
                    upVoted:Result[k].upVoted,
                    answers:Result[k].answers,
                    anonymFlage:Result[k].anonymFlage,
                    ansUserId:Result[k].ansUserId,
                    ansUserName:Result[k].ansUserName,
                    ansUserImage:Result[k].ansUserImage,
                    questionLiked:flage,
                    answerCount:Result[k].answerCount
                   };

                   resArr.push(obj);
              } 

                res.format({
                   json: function() { 
                    res.json(resArr);
                  }});
         }else{
           res.format({
                   json: function() { 
                    res.json([]);
                  }});
         }
  }));
});

//optimize recent questions
router.get('/:language/getRelatedQuestions', function(req, res) {
  console.log("inside getQuestions");
  var language=req.language;

  mongoose.model('questions').find({language:language}, (function(err, result) {
    res.format({
      json: function() {
        res.json(result);
      }
    });
  })).select({"groupId":1,"groupName":1,"questionId":1,"userId":1,
                "questionText":1
             }).limit(20).sort({ _id:-1});

});

//Pagination api
router.post('/:language/getFeedByPagination', function(req, res) {
  console.log("inside getFeedsByIds ");
  var Res=res;
  var userId=req.body.userId;
  var isFirstRun=""+req.body.isFirstRun;
  var language=req.language;
  var userdata=[],followGroupArray=[];   
  var pageNo = parseInt(req.query.pageNo)
  var size = parseInt(req.query.size)
  var query = {}
  if(pageNo < 0 || pageNo === 0) {
        response = {"error" : true,"message" : "invalid page number, should start with 1"};
        return res.json(response)
  }
  query.skip = size * (pageNo - 1)
  query.limit = size
  console.log("query size "+JSON.stringify(query));
  // Find some documents
  console.log(isFirstRun);
  if(isFirstRun == "true"){
  mongoose.model('users').findOne({
    userId:userId
  },function(err, userResult){

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
      userdata=userResult.following;
      followGroupArray=userResult.followingGroups;
      userdata.push(userId);
      if (userResult!=null) {
        if(userdata.length>0){
          var userdatas=[];
          for (var i = 0;i < userdata.length;i++) {
            mongoose.model('questions').find({
              userId:userdata[i],
              status:"Enabled",
              language:language
            },function(err,Result){
              userdatas.push(Result)
              if(userdatas.length==userdata.length){
               getFollowingGrpPagination(userdatas,followGroupArray,Res,language,userId,query);
             }
           }).select({"groupId":1,"userId":1,"anonymFlage":1,"ansUserId":1,"ansUserName":1, "ansUserImage":1,
                       "groupName":1,"questionId":1,
                       "postedBy":1,"language":1,"userImage":1,"questionText":1,
                       "upVote":1,"location":1,"createdDate":1,"upVoted":1,"answers":1,
           "answerCount":1}).limit(2).sort({ _id:-1});    
          }//end forloop

        }else{
         var msg =[{
          success: false,
          msg: "Something went wrong. Please try again."
        }];
        res.format({
          json: function() {
            res.json(msg);
          }
        });
      }
    }
  }
});
}else{
    console.log("show second "+isFirstRun);
    getRecentFeedsPagination(language,res,userId,query);  
  }
});//end main block

//Group by pagination
function getFollowingGrpPagination(followingUser,followingGrp,res,language,userId,query){                          
  var localArr=[],finalArray=[]; 
  var resArr=[];
  var flage=false;
  if(followingGrp.length>0){
    for(var i=0;i<followingGrp.length;i++){
      mongoose.model('questions').find({
       groupId:followingGrp[i],
       language:language,
       status:"Enabled"
     },function(err,Result){
      localArr.push(Result)
      if(localArr.length==followingGrp.length){
                    //Loop get obj from groupArr
                    if(localArr.length>0){
                      for(var j=0;j<localArr.length;j++){
                              var array1=[];
                              array1=localArr[j];
                              if(array1.length>0){
                                for(var k=0;k<array1.length;k++){
                                  finalArray.push(array1[k]);
                                }
                              } 
                            }
                          }
                   //Loop get object from userFollowing Array          
                   if(followingUser.length>0){
                    for(var j=0;j<followingUser.length;j++){
                              var array1=[];
                              array1=followingUser[j];
                              if(array1.length>0){
                                for(var k=0;k<array1.length;k++){
                                  finalArray.push(array1[k]);
                                }
                              } 
                            }
                          }
                              //Final response
                              if(finalArray.length>0){
                                mongoose.model('questions').find({
                                  language:language,
                                  status:"Enabled"
                                }, function(err,Result){

                                 if(Result.length>0){
                                   for(var i=0;i<Result.length;i++){
                                     finalArray.push(Result[i]);         
                                   }
                                          //Condition check the question is liked
                                          for(var k=0;k<finalArray.length;k++){
                                           var upVotedarr=[];
                                           upVotedarr=finalArray[k].upVoted;
                                         if(upVotedarr.contains(userId)){
                                          flage=true;
                                        }else{
                                          flage=false;
                                        }
                                       //Construct obj for like flage
                                       var obj={
                                        groupId:finalArray[k].groupId,
                                        groupName:finalArray[k].groupName,
                                        questionId:finalArray[k].questionId,
                                        userId:finalArray[k].userId,
                                        postedBy:finalArray[k].postedBy,
                                        language:finalArray[k].language,
                                        userImage:finalArray[k].userImage,
                                        questionText:finalArray[k].questionText,
                                        upVote:finalArray[k].upVote,
                                        location:finalArray[k].location,
                                        createdDate:finalArray[k].createdDate,
                                        upVoted:finalArray[k].upVoted,
                                        answers:finalArray[k].answers,
                                        anonymFlage:finalArray[k].anonymFlage,
                                        ansUserId:finalArray[k].ansUserId,
                                        ansUserName:finalArray[k].ansUserName,
                                        ansUserImage:finalArray[k].ansUserImage,
                                        questionLiked:flage,
                                        ansDate:finalArray[k].ansDate,
                                        answerCount:finalArray[k].answerCount
                                      };

                                      resArr.push(obj);
                                    } 

                                    res.format({
                                      json: function() {
                                        res.json(removeDuplicates(resArr));
                                      }}); 

                                  }else{
                                    var msg =[{ success: false, msg: "Something went wrong"}];
                                    res.format({
                                     json: function() {
                                      res.json(msg);
                                    }
                                  });              
                                  }
                                }).select({"groupId":1,"userId":1,"anonymFlage":1,"ansDate":1,
                                "groupName":1,"questionId":1,"ansUserId":1,"ansUserName":1, "ansUserImage":1,
                                "postedBy":1,"language":1,"userImage":1,"questionText":1,
                                "upVote":1,"location":1,"createdDate":1,"upVoted":1,"answers":1,
                                "answerCount":1}).limit(25).sort({ _id:-1}); 

                              }else{
                               getRecentFeedsPagination(language,res,userId,query);                    
                             }
                           }

                         }).select({"groupId":1,"userId":1,"anonymFlage":1,
                         "groupName":1,"questionId":1,"ansUserId":1,"ansUserName":1, "ansUserImage":1,"ansDate":1,
                         "postedBy":1,"language":1,"userImage":1,"questionText":1,
                         "upVote":1,"location":1,"createdDate":1,"upVoted":1,"answers":1,
                         "answerCount":1}).limit(1).sort({ _id:-1});  
                       }
                     }else{
                      getRecentFeedsPagination(language,res,userId,query);   
          }//end if
        }
 //Get recent feeds by pagination
 function getRecentFeedsPagination(language,res,userId,query){
  var resArr=[];
  var flage=false;
  console.log("rj query 2 ");
  console.log(query);
  mongoose.model('questions').find({
   language:language,
   status:"Enabled"
 },{},query,function(err,Result){

  if(Result.length>0){  
    for(var k=0;k<Result.length;k++){
     var upVotedarr=[];
     upVotedarr=Result[k].upVoted;

               if(upVotedarr.contains(userId)){
                flage=true;
              }else{
                flage=false;
              }
             //Construct obj for like flage
             var obj={
              groupId:Result[k].groupId,
              groupName:Result[k].groupName,
              questionId:Result[k].questionId,
              userId:Result[k].userId,
              postedBy:Result[k].postedBy,
              language:Result[k].language,
              userImage:Result[k].userImage,
              questionText:Result[k].questionText,
              upVote:Result[k].upVote,
              location:Result[k].location,
              createdDate:Result[k].createdDate,
              upVoted:Result[k].upVoted,
              answers:Result[k].answers,
              anonymFlage:Result[k].anonymFlage,
              ansUserId:Result[k].ansUserId,
              ansUserName:Result[k].ansUserName,
              ansUserImage:Result[k].ansUserImage,
              ansDate:Result[k].ansDate,
              questionLiked:flage,
              answerCount:Result[k].answerCount
            };

            resArr.push(obj);
          }  
          console.log("rj length "+resArr.length);  
          res.format({  
            json: function() {
             res.json(resArr);
           }});
        }else{
         var msg =[];

         res.format({
           json: function() {
             res.json(msg);
           }
         });              
       }

     }).select({"groupId":1,"anonymFlage":1,
     "groupName":1,"questionId":1,"userId":1,"ansUserId":1,"ansUserName":1, "ansUserImage":1,"ansDate":1,
     "postedBy":1,"language":1,"userImage":1,"questionText":1,
     "upVote":1,"location":1,"createdDate":1,"upVoted":1,"answers":1,
     "answerCount":1}).sort({ _id:-1}); 
   }        

//Function for get unique array 
function removeDuplicates(arr){
 // let unique_array = []
 // for(let i = 0;i < arr.length; i++){
 //   if(unique_array.indexOf(arr[i].questionId) == -1){
 //     unique_array.push(arr[i])
 //   }
 // }
 // return unique_array
let flags = [], output = [], l = arr.length, i;
for( i=0; i<l; i++) {
    if( flags[arr[i].questionId]) continue;
    flags[arr[i].questionId] = true;
    output.push(arr[i]);
}

 return output
 
}

module.exports = router;