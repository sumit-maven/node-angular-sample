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

router.param('id', function(req, res, next, id) {
  req.id = id;
  next();
});

router.param('status', function(req, res, next, status) {
  req.status = status;
  next();
});

router.param('categoryId', function(req, res, next, categoryId) {
  req.categoryId = categoryId;
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

//For Website Top 5 category (Name, id )
router.get('/:language/getTopCats', function(req, res) {
  console.log("inside getTopCats here");
  var language =req.language;
  mongoose.model('category').find({
    language:language
  },function(err, result) {
    res.format({
      json: function() {
        res.json(result);
      }  
    });
  }).select({"categoryId":1,"categoryName":1}).sort({_id:-1}).limit(5);
});

//For Website get all category (Name, id, groupName)
router.get('/:language/getAllCats', function(req, res) {
  console.log("inside getTopCats here");
  var language =req.language;
   mongoose.model('category').find({
    language:language
  },function(err, result) {
    res.format({
      json: function() {
        res.json(result);
      }  
    });
  }).select({"categoryId":1,"categoryName":1,"groupName":1}).sort({_id:-1});
});

//for Website search category //
router.post('/searchCategory', function(req, res) {
  console.log("inside categoryName");
  var categoryName=req.body.categoryName;
  mongoose.model('category').find({ 
    categoryName:new RegExp(categoryName, 'i')
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

// post question in group
router.post('/postQuesOnGrp', function(req, res) {
  console.log("Inside postQuesOnGrp");
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
          console.log("ques posted");
          res.json(groupResult);
        }
      });
    }
  }));
});

// update category by category id //
router.post('/updateCategoryById', function(req, res) {
    var categoryId=req.body.categoryId;
    updatedDate=new Date();
    mongoose.model('category').findOne({
     categoryId:categoryId
    }, (function(err, updtResult) {
    if (updtResult!=null) {
      var categoryName = ((req.body.categoryName!=null && req.body.categoryName!=undefined && req.body.categoryName!="") ? req.body.categoryName : updtResult.categoryName);
      var catImage = ((req.body.catImage!=null && req.body.catImage!=undefined && req.body.catImage!="") ? req.body.catImage : updtResult.catImage);
      var noOfMembers = ((req.body.noOfMembers!=null && req.body.noOfMembers!=undefined && req.body.noOfMembers!="") ? req.body.noOfMembers : updtResult.noOfMembers);
      var noOfSMEs = ((req.body.noOfSMEs!=null && req.body.noOfSMEs!=undefined && req.body.noOfSMEs!="") ? req.body.noOfSMEs : updtResult.noOfSMEs);
      var noOfFavorite = ((req.body.noOfFavorite!=null && req.body.noOfFavorite!=undefined && req.body.noOfFavorite!="") ? req.body.noOfFavorite : updtResult.noOfFavorite);
      var SMEsType = ((req.body.SMEsType!=null && req.body.SMEsType!=undefined && req.body.SMEsType!="") ? req.body.SMEsType : updtResult.SMEsType);
      var groupStatus = ((req.body.groupStatus!=null && req.body.groupStatus!=undefined && req.body.groupStatus!="") ? req.body.groupStatus : updtResult.groupStatus);
      var tags = ((req.body.tags!=null && req.body.tags!=undefined && req.body.tags!="") ? req.body.tags : updtResult.tags);
      var noOfGroups = ((req.body.noOfGroups!=null && req.body.noOfGroups!=undefined && req.body.noOfGroups!="") ? req.body.noOfGroups : updtResult.noOfGroups);
      var groupName = ((req.body.groupName!=null && req.body.groupName!=undefined && req.body.groupName!="") ? req.body.groupName : updtResult.groupName);

      var newObj = {
        categoryName:categoryName,
        groupName:groupName,
        catImage:"http://35.154.169.9:4130/category/getCatImg/"+catImage,
        noOfMembers:noOfMembers,
        noOfSMEs:noOfSMEs,
        noOfFavorite:noOfFavorite,
        SMEsType:SMEsType,
        groupStatus:groupStatus,
        tags:tags,
        noOfGroups:noOfGroups,
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

// delete category by category id //
router.post('/:categoryId/deleteCategoryById', function(req, res) {
  console.log("Inside deleteCategoryById ");
  var categoryId=req.categoryId;
  mongoose.model('category').remove({
    categoryId:categoryId
  }, (function(err, groupResult) {
    var categorydata=[groupResult];
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

//Add new category//
router.post('/CreateCategory', function(req, res) {
  console.log("Inside CreateCategory ");
  var categoryId = shortid.generate();
  var categoryName = req.body.categoryName;
  var catImage = req.body.catImage;
  var groupName = req.body.groupName;
  var tags = req.body.tags;
  var noOfQues=req.body.noOfQues;
  var noOfMembers=req.body.noOfMembers;
  var noOfSMEs=req.body.noOfSMEs;
  var noOfGroups=req.body.noOfGroups;
  var noOfFavorite=req.body.noOfFavorite;
  var SMEsType=req.body.SMEsType;
  var catStatus=req.body.catStatus;
  var createdDate = new Date();
  var updatedDate = new Date();

  mongoose.model('category').findOne({
    categoryId: categoryId,
  }, function(err, result) {
    if (result!=null) {
      res.format({
        json: function() {
          res.json([{
            success: false,
            msg: "This categoryId already exist."
          }]);
        }
      });
    }else{
      mongoose.model('category').create({
      	categoryId:categoryId,
      	categoryName:categoryName,
        catImage:catImage,
        groupName:groupName,
        noOfQues: noOfQues,
        noOfSMEs:noOfSMEs,
        noOfGroups:noOfGroups,
        noOfFavorite:noOfFavorite,
        SMEsType:SMEsType,
        tags :tags,
        catStatus:"Enabled",
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
  console.log("Inside count group ");
  mongoose.model('group').count({
  }, (function(err, group) {
    res.format({
      json: function() {
        res.json(group);
      }
    });
  }))
});

// Optimizes get all category api //
router.get('/:id/:language/optGetAllCategory', function(req, res) {
  console.log("inside getAllcategory "+req.id);
  var language=req.language;
  var userId=req.id;
  var resArr=[];
  var flage=false;
  mongoose.model('category').find({
    language:language
  }, function(err, result) {

    if(result.length>0){

      for(var k=0;k<result.length;k++){
       var upVotedarr=[];
       upVotedarr=result[k].bookMarkCategory;
           // console.log("check userId "+upVotedarr.contains("Hk27RrHdM"));
           if(upVotedarr.contains(userId)){
            flage=true;
          }else{
            flage=false;
          }
         //Construct obj for like flage
         var obj={
          categoryId:result[k].categoryId,
          categoryName:result[k].categoryName,
          language:result[k].language,
          catImage:result[k].catImage,
          categoryImage:result[k].categoryImage,
          tags:result[k].tags,
          noOfQues:result[k].noOfQues,
          noOfGroups:result[k].noOfGroups,
          noOfSMEs: result[k].noOfSMEs,
          noOfFavorite:result[k].noOfFavorite,
          SMEsType:result[k].SMEsType,
          catStatus:result[k].catStatus,
          bookMarkCategory:result[k].bookMarkCategory,
          categoryLiked:flage,
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

// Get all category//
router.get('/:language/getAllCategory', function(req, res) {
  console.log("inside getAllcategory");
  var language=req.language;
  mongoose.model('category').find({
    language:language
  }, function(err, result) {
    res.format({
      json: function() {
        res.json(result);
      }
    });
  });
});

//Function for check exist
  Array.prototype.contains = function(element){
                                    return this.indexOf(element) > -1;
                                };

// Detail Of category by category id //
router.get('/:categoryId/getCategoryDetail', function(req, res) {
  console.log("Inside getCategoryDetail ");
  var categoryId= req.categoryId;
  mongoose.model('category').findOne({
   categoryId:categoryId
 }, (function(err, groupResult) {
  res.format({
    json: function(){
     res.json([groupResult]);
   }
 });
}));
});

// get subgroup by group id //
router.get('/:groupId/getSubGroup', function(req, res) {
  console.log("Inside getSubGroup ");
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
  //var membersIds=  [ Yi6fTil81D, r1aUDFt_Z, Bk-eOFY_b,  HJG3wxhuW];//Example of MemberId, Currently this id hardcoded.  
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

// get category image //
router.get('/getCatImg/:imageName', function(req, res) {
  console.log("Inside get category Image ");
  var imageName = req.imageName;
  var http = require('http');
  var fs = require('fs');
  var path = '/home/ec2-user/baduga/uploads/catImg/'+imageName;
  fs.readFile(path, function(err, data) {
    res.writeHead(200, {'Content-Type': 'image/jpeg'});
    res.end(data);
  });
});

// Add user to group collections //
router.post('/:groupId/addUserToGroup', function(req, res) {
  console.log("Inside Add user to group ");
  var groupId = req.groupId;
  var userId = req.body.userId;
  mongoose.model('groupusers').findOne({
    groupId: groupId,
  }, function(err, result) {
  if (result!=null){
    result.update({
        userId: userId
      },function(err, result) {
        if (err) {
          res.send("There was a problem fetvhing information from the database.");
        } else {
          res.send("Data updating successfully!");
        }
      })
  }else{
    mongoose.model('groupusers').create({
      groupId: groupId,
      userId: userId
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

// get group image from uploads folder //
router.get('/getGrpImg/:imageName', function(req, res) {
  console.log("Inside getGrpImg ");
  var imageName = req.imageName;
  var http = require('http');
  var fs = require('fs');
  var path = '/home/ec2-user/baduga/uploads/GroupImg/'+imageName;
  fs.readFile(path, function(err, data) {
    res.writeHead(200, {'Content-Type': 'image/jpeg'});
    res.end(data);
  });
});

// upload group image to server //
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

//Api for category bookmark //
router.post('/bookMarkCategory', function(req, res) {
  console.log("Inside bookMarkCategory ");
  var userId=req.body.userId;
  var categoryId=req.body.categoryId;
  var index;
  var bookmarked = false;
  mongoose.model('users').findOne({
    userId:userId,
  }, (function(err, userResult) {
    if(userResult!=null){
      var bookMarkCategory=[];
      bookMarkCategory=userResult.bookMarkCategory;
      if(bookMarkCategory.length>0){
       var newObj = {'categoryId': categoryId,'updatedDate':new Date()}
              //check for exist value
              function checkValue(value,arr){
               var status = false;            
               for(var i=0; i<arr.length; i++){
                 var name = arr[i];
                 if(name.categoryId == value.categoryId){
                  status = true;
                  index=i;
                  break;
                }
              }
              return status;
            }

            if(checkValue(newObj, bookMarkCategory)){
              bookMarkCategory.splice(index,1);
              bookmarked = false;
            }else{ 
              bookMarkCategory.push(newObj);                
              bookmarked = true;
            }
          }else{
            var newObj = {
             'categoryId': categoryId,
             'updatedDate':new Date()
           }
           bookMarkCategory.push(newObj);
           bookmarked = true;
         }
        }//end block result 

        var obj={'bookMarkCategory':bookMarkCategory}
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
         }
       }));
      }));
     //for the group followers
     mongoose.model('category').findOne({
      categoryId:categoryId,
    }, (function(err, userResult) {
      if(userResult!=null){
        var bookMarkCategory=[];
        bookMarkCategory=userResult.bookMarkCategory;
        if(bookMarkCategory.length>0){
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
        if(checkValue(newObj, bookMarkCategory)){
          bookMarkCategory.splice(index,1);
        }else{ 
          bookMarkCategory.push(newObj);                
        }
      }else{
       var newObj = {
         'userId': userId,
         'updatedDate':new Date()}
         bookMarkCategory.push(newObj);
       }
        }//end block result 
        var obj={'bookMarkCategory':bookMarkCategory}
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
               bookmarked:bookmarked,
               msg: "category bookmarked successfully"}]);
            }
          });
         }
       }));
      }));
  });

//Optimize bookmarked category api 
router.post('/optBookMarkCategory', function(req, res) {
  console.log("Inside bookMarkCategory ");
  var userId=req.body.userId;
  var categoryId=req.body.categoryId;
  var bookmarked = false;
  mongoose.model('users').findOne({
    userId:userId,
  }, (function(err, userResult) {
    if(userResult!=null){
      var bookMarkCategory=[];
      bookMarkCategory=userResult.bookMarkCategory;
      if(bookMarkCategory.length>0){
        
            if(checkValue(categoryId, bookMarkCategory)){
              bookMarkCategory.remove(categoryId);
              bookmarked = false;
            }else{ 
              bookMarkCategory.push(categoryId);                
              bookmarked = true;
            }
          }else{
           bookMarkCategory.push(categoryId);
           bookmarked = true;
         }
        }//end block result 

        var obj={'bookMarkCategory':bookMarkCategory}
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
         }
       }));
      }));
     //for the group followers
     mongoose.model('category').findOne({
      categoryId:categoryId,
    }, (function(err, userResult) {
      if(userResult!=null){
        var bookMarkCategory=[];
        bookMarkCategory=userResult.bookMarkCategory;
        if(bookMarkCategory.length>0){
     
        if(checkValue(userId, bookMarkCategory)){
          bookMarkCategory.remove(userId);
        }else{ 
          bookMarkCategory.push(userId);                
        }
      }else{
         bookMarkCategory.push(userId);
       }
        }//end block result 
        var obj={'bookMarkCategory':bookMarkCategory}
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
               bookmarked:bookmarked,
               msg: "category bookmarked successfully"}]);
            }
          });
         }
       }));
      }));
  });

//For check exist value
    function checkValue(value,arr){
           var status = false;

           for(var i=0; i<arr.length; i++){
             var name = arr[i];
             if(name == value){
              status = true;
              index=i;
              break;
            }
          }
          return status;
        }

 //Get top 5 category with flage
router.get('/:id/:language/getTopCategory', function(req, res) {
  var userId =req.id;
  var language =req.language;
  var resArr=[];
  var flage=false;
  mongoose.model('category').find({
    language:language
  },function(err, result) {
   
   if(result.length>0){

    for(var k=0;k<result.length;k++){
     var upVotedarr=[];
     upVotedarr=result[k].bookMarkCategory;
     if(upVotedarr.contains(userId)){
         flage=true;
       }else{
         flage=false;
      }
         //Construct obj for like flage
         var obj={
          categoryId:result[k].categoryId,
          categoryName:result[k].categoryName,
          categoryLiked:flage
        };

        resArr.push(obj);
      }
      
      res.format({
        json: function() {
          res.json(resArr);
        }
      });
    }else{
     var msg =[{
      success: false,
      msg: "Something went wrong. Please try again." }];
      res.format({
        json: function() {
          res.json(msg);
        }
      });
    }
  }).select({"categoryId":1,"categoryName":1,"bookMarkCategory":1}).sort({_id:-1}).limit(5);
});

module.exports = router;