var express = require('express'),
router = express.Router(),
fs = require("fs");
// path = require("path");
mongoose = require('mongoose'),
bodyParser = require('body-parser'),
methodOverride = require('method-override');
var shortid = require('shortid');
var nodemailer = require('nodemailer');

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
router.post('/imginsert',multer({
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
    console.log("inside rj");
    console.log(req);
    // var buffer = req.files.file;
    var filename =req.files.file.name;
    console.log(filename);
    var path = "/home/ec2-user/baduga/uploads/"+filename;
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


router.param('imageOjec', function(req, res, next, imageOjec) {
  req.imageOjec = imageOjec;
  next();
});

router.param('language', function(req, res, next, language) {
  req.language = language;
  next();
});


//for notification
function sendNotification(imageUrl,userId,notiType) {
  console.log(" rj function 1 "+userId+" imageurl "+imageUrl);
  var FCM = require('fcm-push');
  var registrationIds = [];
  var tokenId="";
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


router.param('url', function(req, res, next, url) {
  req.url = url;
  next();
});


//Function for check exist
  Array.prototype.contains = function(element){
                                    return this.indexOf(element) > -1;
                                };

// Get all Group basis of language 
router.get('/:language/getPaginated',(req,res) => {
  console.log("inside records ");
  var language =req.language;
  var pageNo = parseInt(req.query.pageNo)
  var size = parseInt(req.query.size)
  var query = {}
  if(pageNo < 0 || pageNo === 0) {
        response = {"error" : true,"message" : "invalid page number, should start with 1"};
        return res.json(response)
  }
  query.skip = size * (pageNo - 1)
  query.limit = size
  // Find some documents
       mongoose.model('group').find({ 
       	language:language
       },{},query,function(err,data) {
        // Mongo command to fetch all data from collection.
            if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
                response = {"error" : false,"message" : data,"length" : data.length};
            }
            res.json(response);
        });
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
           "answerCount":1}).limit(1).sort({ _id:-1});    
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
  var resArr=[],peopleArr=[],groupArr=[];
  var flage=false;
  console.log("rj query 2 ");
  console.log(query);
  //Get user peaple following and group following data
  mongoose.model('users').findOne({
    userId:userId
  },function(err, userResult){
       if(!err){
            peopleArr=userResult.following;
            groupArr=userResult.followingGroups;
           
            console.log("rj group data "+groupArr.length);
        
        //Get people following recend feeds
        mongoose.model('questions').find({
          userId: { $in: peopleArr },
          // userId:userdata[i],
          status:"Enabled",
          language:language
        },function(err,Result){
          console.log("rj people data "+Result.length);
         //  userdatas.push(Result)
         //  if(userdatas.length==userdata.length){
         //   getFollowingGrpPagination(userdatas,followGroupArray,Res,language,userId,query);
         // }
       }).select({"groupId":1,"userId":1,"anonymFlage":1,"ansUserId":1,"ansUserName":1, "ansUserImage":1,
       "groupName":1,"questionId":1,
       "postedBy":1,"language":1,"userImage":1,"questionText":1,
       "upVote":1,"location":1,"createdDate":1,"upVoted":1,"answers":1,
       "answerCount":1}).sort({ _id:-1});




       }
  });


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
  let flags = [], output = [], l = arr.length, i;
  for( i=0; i<l; i++) {
    if( flags[arr[i].questionId]) continue;
    flags[arr[i].questionId] = true;
    output.push(arr[i]);
  }
  return output
}


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
  questionText:questionText
},function(err, result) {
 if (result!=null) {
  
  res.format({
    json: function() {
      res.format({
        json: function() {
          res.json([{success : true,
            msg: "Question already exist"}]);
        }
      });
    }
  });

}else {
  // mongoose.model('users').findOne({
  //   userId:userId,
  // },function(err, result) {
  //   if (result!=null) {
  //     console.log("result");
  //   }else{
  //     res.format({
  //       json: function() {
  //         res.json([{success : false,
  //           msg: "Something went wrong"}]);
  //       }
  //     });
  //   }
  // }).sort({
  //   _id:-1
  // });
    // } //end of else first visit

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

  }

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


module.exports = router;