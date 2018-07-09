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
router.param('categoryId', function(req, res, next, categoryId) {
  req.categoryId = categoryId;
  next();
});
router.param('categoryName', function(req, res, next, categoryName) {
  req.categoryName = categoryName;
  next();
});
router.param('titalName', function(req, res, next, titalName) {
  req.titalName = titalName;
  next();
});
router.param('id', function(req, res, next, id) {
	req.id = id;
	next();
});
router.param('groupId', function(req, res, next, groupId) {
  req.groupId = groupId;
  next();
});

router.param('language', function(req, res, next, language) {
  req.language = language;
  next();
});

router.param('status', function(req, res, next, status) {
	req.status = status;
	next();
});

router.param('userId', function(req, res, next, userId) {
	req.userId = userId;
	next();
});

router.param('mobileNo', function(req, res, next, mobileNo) {
	req.mobileNo = mobileNo;
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

router.param('questionId', function(req, res, next, questionId) {
  req.questionId = questionId;
  next();
});
router.param('answerId', function(req, res, next, answerId) {
  req.answerId = answerId;
  next();
});
router.param('userName', function(req, res, next, userName) {
	req.userName = userName;
	next();
});

router.param('imageName', function(req, res, next, imageName) {
	req.imageName = imageName;
	next();
});


//Following All APIs is deprecated from 26 march 2018//

//Sign In for new user//
router.post('/signIn', function(req, res) {
	console.log("new Login API");
	// var userId = req.body.userId;
	// var mobileNo = ""+req.body.mobileNo;
	var email = ""+req.body.email;
	var password = req.body.password;
	// console.log("userId  & mob "+userId+" "+mobileNo);
	mongoose.model('users').findOne({
		email:email,
		password:password
		
	}, (function(err, usrResult) {
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
			if (usrResult!=null) {
				var datailObj = new Object();
				datailObj={ 
					userId: usrResult.userId,
          userName: usrResult.userName,
          userType: usrResult.userType,
          userStatus: usrResult.userStatus,
          language: usrResult.language,
          email: usrResult.email,
          userImage:usrResult.userImage,
          emailVerified:usrResult.emailVerified,
          password: usrResult.password

        };

        usrResult.update(datailObj, function(err, result) {
         datailObj.success = true;
         var dataObj=[datailObj];
         if (err) {
          var msg =[{
           success: false,
           msg: "It seems you are using different device for login."
         }];
         res.format({
           json: function() {
            res.json(msg);
          }
        });
       } else {
        res.format({
         json: function(){
          res.json(dataObj);
        }
      });
      }
    });
      }else{
        var msg =[{
         success: false,
         msg: "Email and Password did not match."
       }];
       res.format({
         json: function(){
          res.json(msg);
        }
      });
     }
   }
 }));  
});
//get question by idget
// router.get('/:id/getQuestionsById', function(req, res) {
//   console.log("inside question by Id");
//   var id = req.id;
//   console.log("get Id " + id);
//   mongoose.model('questions').findOne({
//     questionId: id
//   }, (function(err, questions) {
//     res.format({
//       json: function() {
//         res.json(questions);
//       }
//     });
//   }));
// });


router.get('/:answerId/commentByAnswerId', function(req, res) {
  var answerId = req.answerId;
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
     // console.log("rj comments "+statusResult);
      res.format({
        json: function() {
          res.json(statusResult);
        }
      });
    }
  })).sort({_id:-1});
});
//
router.get('/:questionId/getAnswerByQId', function(req, res) {
  var questionId = req.questionId;
  mongoose.model('answers').find({
    questionId: questionId
    //language: language
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
  })).sort({_id:-1}).limit(3);
});

//getQuesByGroup for Website
// router.get('/:language/:groupId/getGroupByQues', function(req, res) {
//   console.log("inside getGroupByQues by Id");
//   var groupId = req.groupId;
//   console.log("groupId"+groupId);
//   var language = req.language;
//   console.log("inside getGroupByQues by Id"+language);
//  mongoose.model('questions').find({
//   groupId: groupId,
//   language: language
//   }, (function(err, result) {
//     res.format({
//       json: function() {
//         res.json(result);
//       }
//     });
//   }));
// });
//
// router.get('/:language/:userId/getAllFeeds', function(req, res) {
//   var language=req.language;
//   var userId = req.userId;
//   mongoose.model('questions').find({
//     language:language,
//     userId: userId
//   }, (function(err, result) {
//     res.format({
//       json: function() {
//         res.json(result);
//       }
//     });
//   })).sort({
//         _id:-1
//       });
// });
//Get Grops by userId //
// router.get('/:language/getFeedsById', function(req, res) {
//   var userId=req.body.userId;
//   var language=req.language;
//   mongoose.model('users').findOne({
//     userId:userId
//   }, function(err, userResult){
    
//     if (err) {
//       var msg =[{
//         success: false,
//         msg: "Something went wrong. Please try again."
//       }];
//       res.format({
//         json: function() {
//           res.json(msg);
//         }
//       });
//     } else {
//             var userdata=[]; 
//       userdata=userResult.following;
//       userdata.push({'userId':userId});
//       console.log("userdata 1 "+userdata);
//       console.log(userdata[0].userId);
//       if (userResult!=null) {
//         console.log("result length "+userdata.length);
//         if(userdata.length>0){
//         var groupdatas=[];
//         for (var i = 0;i < userdata.length;i++) {
//           console.log(userdata[i].userId);
//           mongoose.model('questions').find({
//                     userId:userdata[i].userId,
//                     language:language
//           }, function(err,Result){
        
//                   // for(var j=0;j<Result.length;j++){
//                   //    var obj=Result[j];
//                   //    console.log("rj Obj"obj);
//                   // }

//                   groupdatas.push(Result)
//                         if(groupdatas.length==userdata.length){
//                             res.format({
//                            json: function() {
//                             res.json(groupdatas.sort());
//                           }
//           });
//            }

//       }).limit(2).sort({
//            _id:-1
//           });    
//           }//end forloop
//        }else{
//        var msg =[{
//         success: false,
//         msg: "Something went wrong. Please try again."
//       }];
//       res.format({
//         json: function() {
//           res.json(msg);
//         }
//       });
//        }
//       }
//     }
//  });
// });//end main block

router.get('/:groupId/getChat', function(req, res) {
  var groupId = req.groupId;
  mongoose.model('chat').find({
  groupId: groupId
  }, (function(err, result) {
    res.format({
      json: function() {
        res.json(result.sort());
      }
    });
  })).sort({_id:-1}).limit(10);
});


// router.get('/:questionId/getQuestionsByDetails', function(req, res) {
//     mongoose.model('questions').find({
//         questionId: req.questionId,
        
//     }, function(err, result) {
//         if (err) {
//             console.log('GET Error: There was a problem retrieving: ' + err);
//         } else {
//             res.format({
//                 json: function() {
//                     res.json(result);
//                 }
//             });
//         }
//     });
// });


// Get all users//
// router.get('/:language/geAllUsers', function(req, res) {
//   var language = req.language;
//   mongoose.model('users').find({
//     language: language
//   }, function(err, result) {
//     res.format({
//       json: function() {
//         res.json(result);
//       }
//     });
//   });
// });


//getUserByQues for Website
router.get('/:language/:userId/getUserByQues', function(req, res) {
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
//getUserByAns for Website
router.get('/:language/:userId/getUserByAns', function(req, res) {
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
//
router.post('/signUp', function(req, res) {
  var userId = shortid.generate();
  var email=req.body.email;
  var userName=req.body.userName;
  var password=req.body.password;
  var language=req.body.language;
  createdDate=new Date();

  mongoose.model('users').findOne({
    email: email,
  }, function(err, result) {
    if (result!=null) {
      res.format({
        json: function() {
          res.json([{
            success: false,
            msg: "This email Id is already exist."
          }]);
        }
      });
    }else{
      mongoose.model('users').create({
       'userId' : userId,
       'userName':userName,
       'email':email,
       'userType' :"Premium",
       'userStatus' :"Enabled",
       'emailVerified':false,
       'notificationFlag':true,
       'userImage' : "http://35.154.169.9:4130/users/getUserImg/default.png",
       'language': language,
       'password':password,
       'createdDate':createdDate
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
              msg: "Data Inserted successfully.",
              userType:result.userType,
              userName:result.userName,
              emailVerified:result.emailVerified,
              email:result.email,
              userId:result.userId
            }]);
          }
        });
      }
    })
    }
  })
});


router.post('/sendFeedback', function(req, res) {
  var userId = req.body.userId;
  var feedback=req.body.feedback;
  createdDate=new Date();
  mongoose.model('feedback').create({
    userId:userId,
    feedback:feedback
  }, (function(err, result) {
    if(err){
      console.log("Something has gone wrong!"+err);
    }else{
     res.format({
      json: function() {
        res.json([{
          success: true,
          msg: "Thank you for your feedback"
        }]);
      }
    });
   }
 }))
});

//send verificaiton code for forgot password
router.post('/verifyEmail', function(req, res) {
  console.log("reset Password API");
  var email=req.body.email;
  function makeid() {
    var text = "";
    var possible = "0123456789";
    for (var i = 0; i < 6; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }
  var newPass=makeid();
  mongoose.model('users').findOne({
    email:email
  }, (function(err, adminResult) {
    console.log("response "+adminResult);
    var userdata=[adminResult];
    var userId = adminResult.userId;
    console.log(userId);

    if (adminResult!=null) {
      adminResult.update({
        OTP:newPass,
      }, (function(err, adminResult) {
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
          forgotPass(email, newPass);
          var msg =[{
            success: true,
            emailsend: true,
            msg:"Email send successfully",
            userId: userId
          }];
          res.format({
            json: function() {
              res.json(msg);
            }
          });
        }
      }));
    }else{
      var msg ={
        success: false,
        msg: "There is no data found"
      };
      res.format({
        json: function() {
          res.json(msg);
        }
      });
    }
  }));
});


//for the users email verify
router.post('/verifyUserEmail', function(req, res) {
  console.log("verify userEmail");
  var email=req.body.email;
  function makeid() {
    var text = "";
    var possible = "0123456789";
    for (var i = 0; i < 6; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }
  var newPass=makeid();
  mongoose.model('users').findOne({
    email:email
  }, (function(err, adminResult) {
    console.log("response "+adminResult);
    var userdata=[adminResult];
    var userId = adminResult.userId;
    console.log(userId);

    if (adminResult!=null) {
      adminResult.update({
        OTP:newPass,
      }, (function(err, adminResult) {
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
          sendUserVerificationCode(email, newPass);
          var msg =[{
            success: true,
            emailsend: true,
            msg:"Email send successfully",
            userId: userId
          }];
          res.format({
            json: function() {
              res.json(msg);
            }
          });
        }
      }));
    }else{
      var msg ={
        success: false,
        msg: "There is no data found"
      };
      res.format({
        json: function() {
          res.json(msg);
        }
      });
    }
  }));
});

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'dev.blucursor@gmail.com',
    pass: '231c0nf!d3nt'
  }
});

function forgotPass(email,newPass){
  var mailOptions = {
    from:'Baduga <dev.blucursor@gmail.com>',
    to: email,
    subject: 'Reset Password- Baduga Admin',
    text: 'Your OTP code '+ newPass
  };
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    //  res.end('There is a problem in sending email, please try again later!')
  } else {
    //  res.end('Check your inbox for a password reset message.')
    console.log('Email sent: ' + info.response);
  }
});
}

//funciton for user email verification
function sendUserVerificationCode(email,newPass){
  var mailOptions = {
    from:'Baduga <dev.blucursor@gmail.com>',
    to: email,
    subject: 'Reset Password- Baduga Admin',
    text: 'This is your email verification code '+ newPass
  };
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    //  res.end('There is a problem in sending email, please try again later!')
  } else {
    //  res.end('Check your inbox for a password reset message.')
    console.log('Email sent: ' + info.response);
  }
});
}


//Get user by userId for baduga website//
// router.get('/:userId/getUserById', function(req, res) {
//   var userId= req.userId;
//   mongoose.model('users').findOne({
//    userId:userId
//  }, (function(err, groupResult) {
//   res.format({
//     json: function(){
//      res.json([groupResult]);
//    }
//  });
// }));
// });

//QuesbyAnsCont//
// router.get('/:questionId/getQusNoOfans', function(req, res) {
// var questionId= req.questionId;
//   mongoose.model('answers').find({
//     questionId:questionId
//   }, (function(err, result) {
//     var count = result.length;
//     console.log(count);
//     res.format({
//       json: function() {
//         res.json(count);
//       }
//     });
//   }));
// });
//Total user questions
// router.get('/:userId/:language/getUserTotalQues', function(req, res) {
// var userId= req.userId;
// var language = req.language;
//   mongoose.model('questions').find({
//     userId:userId,
//     language :language
//   }, (function(err, result) {
//     var count = result.length;
//     console.log(count);
//     res.format({
//       json: function() {
//         res.json(count);
//       }
//     });
//   }));
// });


//Total user Answers
// router.get('/:userId/:language/getUserTotalAns', function(req, res) {
// var userId= req.userId;
// var language = req.language;
//   mongoose.model('answers').find({
//     userId:userId,
//    language :language
//   }, (function(err, result) {
//     var count = result.length;
//     console.log(count);
//     res.format({
//       json: function() {
//         res.json(count);
//       }
//     });
//   }));
// });
// //


////////////
// router.post('/updateAdmin', function(req, res) {
//   var adName=req.body.adName;
//   var username=req.body.username;
//   var password=req.body.password;
//   var accountId=req.body.accountId;
//   updatedDate=new Date();
//   mongoose.model('admin').findOne({
//     accountId:accountId
//   }, (function(err, updtResult) {
//     if (updtResult!=null) {
//       if (adName=="") {
//         adName=updtResult.adName;
//       }else if(password==""){
//         password=updtResult.password;
//       };
//       var newObj = {
//         'adName':adName,
//         'password':password,
//         'updatedDate':updatedDate
//       }
//       updtResult.update(newObj,(function(err, updatedInfo) {
//         if (err) {
//           var msg =[{
//             success: false,
//             msg: "Something went wrong. Please try again."
//           }];
//           res.format({
//             json: function() {
//               res.json(msg);
//             }
//           });
//         } else {
//           res.format({
//             json: function() {
//               res.json(updatedInfo);
//             }
//           });
//         }
//       }));
//     }else{
//       var msg =[{
//         success: false,
//         msg: "Unable to find data with this username."
//       }];
//       res.format({
//         json: function() {
//           res.json(msg);
//         }
//       });
//     }
//   }));
// });

router.get('/:id/removetoken', function(req, res) {
  var tokenid = req.id;
  mongoose.model('usertokens').remove({
    tokenid:tokenid
  },function (err,userObj) {
    if (userObj!=null) {
      res.format({
        json: function() {
          res.json([{
            success: true,
            msg: "Deleted."
          }]);
        }
      });
    } else {
      res.format({
        json: function() {
          res.json([{
            success: true,
            msg: "Deleted."
          }]);
        }
      });
    }
  });
});


router.post('/validateOTP', function(req, res) {
  var otp = req.body.OTP;
  var empId = req.body.EmpId;
  mongoose.model('employee').findOne({
    EmpId:empId,
    OTP:otp
  }, (function(err, empOTP) {
    if (err) {
      var msg =[{
        success: false,
        msg: "OTP authentication failed."
      }];
      res.format({
        json: function() {
          res.json(msg);
        }
      });
    } else {
      var OTPresobj = new Object();
      OTPresobj.success = true;
      OTPresobj.em
      res.format({
        json: function() {
          res.json([{success : true}]);
        }
      });
    }
  }));
});


// router.post('/getTermsData', function(req, res) {
//   mongoose.model('termsConditions').find({
//   }, (function(err, termsResult) {
//     var terms=[termsResult];
//     if (err) {
//       var msg =[{
//         success: false,
//         msg: "Something went wrong. Please try again."
//       }];
//       res.format({
//         json: function() {
//           res.json(msg);
//         }
//       });
//     } else {
//       res.format({
//         json: function() {
//           res.json(termsResult);
//         }
//       });
//     }
//   }));
// });

// router.get('/getPrivacyData', function(req, res) {
//   mongoose.model('privacyPolicies').find({
//   }, (function(err, privacyResult) {
//     var privacy=[privacyResult];
//     if (err) {
//      var msg =[{
//       success: false,
//       msg: "Something went wrong. Please try again."
//     }];
//     res.format({
//       json: function() {
//         res.json(msg);
//       }
//     });
//   } else {
//     res.format({
//       json: function() {
//         res.json(privacyResult);
//       }
//     });
//   }
// }));
// });



router.post('/addUserTokens', function(req, res) {
  var userId = req.body.userId;
  var tokenId = req.body.tokenId;
  mongoose.model('userstoken').findOne({
    userId:req.body.userId
  }, function(err, tokenData) {
    if (!err) {

      if (tokenData!=null) {
          console.log("rj tokenid add "+tokenData);
          var obj={'tokenId':tokenId}
          tokenData.update(obj,(function(err, updateResult) {
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
                           res.format({
                           json: function() {
                           res.json([{success:true,msg:'update successfully'}]);
                              }
                         });
                   }
           
              }));

      } else {
        mongoose.model('userstoken').create({
          tokenId: tokenId,
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

//Follow people  
router.post('/followPeople', function(req, res) {
    var userId=req.body.userId;
    var followUserId=req.body.followUserId;
    var index;
    var message;
    var sendNoti=false;
    console.log("rj userId "+userId+" follow userId "+followUserId);
    mongoose.model('users').findOne({
        userId:userId,
    // language:language
    }, (function(err, userResult) {
        // console.log("rj result  1 "+userResult);
        if(userResult!=null){
          var following=[];
              following=userResult.following;
           
             if(following.length>0){
          
               var newObj = {'userId': followUserId,'updatedDate':new Date()}
                  
              //check for exist value
             function checkValue(value,arr){
               var status = false;            
              for(var i=0; i<arr.length; i++){
                 var name = arr[i];
               if(name.userId == value.userId){
                  status = true;
                  index=i;
                  break;
                    }
                 }
                return status;
              }

              console.log('status : ' + checkValue(newObj, following) );
              if(checkValue(newObj, following)){
            
              // message="unFollow you";
              following.splice(index,1);
              console.log(following);

              }else{ 
               message=" is now following you";
              following.push(newObj);
              sendNoti=true;                
              
              }
            }else{
                 var newObj = {
                   'userId': followUserId,
                   'updatedDate':new Date()}
                 message=" is now following you";
                 following.push(newObj);
                 sendNoti=true;
             }
        }//end block result 

          var obj={'following':following}
           userResult.update(obj,(function(err, updateResult) {
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
                       if(sendNoti){
                       var imageurl=userResult.userImage;
                       sendNotification(imageurl,followUserId,userResult.userName+" "+message);
                       }
                   }
           
              }));
    }));

//for the follwers
  mongoose.model('users').findOne({
        userId:followUserId,
    // language:language
    }, (function(err, userResult) {
        console.log("rj result  3 "+userResult);
        if(userResult!=null){
          var follwers=[];
              follwers=userResult.followers;
           console.log("rj result  4 "+follwers.length);
             if(follwers.length>0){
             var newObj = {'userId': userId,'updatedDate':new Date()}
               
               function checkValue(value,arr){
               var status = false;
          
              for(var i=0; i<arr.length; i++){
                 var name = arr[i];
               if(name.userId == value.userId){
                  status = true;
                  index=i;
                  break;
                    }
                 }
                return status;
              }
            console.log('status : ' + checkValue(newObj, follwers) );
              if(checkValue(newObj, follwers)){
              console.log("rj in remove 1 "+index);
              follwers.splice(index,1);
              console.log(follwers);

              }else{ 
              console.log("rj in remove 2 ");
              follwers.push(newObj);                
              
              }
              }else{
                 var newObj = {
                   'userId': userId,
                   'updatedDate':new Date()}
                    follwers.push(newObj);
              }
        }//end block result 

          var obj={'followers':follwers}
           userResult.update(obj,(function(err, updateResult) {
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
                      console.log("rj result 5"+follwers);          
                      console.log(updateResult);  
                       res.format({
                     json: function() {
                      res.json([{success : true,
                         msg: "Data inserted successfully"}]);
                             }
                      });
                   }
              }));
    }));

});

//Follow Group 
router.post('/followGroup', function(req, res) {
    var userId=req.body.userId;
    var groupId=req.body.groupId;
    var index;
    console.log("rj userId "+userId+" follow groupId "+groupId);
    mongoose.model('users').findOne({
        userId:userId,
    // language:language
    }, (function(err, userResult) {
        // console.log("rj result  1 "+userResult);
        if(userResult!=null){
          var followingGroups=[];
              followingGroups=userResult.followingGroups;
           
             if(followingGroups.length>0){
          
               var newObj = {'groupId': groupId,'updatedDate':new Date()}
                  
              //check for exist value
             function checkValue(value,arr){
               var status = false;            
              for(var i=0; i<arr.length; i++){
                 var name = arr[i];
               if(name.groupId == value.groupId){
                  status = true;
                  index=i;
                  break;
                    }
                 }
                return status;
              }

              console.log('status : ' + checkValue(newObj, followingGroups) );
              if(checkValue(newObj, followingGroups)){

              followingGroups.splice(index,1);
              console.log(followingGroups);

              }else{ 
              
              followingGroups.push(newObj);                
              
              }
            }else{
                 var newObj = {
                   'groupId': groupId,
                   'updatedDate':new Date()}
                 followingGroups.push(newObj);
             }
        
        }//end block result 

          var obj={'followingGroups':followingGroups}
           userResult.update(obj,(function(err, updateResult) {
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
                       var imageurl=userResult.userImage;
                       // sendNotification(imageurl,followUserId,userResult.userName+" follow you");
                   }
           
              }));
    }));

    //for the group followers
  mongoose.model('group').findOne({
        groupId:groupId,
    // language:language
    }, (function(err, userResult) {
        console.log("rj result  3 "+userResult);
        if(userResult!=null){
          var groupFollower=[];
              groupFollower=userResult.groupFollower;
           console.log("rj result  4 "+groupFollower.length);
             if(groupFollower.length>0){
             var newObj = {'userId': userId,'updatedDate':new Date()}
               
               function checkValue(value,arr){
               var status = false;
          
              for(var i=0; i<arr.length; i++){
                 var name = arr[i];
               if(name.userId == value.userId){
                  status = true;
                  index=i;
                  break;
                    }
                 }
                return status;
              }
            console.log('status : ' + checkValue(newObj, groupFollower) );
              if(checkValue(newObj, groupFollower)){
              console.log("rj in remove 1 "+index);
              groupFollower.splice(index,1);
          
              }else{ 
              console.log("rj in remove 2 ");
              groupFollower.push(newObj);                
              
              }
              }else{
                 var newObj = {
                   'userId': userId,
                   'updatedDate':new Date()}
                    groupFollower.push(newObj);
              }
        }//end block result 

          var obj={'groupFollower':groupFollower}
           userResult.update(obj,(function(err, updateResult) {
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
                      console.log("rj result 5"+groupFollower);          
                      // console.log(updateResult);  
                       res.format({
                     json: function() {
                      res.json([{success : true,
                         msg: "Data inserted successfully"}]);
                             }
                      });
                   }
              }));
    }));
});

router.post('/getFollowingGroupById', function(req, res) {
  var userId=req.body.userId;
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
      userdata=userResult.followingGroups;
      // userdata.push({'userId':userId});
      console.log("userdata 1 "+userdata);
      // console.log(userdata[0].userId);
      if (userResult!=null) {
        console.log("result length "+userdata.length);
        if(userdata.length>0){
        var groupdatas=[];
        for (var i = 0;i < userdata.length;i++) {
          console.log(userdata[i]);
          mongoose.model('group').findOne({
                    groupId:userdata[i]
          }, function(err,Result){

                  groupdatas.push(Result)
                        if(groupdatas.length==userdata.length){
                            res.format({
                           json: function() {
                            res.json(groupdatas.sort());
                          }
                   });
                 }   
         }).sort({_id:-1});}//end forloop
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

//Get following group api
router.post('/getFollowingGroupByIds', function(req, res) {
  var userId=req.body.userId;
  var language=req.body.language;
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
      userdata=userResult.followingGroups;
      // userdata.push({'userId':userId});
      console.log("userdata 1 "+userdata);
      console.log(userdata[0].userId);
      if (userResult!=null) {
        console.log("result length "+userdata.length);
        if(userdata.length>0){
        var groupdatas=[];
        for (var i = 0;i < userdata.length;i++) {
          console.log(userdata[i].userId);
          mongoose.model('group').findOne({
                    groupId:userdata[i].groupId,
                    language:language
          }, function(err,Result){

                        groupdatas.push(Result)
                        if(groupdatas.length==userdata.length){
                            var localArr=[];
                            for(var j=0;j<groupdatas.length;j++){
                               if(groupdatas[j]!=null){
                                  localArr.push(groupdatas[j])
                               }
                            }
                            res.format({
                           json: function() {
                            res.json(localArr.sort());
                          }
                   });
                 }   
         }).sort({_id:-1});}//end forloop
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


//for notification
function sendNotification(imageUrl,userId,notiType) {
  console.log(" rj function 1 "+userId+" imageurl "+imageUrl);
  var FCM = require('fcm-push');
  var registrationIds = [];
  var tokenId="";
  // var serverKey = 'AIzaSyAL0FwlYyn1zpqzZs7ub8M_UO-ZusuGFX0';
  var serverKey = 'AIzaSyCH6bgCiYGSTI2C_6Twmw01VTfRxDskZhI';
  var fcm = new FCM(serverKey);
  mongoose.model('users').findOne({
    userId:userId
  }, function(err, companyData) {
    if (companyData!=null) {
      console.log(" rj function 2 "+companyData);
      console.log(" rj function 3 "+companyData.notificationFlag);
      if (companyData.notificationFlag) {
        mongoose.model('userstoken').find({
          userId:userId
        }, function(err, msg) {
          if (msg!=null){
            for(var i=0;i<msg.length;i++){
              var fbobj = msg[i];
              tokenId = fbobj.tokenId;
              console.log("tokenid "+tokenId);
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
                  // console.log("Successfully sent with response: ", response);

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
      console.log("user not found.");
    }
  });
}

// router.get('/getInstruction', function(req, res) {
//   mongoose.model('instruction').find({
//   }, function(err, result) {
//     res.format({
//       json: function() {
//        res.json(result);
//      }
//    });
//   });
// });

//text change API
router.get('/:language/getLanguage', function(req, res) {
  console.log("HELLO inside getLanguage");
  var language=req.language;
  console.log("inside console"+language);
  mongoose.model('language').findOne({
    language:language
  }, (function(err, result) {
    res.format({
      json: function() {
        res.json([result]);
      }
    });
  }));
});


router.get('/:language/getTermData', function(req, res) {
  var language=req.language;
  mongoose.model('terms').find({
    language:language
  }, (function(err, result) {
    res.format({
      json: function() {
        res.json(result);
      }
    });
  }));
});

// router.get('/getTermsData', function(req, res) {
//   mongoose.model('terms').find({
//   }, (function(err, termsResult) {
//     var terms=[termsResult];
//     if (err) {
//       var msg =[{
//         success: false,
//         msg: "Something went wrong. Please try again."
//       }];
//       res.format({
//         json: function() {
//           res.json(msg);
//         }
//       });
//     } else {
//       res.format({
//         json: function() {
//           res.json(termsResult);
//         }
//       });
//     }
//   })).sort({_id:-1});
// });


router.post('/:language/submitPrivacyPolicy', function(req, res) {
  var userId = req.body.userId;
  var language=req.language;
  var policy1=req.body.policy1;
  var policy2=req.body.policy2;
  var policy3=req.body.policy3;
  var policy4=req.body.policy4;
  var policy5=req.body.policy5;
  var policy6=req.body.policy6;
  var policy7=req.body.policy7;
  var policy8=req.body.policy8;
  var policy9=req.body.policy9;
  var createdDate=new Date();
  mongoose.model('privacy').findOne({
    userId:userId
  }, (function(err, result) {
    console.log("result "+result);
    // console.log("result "+result.length);
    if(result!=null){
        result.update({
          userId:userId,
          language:language,
          policy1:policy1,
          policy2:policy2,
          policy3:policy3,
          policy4:policy4,
          policy5:policy5,
          policy6:policy6,
          policy7:policy7,
          policy8:policy8,
          policy9:policy9,
          createdDate:createdDate
        },(function(err, result) {
            if(err){
              console.log("Something has gone wrong!"+err);
            }else{
              res.format({
                json: function() {
                  res.json([{
                    success: true,
                    msg: "Privacy policy updated successfully"
                  }]);
                }
              });
              }
          }));
        }else{
          mongoose.model('privacy').create({
            userId:userId,
            language:language,
            policy1:policy1,
            policy2:policy2,
            policy3:policy3,
            policy4:policy4,
            policy5:policy5,
            policy6:policy6,
            policy7:policy7,
            policy8:policy8,
            policy9:policy9,
            createdDate:createdDate
          },(function(err, result) {
            if(err){
              console.log("Something has gone wrong!"+err);
            }else{
              res.format({
                json: function() {
                  res.json([{
                    success: true,
                    msg: "Privacy policy submitted successfully"
                  }]);
                }
              });
            }
          }));
        }
    }));
});

router.post('/:userId/getPrivacyData', function(req, res) {
  var userId=req.userId;
  mongoose.model('privacy').find({
    userId:userId
  }, (function(err, result) {
    res.format({
      json: function() {
        res.json(result);
      }
    });
  }));
});

// router.get('/getPrivacyData', function(req, res) {
// 	mongoose.model('privacyPolicies').find({
//   }, (function(err, privacyResult) {
// 		var privacy=[privacyResult];
// 		if (err) {
// 			var msg =[{
// 				success: false,
// 				msg: "Something went wrong. Please try again."
// 			}];
// 			res.format({
// 				json: function() {
// 					res.json(msg);
// 				}
// 			});
// 		} else {
// 			res.format({
// 				json: function() {
// 					res.json(privacyResult);
// 				}
// 			});
// 		}
// 	}));
// });


// function sendOTP (mobileNo,otp) {
// 	var request = require('request');
// 	var uname="20170715";
// 	var pass="^RDj726";
// 	var addValuri="Your OTP for SignIn into Baduga App is "+otp;
// 	var encoded = encodeURI(addValuri);
// 	var cmpltUri="http://103.247.98.91/API/SendMsg.aspx?uname="+uname+"&pass="+pass+"&send=BLCRSR&dest="+mobileNo+"&msg="+encoded
// 	request(cmpltUri, function (error, response, body) {
// 		if (!error && response.statusCode == 200) {
// 			console.log(body) 
// 		}
// 	})
// }

//for 
router.post('/submitReport', function(req, res) {
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

// //Api for get following and follower users
router.get('/:userId/getFollowingUser', function(req, res) {
  var userId=req.userId;
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
      // userdata.push({'userId':userId});
      console.log("userdata 1 "+userdata);
      console.log(userdata[0].userId);
      if (userResult!=null) {
        console.log("result length "+userdata.length);
        if(userdata.length>0){
        var groupdatas=[];
        for (var i = 0;i < userdata.length;i++) {
          console.log(userdata[i].userId);
          mongoose.model('users').findOne({
                    userId:userdata[i].userId
          }, function(err,Result){

                  groupdatas.push(Result)
                        if(groupdatas.length==userdata.length){
                            res.format({
                           json: function() {
                            res.json(groupdatas.sort());
                          }
                   });
                 }   
         }).sort({_id:-1});}//end forloop
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
});

router.get('/:userId/getFollowerUser', function(req, res) {
  var userId=req.userId;
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
      userdata=userResult.followers;
      // userdata.push({'userId':userId});
      // console.log("userdata 1 "+userdata);
      // console.log(userdata[0].userId);
      if (userResult!=null) {
        console.log("result length "+userdata.length);
        if(userdata.length>0){
        var groupdatas=[];
        for (var i = 0;i < userdata.length;i++) {
          console.log(userdata[i].userId);
          mongoose.model('users').findOne({
                    userId:userdata[i].userId
          }, function(err,Result){

                  groupdatas.push(Result)
                        if(groupdatas.length==userdata.length){
                            res.format({
                           json: function() {
                            res.json(groupdatas.sort());
                          }
                   });
                 }   
         }).sort({_id:-1});}//end forloop
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

// For Group count based on deiffrent language
router.post('/getFollowingGroupCount', function(req, res) {
  var userId=req.body.userId;
  var language=req.body.language;
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
      userdata=userResult.followingGroups;
      console.log("language "+language);
      if (userResult!=null) {
        
        if(userdata.length>0){
        var groupdatas=[];
        for (var i = 0;i < userdata.length;i++) {
          mongoose.model('group').findOne({
                    language:language,
                    groupId:userdata[i]
          }, function(err,Result){

                        groupdatas.push(Result)
                        if(groupdatas.length==userdata.length){
                            var localArr=[];
                            for(var j=0;j<groupdatas.length;j++){
                               if(groupdatas[j]!=null){
                                  localArr.push(groupdatas[j])
                               }
                            }
                            console.log("groupCount "+localArr.length);
                            console.log(localArr);
                          var length=localArr.length;
                          
                         var  resArr=[{success:true,groupCount:""+length}];
                            res.format({
                           json: function() {
                            res.json(resArr); 
                          }
                   });
                 }   
         }).sort({_id:-1});}//end forloop
       }else{
       var msg =[{
        success: true,
        groupCount:"0"
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
});
// end main block

module.exports = router;