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

router.param('groupId', function(req, res, next, groupId) {
  req.groupId = groupId;
  next();
});

router.param('language', function(req, res, next, language) {
  req.language = language;
  next();
});

router.param('imageName', function(req, res, next, imageName) {
  req.imageName = imageName;
  next();
});

router.param('categoryId', function(req, res, next, categoryId) {
  req.categoryId = categoryId;
  next();
});

//// Follow Group ///
router.post('/followGroup', function(req, res) {
  console.log("inside follow group");
  var userId=req.body.userId;
  var groupId=req.body.groupId;
  var index;
  mongoose.model('users').findOne({
    userId:userId,
  }, (function(err, userResult) {
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
            if(checkValue(newObj, followingGroups)){
              followingGroups.splice(index,1);
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
            var imageurl=userResult.userImage;
          }
        }));
      }));

    //for the group followers
    mongoose.model('group').findOne({
      groupId:groupId,
    }, (function(err, userResult) {
    if(userResult!=null){
      var groupFollower=[];
      groupFollower=userResult.groupFollower;
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
      if(checkValue(newObj, groupFollower)){
        groupFollower.splice(index,1);
      }else{ 
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

// getQuesByGroup for Website
router.get('/:language/:groupId/getGroupByQues', function(req, res) {
  console.log("inside getGroupByQues by Id");
  var groupId = req.groupId;
  console.log("groupId"+groupId);
  var language = req.language;
  console.log("inside getGroupByQues by Id"+language);
 mongoose.model('questions').find({
  groupId: groupId,
  language: language
  }, (function(err, result) {
    res.format({
      json: function() {
        res.json(result);
      }
    });
  }));
});


///// Following group by user id /////
router.post('/getFollowingGroupById', function(req, res) {
  console.log("inside getFollowingGroupById");
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
      if (userResult!=null) {
        if(userdata.length>0){
        var groupdatas=[];
        for (var i = 0;i < userdata.length;i++) {
          mongoose.model('group').findOne({
          groupId:userdata[i].groupId
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

///// Get following group by userid & language /////
router.post('/getFollowingGroupByIds', function(req, res) {
  console.log("inside getFollowingGroupByIds");
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
      if (userResult!=null) {
        if(userdata.length>0){
        var groupdatas=[];
        for (var i = 0;i < userdata.length;i++) {
          mongoose.model('group').findOne({
            groupId:userdata[i].groupId,
            language:language
          }, function(err,Result){
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

//// Send notification function ////
function sendNotification(imageUrl,userId,notiType) {
  console.log("inside sendNotification function");
  var FCM = require('fcm-push');
  var registrationIds = [];
  var tokenId="";
  var serverKey = 'AIzaSyCH6bgCiYGSTI2C_6Twmw01VTfRxDskZhI';
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
      console.log("user not found.");
    }
  });
}

// get top groups //
router.get('/:language/getTopGroups', function(req, res) {
  console.log("inside getTopGroups here");
  var language =req.language;
  mongoose.model('group').find({
    language:language
  },function(err, result) {
    res.format({
      json: function() {
        res.json(result);
      }  
    });
  }).select({"groupId":1,"groupName":1}).sort({_id:-1}).limit(5);
});

// get suggested group on the basis of language //
router.get('/:id/:language/getSuggestedGroups', function(req, res) {
  console.log("inside getSuggestedGroups here");
  var language =req.language;
  var userId=req.id;
    var resArr=[];
   var flage=false;
  mongoose.model('group').find({
    language:language
  },function(err, result) {

       if(result.length>0){

   for(var k=0;k<result.length;k++){
                 var upVotedarr=[];
                 upVotedarr=result[k].groupFollower;
               if(upVotedarr.contains(userId)){
                  flage=true;
                }else{
                flage=false;
               }
             //Construct obj for like flage
             var obj={
              groupId:result[k].groupId,
              //membersIds: result[k].membersIds,
              groupName:result[k].groupName,
               categoryId:result[k].categoryId,
             // categoryName: result[k].categoryName,
              groupImage:result[k].groupImage,
              //technology:result[k].technology,
              //language:result[k].language,
              //tags:result[k].tags,
             // noOfQues:result[k].noOfQues,
              //noOfMembers: result[k].noOfMembers,
              //noOfAns: result[k].noOfAns,
              //noOfSMEs: result[k].noOfSMEs,
              //noOfFavorite:result[k].noOfFavorite,
              //SMEsType:result[k].SMEsType,
              //groupStatus:result[k].groupStatus,
              //groupFollower:result[k].groupFollower,
              groupLiked:flage,
              //createdDate:result[k].createdDate
             };
               resArr.push(obj);
          } 

       res.format({
            json: function() {
              res.json(resArr);
            }
          });
     }

  }).sort({_id:-1}).limit(7);
});

// Search group on the basis of group name //
router.post('/searchGroup', function(req, res) {
  console.log("inside groupName");
  var groupName=req.body.groupName;
  mongoose.model('group').find({ 
    groupName:new RegExp(groupName, 'i')
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

//upload image //
router.post('/insertGroupImage',multer({
    storage: storage,
    fileFilter: function(req, file, callback) {
      var ext = path.extname(file.originalname)
      if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg'){
        return callback(res.end('Only images are allowed'), null)
      }
      callback(null, true)
    }
}).single('img'), function(req, res) {  
   var filename =req.files.file.name;
     var path = "/home/ec2-user/baduga/uploads/GroupImg/"+filename;
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
 });//end

// post question into group //
router.post('/postQuesOnGrp', function(req, res) {
  var groupId=req.body.groupId;
  var memberId=req.body.memberId;
  var shortid = require('shortid');
  var questionId = shortid.generate();
  mongoose.model('questions').create({
    groupId:groupId,
    questionId:questionId,
    memberId:memberId
  }, (function(err, groupResult) {
    var groupdata=[groupResult];
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
          res.json(groupResult);
        }
      });
    }
  }));
});

// update group by group id //
router.post('/updateGroupById', function(req, res) {
  console.log("inside updateGroupById");
  var groupId=req.body.groupId;
  updatedDate=new Date();
  mongoose.model('group').findOne({
   groupId:groupId
 }, (function(err, updtResult) {
  if (updtResult!=null) {
    var groupName = ((req.body.groupName!=null && req.body.groupName!=undefined && req.body.groupName!="") ? req.body.groupName : updtResult.groupName);
    var groupImage = ((req.body.groupImage!=null && req.body.groupImage!=undefined && req.body.groupImage!="") ? req.body.groupImage : updtResult.groupImage);
    var noOfMembers = ((req.body.noOfMembers!=null && req.body.noOfMembers!=undefined && req.body.noOfMembers!="") ? req.body.noOfMembers : updtResult.noOfMembers);
    var noOfSMEs = ((req.body.noOfSMEs!=null && req.body.noOfSMEs!=undefined && req.body.noOfSMEs!="") ? req.body.noOfSMEs : updtResult.noOfSMEs);
    var noOfFavorite = ((req.body.noOfFavorite!=null && req.body.noOfFavorite!=undefined && req.body.noOfFavorite!="") ? req.body.noOfFavorite : updtResult.noOfFavorite);
    var SMEsType = ((req.body.SMEsType!=null && req.body.SMEsType!=undefined && req.body.SMEsType!="") ? req.body.SMEsType : updtResult.SMEsType);
    var groupStatus = ((req.body.groupStatus!=null && req.body.groupStatus!=undefined && req.body.groupStatus!="") ? req.body.groupStatus : updtResult.groupStatus);
    var tags = ((req.body.tags!=null && req.body.tags!=undefined && req.body.tags!="") ? req.body.tags : updtResult.tags);
    var categoryName = ((req.body.categoryName!=null && req.body.categoryName!=undefined && req.body.categoryName!="") ? req.body.categoryName : updtResult.categoryName);

    var newObj = {
      groupName:groupName,
      categoryName:categoryName,
      groupImage:"http://35.154.169.9:4130/group/getGrpImg/"+groupImage,
      noOfMembers:noOfMembers,
      noOfSMEs:noOfSMEs,
      noOfFavorite:noOfFavorite,
      SMEsType:SMEsType,
      groupStatus:groupStatus,
      tags:tags,
      updatedDate:updatedDate
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

// delete group by group id //
router.post('/:groupId/deleteGroupById', function(req, res) {
  console.log("inside deleteGroupById ");
  var groupId=req.groupId;
  mongoose.model('group').remove({
    groupId:groupId
  }, (function(err, groupResult) {
    var groupdata=[groupResult];
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
          res.json(groupResult);
        }
      });
    }
  }));
});

//Create new group //
router.post('/CreateGroup', function(req, res) {
  console.log("inside CreateGroup ");
  var groupId = shortid.generate();
  var groupName = req.body.groupName;
  var groupImage = req.body.groupImage;
  var categoryName = req.body.categoryName;
  var tags = req.body.tags;
  var noOfQues=req.body.noOfQues;
  var noOfMembers=req.body.noOfMembers;
  var noOfSMEs=req.body.noOfSMEs;
  var noOfAns=req.body.noOfAns;
  var noOfFavorite=req.body.noOfFavorite;
  var SMEsType=req.body.SMEsType;
  var groupStatus=req.body.groupStatus;
  var createdDate = new Date();
  var updatedDate = new Date();

  mongoose.model('group').findOne({
    groupId: groupId,
  }, function(err, result) {
    if (result!=null) {
      res.format({
        json: function() {
          res.json([{
            success: false,
            msg: "This groupId already exist."
          }]);
        }
      });
    }else{
      mongoose.model('group').create({
      	groupId:groupId,
      	groupName:groupName,
        categoryName:categoryName,
        groupImage:groupImage,
        noOfQues: 0,
        noOfAns:noOfAns,
        noOfSMEs:noOfSMEs,
        noOfFavorite:noOfFavorite,
        SMEsType:"Basic",
        tags :tags,
        groupStatus:"Enabled",
        createdDate:createdDate,
        updatedDate:updatedDate
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

// Total group count //
router.get('/GroupCount', function(req, res) {
  console.log("count group ");
  mongoose.model('group').count({
  }, (function(err, group) {
    res.format({
      json: function() {
        res.json(group);
      }
    });
  }))
});

// Get all Group basis of language //
router.get('/:language/getAllGroups', function(req, res) {
  console.log("inside getAllGroups");
  var language =req.language;
  mongoose.model('group').find({
    language:language
  }, function(err, result) {
    res.format({
      json: function() {
        res.json(result);
      }
    });
  });
});

// Get 4 Groups//
router.get('/:language/getFourGroups', function(req, res) {
  console.log("inside getFourGroups ");
  var language =req.language;
  mongoose.model('group').find({
    language:language
  }, function(err, result) {
    res.format({
      json: function() {
        res.json(result);
      }
    });
  }).sort({_id:-1}).limit(4);
});

// Get all Group basis of language & categoruId//
router.get('/:language/:categoryId/getGroupsByCategoryId', function(req, res) {
  console.log("inside getGroupsByCategoryId");
  var language =req.language;
  var categoryId=req.categoryId;
  mongoose.model('group').find({
    language:language,
    categoryId:categoryId
  }, function(err, result) {
    res.format({
      json: function() {
        res.json(result);
      }
    });
  });
});

// Get all Group //
router.get('/getAllGroup', function(req, res) {
  mongoose.model('group').find({
  }, function(err, result) {
    res.format({
      json: function() {
        res.json(result);
      }
    });
  });
});

// Detail Of Group
router.get('/:groupId/getGroupDetail', function(req, res) {
  var groupId= req.groupId;
  mongoose.model('group').findOne({
    groupId:groupId
  }, (function(err, groupResult) {
  res.format({
    json: function(){
     res.json([groupResult]);
    }
  });
}));
});

router.get('/:groupId/getSubGroup', function(req, res) {
  var groupId= req.groupId;
  mongoose.model('group').findOne({},{
   subGroup:1
  }, (function(err, groupResult) {
  res.format({
    json: function(){
     res.json([groupResult]);
   }
 });
}));
});

// serialno : 1

//create group and add members to this group
router.post('/addGrpWithMembers', function(req, res) {
  console.log("inside add grp functn");
  var groupId = req.body.groupId;
  var groupName = req.body.groupName;
  var groupImage = req.body.groupImage;
  var membersIds = req.body.membersIds;
  var createdDate = new Date();
  var updatedDate = new Date();
  mongoose.model('group').create({
    groupId: groupId,
    groupName: groupName,
    membersIds:membersIds.split(","),
    createdDate: createdDate,
    updatedDate: updatedDate,
  }, function(err, result) {
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
     res.format({
      json: function() {
        res.json(result);
      }
    });
   }
  })
});


// // Add user to group collections
// router.post('/:groupId/addUserToGroup', function(req, res) {
//   var groupId = req.groupId;
//   var userId = req.body.userId;
//   mongoose.model('groupusers').findOne({
//     groupId: groupId,
//  }, function(err, result) {
//   if (result!=null){
//     result.update({
//         userId: userId
//       },function(err, result) {
//         if (err) {
//           res.send("There was a problem fetvhing information from the database.");
//         } else {
//           res.send("Data updating successfully!");
//         }
//       })
//   }else{
//     mongoose.model('groupusers').create({
//       groupId: groupId,
//       userId: userId
//     }, function(err, result) {
//       if (err) {
//         res.send("There was a problem adding the information to the database.");
//       } else {
//         res.format({
//           json: function() {
//             res.json(result);
//           }
//         });
//       }
//     })
//   }
// })
// });

// get group image //
router.get('/getGrpImg/:imageName', function(req, res) {
  console.log("inside getGrpImg");
  var imageName = req.imageName;
  var http = require('http');
  var fs = require('fs');
  var path = '/home/ec2-user/baduga/uploads/GroupImg/'+imageName;
  fs.readFile(path, function(err, data) {
    res.writeHead(200, {'Content-Type': 'image/jpeg'});
    res.end(data);
  });
});

// upload group image //
router.post('/uploadGrpImg', function(req, res) {
  console.log("inside upload group img ");
  if (!req.files)
    return res.status(400).send('No files were uploaded.');
  let quesImg = req.files.file;
  var newFileName= req.body.newfilename;
  var imageName=quesImg.name;
  var path = '/home/ec2-user/baduga/uploads/GroupImg/'+newFileName;
  quesImg.mv(path, function(err) {
    if (err)
      return res.status(500).send(err);
    res.send('File uploaded!');
  });
});

//Optimize Apis
router.post('/optFollowGroup', function(req, res) {
  var userId=req.body.userId;
  var groupId=req.body.groupId;
  var flage=false;
  mongoose.model('users').findOne({
    userId:userId,
  }, (function(err, userResult) {
        if(userResult!=null){
          var followingGroups=[];
          followingGroups=userResult.followingGroups;
          if(followingGroups.length>0){
            if(checkValue(groupId, followingGroups)){
              followingGroups.remove(groupId);
              flage=false;
            }else{ 
              followingGroups.push(groupId);
              flage=true;                
            }
          }else{
             followingGroups.push(groupId);
             flage=true;
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
            var imageurl=userResult.userImage;
          }
        }));
      }));

    //for the group followers
    mongoose.model('group').findOne({
      groupId:groupId,
    }, (function(err, userResult) {
    if(userResult!=null){
      var groupFollower=[];
      groupFollower=userResult.groupFollower;
      if(groupFollower.length>0){
       var newObj = {'userId': userId,'updatedDate':new Date()}
      if(checkValue(userId, groupFollower)){
        groupFollower.remove(userId);
      }else{ 
        groupFollower.push(userId);                
      }
    }else{
       groupFollower.push(userId);
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
        res.format({
         json: function() {
          res.json([{success : true,followGroup:flage,
           msg: "Data inserted successfully"}]);
        }
      });
      }
    }));
  }));
});

//check value
     //check for exist value
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

//Optimize get All groups by category id
router.get('/:id/:language/:categoryId/optGetGroupsByCategoryId', function(req, res) {
  console.log("inside getGroupsByCategoryId");
  var language =req.language;
  var categoryId=req.categoryId; 
  var userId=req.id;
   var resArr=[];
   var flage=false;
  mongoose.model('group').find({
    language:language,
    categoryId:categoryId
  }, function(err, result) {
    
     if(result.length>0){

   for(var k=0;k<result.length;k++){
                 var upVotedarr=[];
                 upVotedarr=result[k].groupFollower;
               if(upVotedarr.contains(userId)){
                  flage=true;
                }else{
                flage=false;
               }
             //Construct obj for like flage
             var obj={
              groupId:result[k].groupId,
              membersIds: result[k].membersIds,
              groupName:result[k].groupName,
               categoryId:result[k].categoryId,
              categoryName: result[k].categoryName,
              groupImage:result[k].groupImage,
              technology:result[k].technology,
              language:result[k].language,
              tags:result[k].tags,
              noOfQues:result[k].noOfQues,
              noOfMembers: result[k].noOfMembers,
              noOfAns: result[k].noOfAns,
              noOfSMEs: result[k].noOfSMEs,
              noOfFavorite:result[k].noOfFavorite,
              SMEsType:result[k].SMEsType,
              groupStatus:result[k].groupStatus,
              groupFollower:result[k].groupFollower,
              groupLiked:flage,
              createdDate:result[k].createdDate
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
     }
  });
});

//Function for check exist
  Array.prototype.contains = function(element){
                                    return this.indexOf(element) > -1;
                                };

//Optimize get four groups
router.get('/:id/:language/optGetFourGroups', function(req, res) {
   var resArr=[];
   var flage=false;
   var userId=req.id;
  console.log("inside getFourGroups ");
  var language =req.language;
  mongoose.model('group').find({
    language:language
  }, function(err, result) {

     if(result.length>0){

   for(var k=0;k<result.length;k++){
                 var upVotedarr=[];
                 upVotedarr=result[k].groupFollower;
               if(upVotedarr.contains(userId)){
                  flage=true;
                }else{
                flage=false;
               }
             //Construct obj for like flage
             var obj={
              groupId:result[k].groupId,
              membersIds: result[k].membersIds,
              groupName:result[k].groupName,
               categoryId:result[k].categoryId,
              categoryName: result[k].categoryName,
              groupImage:result[k].groupImage,
              technology:result[k].technology,
              language:result[k].language,
              tags:result[k].tags,
              noOfQues:result[k].noOfQues,
              noOfMembers: result[k].noOfMembers,
              noOfAns: result[k].noOfAns,
              noOfSMEs: result[k].noOfSMEs,
              noOfFavorite:result[k].noOfFavorite,
              SMEsType:result[k].SMEsType,
              groupStatus:result[k].groupStatus,
              groupFollower:result[k].groupFollower,
              groupLiked:flage,
              createdDate:result[k].createdDate
             };
               resArr.push(obj);
          } 

       res.format({
            json: function() {
              res.json(resArr);
            }
          });
     }
     
  }).sort({_id:-1}).limit(5);
}); 

//optGroupDetail
router.get('/:id/:groupId/optGetGroupDetail', function(req, res) {
  var groupId= req.groupId;
  var userId=req.id;
  var resArr=[];
  var flage=false;
  mongoose.model('group').findOne({
    groupId:groupId
  }, (function(err, result) {

         if(result!=null){
                 var upVotedarr=[];
                 upVotedarr=result.groupFollower;
                 console.log(upVotedarr);
               if(upVotedarr.contains(userId)){
                  flage=true;
                }else{
                flage=false;
               }
             //Construct obj for like flage
             var obj={
              groupId:result.groupId,
              groupLiked:flage,
              groupImage:result.groupImage,
              groupName:result.groupName,
              createdDate:result.createdDate
              };
               resArr.push(obj);
       res.format({
            json: function() {
              res.json(resArr);
            }
          });
     }
}));
});  

//Optimize get all groups
router.get('/:id/:language/optGetAllGroups', function(req, res) {
  console.log("inside getAllGroups");
  var language =req.language;
  userId=req.id;
  var resArr=[];
  var flage=false; 
  mongoose.model('group').find({
    language:language
  }, function(err, result) {
   
    
  if(result.length>0){

   for(var k=0;k<result.length;k++){
                 var upVotedarr=[];
                 upVotedarr=result[k].groupFollower;
               if(upVotedarr.contains(userId)){
                  flage=true;
                }else{
                flage=false;
               }
             //Construct obj for like flage
             var obj={
              groupId:result[k].groupId,
              membersIds: result[k].membersIds,
              groupName:result[k].groupName,
               categoryId:result[k].categoryId,
              categoryName: result[k].categoryName,
              groupImage:result[k].groupImage,
              technology:result[k].technology,
              language:result[k].language,
              tags:result[k].tags,
              noOfQues:result[k].noOfQues,
              noOfMembers: result[k].noOfMembers,
              noOfAns: result[k].noOfAns,
              noOfSMEs: result[k].noOfSMEs,
              noOfFavorite:result[k].noOfFavorite,
              SMEsType:result[k].SMEsType,
              groupStatus:result[k].groupStatus,
              groupFollower:result[k].groupFollower,
              groupLiked:flage,
              createdDate:result[k].createdDate
             };
               resArr.push(obj);
          } 

       res.format({
            json: function() {
              res.json(resArr);
            }
          });
     }

  });
});

//Optimize get groups by userId
router.post('/optGetFollowingGroupById', function(req, res) {
  console.log("inside getFollowingGroupByIds");
  var userId=req.body.userId;
  var language=req.body.language;
     var resArr=[];
  var flage=false; 
  console.log("userId "+userId+" language "+language);
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
       console.log(userResult);
      var userdata=[]; 
      userdata=userResult.followingGroups;
      console.log(userdata); 
      if (userResult!=null) {
        if(userdata.length>0){
        var groupdatas=[];
        for (var i = 0;i < userdata.length;i++) {
          mongoose.model('group').findOne({
            groupId:userdata[i],
            language:language
          }, function(err,Result){
            groupdatas.push(Result);
            if(groupdatas.length==userdata.length){
              var localArr=[];
              for(var j=0;j<groupdatas.length;j++){
               if(groupdatas[j]!=null){
                localArr.push(groupdatas[j])
              }
            }
                

             for(var k=0;k<localArr.length;k++){
             var upVotedarr=[];
              upVotedarr=localArr[k].groupFollower;
               if(upVotedarr.contains(userId)){
                  flage=true;
                }else{
                flage=false;
               }
             //Construct obj for like flage
             var obj={
              groupId:localArr[k].groupId,
              membersIds: localArr[k].membersIds,
              groupName:localArr[k].groupName,
               categoryId:localArr[k].categoryId,
              categoryName: localArr[k].categoryName,
              groupImage:localArr[k].groupImage,
              technology:localArr[k].technology,
              language:localArr[k].language,
              tags:localArr[k].tags,
              noOfQues:localArr[k].noOfQues,
              noOfMembers: localArr[k].noOfMembers,
              noOfAns: localArr[k].noOfAns,
              noOfSMEs: localArr[k].noOfSMEs,
              noOfFavorite:localArr[k].noOfFavorite,
              SMEsType:localArr[k].SMEsType,
              groupStatus:localArr[k].groupStatus,
              groupFollower:localArr[k].groupFollower,
              groupLiked:flage,
              createdDate:localArr[k].createdDate
             };
               resArr.push(obj);
          } 



                res.format({
                 json: function() {
                  res.json(resArr.sort());
                   }
                 });


          }   
         }).sort({_id:-1});}//end forloop
       }else{

      res.format({
        json: function() {
          res.json([]);
        }
      });
       }
      }
    }
 });
});//end main block


module.exports = router;