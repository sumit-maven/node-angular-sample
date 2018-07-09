var express = require('express'),
router = express.Router(),
fs =require("fs");
mongoose = require('mongoose'),
bodyParser = require('body-parser'),
methodOverride = require('method-override');
var shortid = require('shortid');
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

//for the insert image
router.post('/answerImgInsert',multer({
  storage: storage,
  fileFilter: function(req, file, callback) {
    var ext = path.extname(file.originalname)
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') 
    {
      return callback(res.end('Only images are allowed'), null)
    }
    callback(null, true)
  }
}).single('img'), function(req, res) {
  /*img is the name that you define in the html input type="file" name="img" */       
    var filename =req.files.file.name;
    var path = "/home/ec2-user/baduga/uploads/AnswerImage/"+filename;
    var buffer = req.files.file.data; 

    fs.writeFile(path, buffer, 'binary' , function(err) {
      var msg={success:true,msg:"Image uploaded successfully"};
      if (err) {
        msg={success:false,msg:"Image uploaded error "+err};
      }
      res.format({
        json: function() {
          res.json(msg);
        }
      });
    });
});

// Get Answer image from upload folder //
router.get('/getAnsImg/:imageName', function(req, res) {
  var imageName = req.imageName;
  var http = require('http');
  var fs = require('fs');
  var path = '/home/ec2-user/baduga/uploads/AnswerImage/'+imageName;
  fs.readFile(path, function(err, data) {
    res.writeHead(200, {'Content-Type': 'image/jpeg'});
    res.end(data);
  });
});

router.param('id', function(req, res, next, id) {
	req.id = id;
	next();
});

router.param('status', function(req, res, next, status) {
	req.status = status;
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

router.param('language', function(req, res, next, language) {
  req.language = language;
  next();
});

router.param('answerId', function(req, res, next, answerId) {
  req.answerId = answerId;
  next();
});

router.param('userId', function(req, res, next, userId) {
  req.userId = userId;
  next();
});

//For contains method
  Array.prototype.contains = function(element){
                                    return this.indexOf(element) > -1;
                                };

// get question list //
router.get('/getAllAnswer', function(req, res) {
  console.log("Inside getAllAnswer");
	mongoose.model('answers').find({}, (function(err, result) {
		res.format({
			json: function() {
				res.json(result);
			}
		});
	}));
});

//getUserByAns for Website //
router.get('/:language/:userId/getUserByAns', function(req, res) {
  console.log("Inside getUserByAns");
  var userId = req.userId;
  var language = req.language;
  mongoose.model('answers').find({
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

// Update answer //
router.post('/updateAnswer', function(req, res) {
  console.log("Inside updateAnswer API");
    var questionId=req.body.questionId;
    updatedDate=new Date();
    mongoose.model('answers').findOne({
     questionId:questionId
    }, (function(err, updtResult) {
    if (updtResult!=null) {
      var comments = ((req.body.comments!=null && req.body.comments!=undefined && req.body.comments!="") ? req.body.comments : updtResult.comments);
      var upVotes = ((req.body.upVotes!=null && req.body.upVotes!=undefined && req.body.upVotes!="") ? req.body.upVotes : updtResult.upVotes);
      var downVotes = ((req.body.downVotes!=null && req.body.downVotes!=undefined && req.body.downVotes!="") ? req.body.downVotes : updtResult.downVotes);
      var newObj = {
        'comments':comments,
        'upVotes':upVotes,
        'downVotes':downVotes,
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

//Optimize api for answers
router.post('/optGetAnswerByQId', function(req, res) {
  console.log("Inside getAnswerByQId API");
  var questionId = req.body.questionId;
  var userId=req.body.userId;
  var resArr=[];
  var flage=false;
  mongoose.model('answers').find({
    questionId:questionId,
    compliance:"Y"
  }, (function(err, statusResult) {
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
             console.log("rj answer result "+statusResult.length);
             if(statusResult.length>0){

                 for(var k=0;k<statusResult.length;k++){
                         var upVotedarr=[];
                         upVotedarr=statusResult[k].upVoted;
                       // console.log("check userId "+upVotedarr.contains("Hk27RrHdM"));
                       if(upVotedarr.contains(userId)){
                        flage=true;
                       }else{
                        flage=false;
                       }
                     //Construct obj for like flage
                     var obj={
                          questionId:statusResult[k].questionId,
                          userId:statusResult[k].userId,
                          postedBy:statusResult[k].postedBy,
                          language:statusResult[k].language,
                          answeredBy:statusResult[k].answeredBy,
                          answerId:statusResult[k].answerId,
                          answers:statusResult[k].answers,
                          upVote :statusResult[k].upVote, 
                          downVote:statusResult[k].downVote,
                          comments: statusResult[k].comments,
                          userComments:statusResult[k].userComments,
                          userImage:statusResult[k].userImage,
                          createdDate: statusResult[k].createdDate,
                          upVoted:statusResult[k].upVoted,
                          answerLiked:flage,
                          answerImageUrl:statusResult[k].answerImageUrl
                       };

                       resArr.push(obj);
                  } 
            
                  res.format({
                    json: function() {
                      res.json(resArr);
                    }
                  });

        }else{
           res.format({
                    json: function() {
                      res.json([]);
                    }
                  });
        }//end if
    }
  })).sort({_id:-1});
});


//get Answer by question id //
router.post('/getAnswerByQId', function(req, res) {
  console.log("Inside getAnswerByQId API");
  var questionId = req.body.questionId;
  mongoose.model('answers').find({
    questionId: questionId
  }, (function(err, statusResult) {
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
          res.json(statusResult);
        }
      });
    }
  })).sort({_id:-1});
});

//Get Comment by answer id //
router.post('/commentByAnswerId', function(req, res) {
  console.log("Inside commentByAnswerId API");
  var answerId = req.body.answerId;
  mongoose.model('answers').find({
    answerId: answerId
  }, (function(err, statusResult) {
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
          res.json(statusResult);
        }
      });
    }
  })).sort({_id:-1});
});

//Get only 2 Comment by answer id
router.post('/getcommentByAnswerId', function(req, res) {
  console.log("Inside getcommentByAnswerId API");
  var answerId = req.body.answerId;
  mongoose.model('answers').find({
    answerId: answerId
  }, (function(err, statusResult) {
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
          res.json(statusResult);
        }
      });
    }
  })).sort({_id:-1}).limit(2);
});

// get all comment by answerId //
router.get('/:answerId/getcomments', function(req, res) {
  console.log("Inside getcomments API");
  var answerId = req.answerId;
  mongoose.model('answers').findOne({
    answerId: answerId
  }, (function(err, statusResult) {
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
      var localArray=[];
      if(statusResult.userComments.length>0){
        var commentArray=[];
        commentArray=statusResult.userComments;
      
        for(var i=0;i<commentArray.length;i++){
         if(i==0){
          localArray.push(commentArray[i]);
        }

        if(i==1){
          localArray.push(commentArray[i]);
        }
        }
        res.format({
          json: function() {
            res.json(localArray);
          }
        });
      }else{
         var msg =[{
        success: false,
        msg: "No comments found"
         }];
        res.format({
         json: function() {
           res.json(msg);
         }
      });
      }
    }
  })).sort({_id:-1});
});

//get question by group //
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

///thiagu///
router.post('/:language/submitAnswer', function(req, res) {
  console.log("Inside submitAnswer API");
  var ansNo=0;
  var answers;
  var answerId = shortid.generate();
  var userId = req.body.userId;
  var language = req.language;
  var questionId =req.body.questionId;
  var postedBy =req.body.postedBy;
  var userImage =req.body.userImage;
  var answeredBy= req.body.answeredBy
  var comments = req.body.comments;
  var upVote = req.body.upVotes;
  var downVote=req.body.downVotes
  var answers = req.body.answers;
  var updatedDate = new Date();
  var createdDate = new Date();
  var answerImageUrl;
  answerImageUrl=req.body.answerImageUrl;
  mongoose.model('answers').findOne({
    userId:userId,
    questionId:questionId
  },function(err, result) {
    if (result!=null) {
      ansNo = result.ansNo;
    }else {
      mongoose.model('users').findOne({
        userId:userId,
      },function(err, result) {
        if (result!=null) {
          console.log(result);
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
    if(answerImageUrl!="null"){
       answerImageUrl="http://35.154.169.9:4130/answers/getAnsImg/"+answerImageUrl;
    }

    ansNo=ansNo+1;
    var userStatusObj = {
    userId: userId,
    questionId: questionId,
    answerId: answerId,
    postedBy: postedBy,
    answeredBy:answeredBy,
    answers: answers,
    comments:comments,
    language: language,
    userImage: userImage,
    answerImageUrl:answerImageUrl,
    upVote:0,
    downVote: 0,
    compliance:"Y",
    createdDate: createdDate,
    updatedDate: updatedDate,
    };
    addAns(userStatusObj);
    //Insert the user ansCount 
    addAnsCount(userStatusObj);
    res.format({
      json: function() {
        res.json([{success : true}]);
      }
    });
  }).sort({_id:-1});
});

//Web & IOS & Android//////////////

// router.post('/submitAnswers', function(req, res) {
//   console.log("Inside submitAnswers API");
//   var ansNo=0;
//   var answers;
//   var answerId = shortid.generate();
//   var userId = req.body.userId;
//   var language = req.body.language;
//   var questionId =req.body.questionId;
//   var postedBy =req.body.postedBy;
//   var userImage =req.body.userImage;
//   var answeredBy= req.body.answeredBy
//   var comments = req.body.comments;
//   var upVote = req.body.upVotes;
//   var downVote=req.body.downVotes
//   var answers = req.body.answers;
//   if(answers!=null){
//     answers=answers.trim();
//   }
//   var updatedDate = new Date();
//   var createdDate = new Date();
//   var answerImageUrl;
//   answerImageUrl=req.body.answerImageUrl;
//   mongoose.model('answers').findOne({
//     userId:userId,
//     questionId:questionId
//   },function(err, result) {
//     if (result!=null) {
//       ansNo = result.ansNo;
//     }else {
//       mongoose.model('users').findOne({
//         userId:userId,
//       },function(err, result) {
//         if (result!=null) {
//         }else{
//           res.format({
//             json: function() {
//               res.json([{success : false,
//               msg: "Something went wrong"}]);
//             }
//           });
//         }
//       }).sort({
//         _id:-1
//       });
//     } //end of else first visit

//     //Prepare the User visit obj
//     if(answerImageUrl!="null"){
//       answerImageUrl="http://35.154.169.9:4130/answers/getAnsImg/"+answerImageUrl;
//     }
//     ansNo=ansNo+1;
//     var userStatusObj = {
//     userId: userId,
//     questionId: questionId,
//     answerId: answerId,
//     postedBy: postedBy,
//     answeredBy:answeredBy,
//     answers: answers,
//     comments:comments,
//     language: language,
//     userImage: userImage,
//     answerImageUrl:answerImageUrl,
//     upVote:0,
//     downVote: 0,
//     createdDate: createdDate,
//     updatedDate: updatedDate,
//     };
//     //Insert the user ansCount 
//     addAnsCount(userStatusObj);
//     res.format({
//       json: function() {
//         res.json([{success : true}]);
//       }
//     });
//   }).sort({_id:-1});
// });

function addAnsCount(statusObject) {
  var userId = statusObject.userId;
  var questionId=statusObject.questionId;
  mongoose.model('answers').create(
    statusObject
    , function(err, result) {
    //Count store in user     
      mongoose.model('users').findOne({
        userId:userId
      }, function(err, aResult) {
        var ansCount=0;
        if (aResult.ansCount!=undefined && aResult.ansCount!=null) {
          ansCount = aResult.ansCount;
        }
        aResult.update({
          ansCount:ansCount+1 
        },function (err,status) {
          if (!err) {
         }
       })
      }).sort({
        _id:-1
      });

      //Count store in questions collection
      if(questionId!=null){
         mongoose.model('questions').findOne({
         questionId:questionId
        }, function(err, result) {
        
        var count=0;
        var intValue=0;
        if (result.answerCount!=undefined && result.answerCount!=null) {
          count = result.answerCount;
          intValue=parseInt(count);
        }
        intValue ++;
        result.update({
          answerCount:intValue
        },function (error,status) {
          if (error) {
               console.log("error rj");
            }else{
              console.log("Count update successfully");
            }
           })

         }).sort({
        _id:-1
      }); 
      
       }
    }
  )
}

function addAns(statusObject) {
  var questionId = statusObject.questionId;
  var answers = statusObject.answers;
  var ansUserImage=statusObject.userImage;
  var ansUserName= statusObject.postedBy;
  var ansUserId= statusObject.userId;
  var ansDate =new Date();
  mongoose.model('questions').findOne({
    questionId:questionId,
  }, function(err, aResult) {
    aResult.update({
      answers:answers,
      ansUserName:ansUserName,
      ansUserImage:ansUserImage,
      ansUserId:ansUserId,
      ansDate:ansDate
    },function (err,status) {
      if (!err) {
       console.log("error");
     }
   })
  }).sort({
    _id:-1
  });
}

//api for post comments on answer //
router.post('/postCommentOnAns', function(req, res) {
  console.log("Inside postCommentOnAns API");
  var userId=req.body.userId;
  var comment=req.body.comment;
  var username=req.body.username;
  var userImage=req.body.userImage;
  var answerId=req.body.answerId;
  mongoose.model('answers').findOne({
    answerId:answerId,
  },function(err, result) {
    if (result!=null) {
      var userComments=[];
      userComments=result.userComments;
      var newObj = {
       'userId': userId,
       'comment':comment,
       'username':username,
       'userImage':userImage,
       'updatedDate':new Date()
      } 
      if(userComments.length>0){
         userComments.unshift(newObj);
       }else{
        userComments.push(newObj);                                  
      }
      
      var obj={'userComments':userComments}
      result.update(obj,(function(err, updateResult) {
       if(err){
         var msg =[{
          success: false,
          msg: "Something went wrong. Please try again." }];
          res.format({
            json: function() {
              res.json(msg);
            }
          });

        }else{        
          console.log(updateResult);  
          res.format({
           json: function() {
            res.json([{success : true,
             msg: "Comment inserted successfully"}]);
          }
        });
        }
      }));
    }else{
      res.format({
        json: function() {
          res.json([{success : false,
          msg: "Something went wrong"}]);
        }
      });
    }
  });
});


//// update like in answer collection 
router.post('/Like', function(req, res) {
  console.log("Inside Like API");
  var upVote =0;
  var userId=req.body.userId;
  var answerId=req.body.answerId;
  var msgRes=[];
  var updatedDate=new Date();
  mongoose.model('answers').findOne({
   answerId:answerId,
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

//Check the exist value in the array
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
//end check value

module.exports = router;