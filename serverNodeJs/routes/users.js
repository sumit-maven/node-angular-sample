var express = require('express'),
router = express.Router(),
fs = require("fs");
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

//upload image 
router.post('/:userId/insertUserImage',multer({
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
		var filename =req.files.file.name;
		var userId = req.userId;
	    var path = '/home/ec2-user/baduga/uploads/UserImg/'+filename;
	    var path2 = 'http://35.154.169.9:4130/users/getUserImg/'+filename;
	    var buffer = req.files.file.data; 
		fs.writeFile(path, buffer, 'binary' , function(err) {
		    if(!err){
		    	mongoose.model('users').findOne({
		    		userId: userId,
		    	}, function(err,result){
		    		if (err) {
		    			res.format({
		    				json: function() {
		    					res.json([{
		    						success: false,
		    						msg: "Something went wrong."
		    					}]);
		    				}
		    			});
		    		}else{
					    result.update({
					    	'userImage':path2,
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
					    				res.json({
					    					success: true,
					    					msg: "Image upload successfully.",
					    				});
					    			}
					    		});
					    	}
					    })
				    }
		    	})
            }else{
            	res.format({
            		json: function() {
            			res.json([{
            				success: false,
            				msg: "Image uploaded error",
            			}]);
            		}
            	});
            }
	    });
    }
);//end 

router.get('/getImage',function(req,res){
	res.sendFile(__dirname + "/index.html");
});

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

router.param('userId', function(req, res, next, userId) {
	req.userId = userId;
	next();
});

router.param('userName', function(req, res, next, userName) {
	req.userName = userName;
	next();
});

router.param('userImage', function(req, res, next, userImage) {
	req.userImage = userImage;
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

// Get all user for website //
router.get('/:userId/getAllUsers', function(req, res) {
	console.log("inside getAllUsers");
	var userId=req.userId;
	mongoose.model('users').find({
	}, function(err, result) {
        if(result.length>0){
        	var localArray=[];
           for(var i=0;i<result.length;i++){
               var localUserId=result[i].userId;
               if(localUserId!=userId){
                  localArray.push(result[i]);
               }
           }// end for block    
        	res.format({
			json: function() {
				res.json(localArray);
		     	 }
		     });
        }//end if block
	});
});



 
//Optimize api 
router.get('/:userId/optGetAllUsers', function(req, res) {
	console.log("inside getAllUsers");
	var userId=req.userId;
	 var resArr=[];
     var flage=false;
	mongoose.model('users').find({
	}, function(err, result) {
        if(result.length>0){
        	var localArray=[];
           for(var i=0;i<result.length;i++){
               var localUserId=result[i].userId; 
               if(localUserId!=userId){
                  localArray.push(result[i]);
               }
           }// end for block    
        	
            if(localArray.length>0){
                      for(var k=0;k<localArray.length;k++){
                       var userArr=[];
                       userArr=localArray[k].followers;
                     // console.log("check userId "+upVotedarr.contains("Hk27RrHdM"));
                     if(userArr.contains(userId)){
                      flage=true;
                     }else{
                      flage=false;
                     }
                   //Construct obj for like flage
                   var obj={
                      userName:localArray[k].userName,
                      userImage:localArray[k].userImage,
                      userId:localArray[k].userId,
                      peopleFollow:flage,
                      followers:localArray[k].followers,
                      work:localArray[k].work,
                      education:localArray[k].education,
                      address:localArray[k].address
                     };

                     resArr.push(obj);
                } 

           	res.format({
			json: function() {
				res.json(resArr);
		     	 }
		     });
          }
        
        }//end if block
	});
});

 Array.prototype.contains = function(element){
                                    return this.indexOf(element) > -1;
                                };

//For website Top 5 Users//
router.get('/getTopUsers', function(req, res) {
	console.log("inside getTopUsers");
	mongoose.model('users').find({
	}, function(err, result) {
        res.format({
      		json: function() {
        		res.json(result);
      		}  
    	});//end if block
	}).select({"userId":1,"userName":1,"userImage":1,"followers":1,"language":1,"following":1}).sort({_id:-1}).limit(5);
});

//For Website All Users (Selected items)
router.get('/:userId/Allusers', function(req, res) {
	console.log("inside Allusers");
	var userId=req.userId;
	mongoose.model('users').find({
	}, function(err, result) {
        if(result.length>0){
        	var localArray=[];
           for(var i=0;i<result.length;i++){
               var localUserId=result[i].userId;
               if(localUserId!=userId){
                 localArray.push(result[i]);
               }
           }// end for block    
        	res.format({
			json: function() {
				res.json(localArray);
		     	 }
		     });
        }//end if block 
	}).select({"userId":1,"userName":1,"userImage":1,"education":1,"address":1,"followers":1,"work":1,"language":1,"following":1,"currentWork":1}).sort({_id:-1});
});


////////show only 4 user/////
router.get('/:userId/getThreeUsers', function(req, res) {
	console.log("inside getThreeUsers")
	var userId=req.userId;
	mongoose.model('users').find({
	}, function(err, result) {
        if(result.length>0){
        	var localArray=[];
           for(var i=0;i<result.length;i++){
               var localUserId=result[i].userId;
               if(localUserId!=userId){
                   localArray.push(result[i]);
                }
           }// end for block    
        	res.format({
				json: function() {
					res.json(localArray);
		     	}
		    })
        }//end if block
	}).sort({
		_id : -1
	}).limit(4);
});

// get SME users //
router.get('/geSMEUsers', function(req, res) {
	console.log("inside getSMEusers");
	mongoose.model('users').find({userType :"Premium"
	}, function(err, result) {
		res.format({
			json: function() {
				res.json(result);
			}
		});
	});
});

// Search user by user name //
router.post('/searchUser', function(req, res) {
	console.log("inside searchUser");
	var userName=req.body.userName;
	mongoose.model('users').find({ 
		userName:new RegExp(userName, 'i')
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
		text: 'Hello, '+ newPass +" is your new password."
	};
	transporter.sendMail(mailOptions, function(error, info){
		if (error) {
			console.log(error);
	} else {
		console.log('Email sent: ' + info.response);
	}
});
}


// Update user by user id //
router.post('/resetPassword', function(req, res) {
	console.log("reset Password API");
	var email=req.body.email;
	function makeid() {
		var text = "";
		var possible = "0123456789";
		for (var i = 0; i < 4; i++)
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		return text;
	}
	var newPass=makeid();
	mongoose.model('users').findOne({
		email:email
	}, (function(err, adminResult) {
		var userdata=[adminResult];
		if (adminResult!=null) {
			adminResult.update({
				password:newPass,
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
					res.format({
						json: function() {
							res.json(adminResult);
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

//Create new user account//
router.post('/addUser', function(req, res) {
	console.log("inside addUser");
	var userId = shortid.generate();
	var userName = req.body.userName;
	var userType= req.body.userType;
	var email = req.body.email;
	var password = req.body.password;
	var noOfQue = req.body.noOfQue;
    var noOfAns = req.body.noOfAns;
	var mobileNo = req.body.mobileNo;
	var address = req.body.address;
	var education= req.body.education;
	var certification= req.body.certification;
	var work= req.body.work;
	var topicInterest= req.body.topicInterest;
	var createdDate = new Date();
	var updatedDate = new Date();
	mongoose.model('users').findOne({
		mobileNo: mobileNo,
	}, function(err, result) {
		if (result!=null) {
			res.format({
				json: function() {
					res.json([{
						success: false,
						msg: "This MobileNo already exist."
					}]);
				}
			});
		}else{
			mongoose.model('users').create({
				userId : userId,
				userName:userName,
				mobileNo: mobileNo,
				email: email,
				password: password,
				address: address,
				noOfQue: noOfQue,
				noOfAns: noOfAns,
				language: "English",
				education:education,
				certification:certification,
				work:work,
				topicInterest:topicInterest,
				userStatus: "Active",
				userType: userType,
				level:0,
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

//Get user by userId //
router.post('/getUserById', function(req, res) {
    console.log("inside getUserById");	
 	var userId=req.body.userId;
	mongoose.model('users').findOne({
		userId:userId
	}, (function(err, userResult) {
		var userdata=[userResult];
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
					res.json(userdata);
				}
			});
		}
	}));
});

//Get Grops by userId //
router.post('/getGroupByUserId', function(req, res) {
	console.log("inside getGroupByUserId");
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
			userdata=userResult.expertIn;
			if (userResult!=null) {
				if(userdata.length>0){
				var groupdatas=[];
				for (var i = 0;i < userdata.length;i++) {
					mongoose.model('group').findOne({
		                groupId:userdata[i]
					}, function(err,Result){
				
					    groupdatas.push(Result)
                        if(groupdatas.length==userdata.length){
                         res.format({
			         	json: function() {
			    		res.json(groupdatas);
			    	}
			    });
           }

			})    
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
});


// get user by user id //
router.get('/:userId/getUser', function(req, res) {
	console.log("inside getUser");
	mongoose.model('users').find({
		userId:req.userId
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
	}).sort({
		_id : -1
	});
});

// Get user by user name//
router.get('/:userName/getUserByName', function(req, res) {
	console.log("inside getUserByName");
	var userName=req.userName;
	mongoose.model('users').findOne({
		userName:userName
	}, (function(err, userResult) {
		var userdata=[userResult];
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
					res.json(userdata);
				}
			});
		}
	}));
});

//Delete a Single user(This API is useful for deleting single user from users collection)
router.post('/:userId/deleteSingluser', function(req, res) {
	console.log("inside deleteSingluser");
	mongoose.model('users').remove({
		userId: req.userId,
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

// Delete user by Name //
router.post('/:userName/deleteUserByName', function(req, res) {
	console.log("inside deleteUserByName");
	var userName=req.userName;
	mongoose.model('users').remove({
		userName:userName
	}, (function(err, userResult) {
		var userdata=[userResult];
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
					res.json(userResult);
				}
			});
		}
	}));
});

// Update user by user id //
router.post('/updateUserProfileById', function(req, res) {
	console.log("inside updateUserProfileById");
	var userId=req.body.userId;
	var userName=req.body.userName;
	var userImage= req.body.userImage;
	var expertIn = req.body.expertIn;
	var userType=req.body.userType;
	var email=req.body.email;
	var password = req.body.password;
	var userStatus=req.body.userStatus;
	var mobileNo=req.body.mobileNo;
	var address=req.body.address;
	var education= req.body.education;
	var certification= req.body.certification;
	var work= req.body.work;
	var queCount = req.body.queCount;
	var ansCount = req.body.ansCount;
	var status = req.body.status;
	var language = req.body.language;
	var emailVerified=req.body.emailVerified;
	var topicInterest= req.body.topicInterest;
    // For Add Credential
    var companyName= req.body.companyName;
    var position= req.body.position;
    var startYear= req.body.startYear;
    var endYear= req.body.endYear;
    var graduationYear= req.body.graduationYear;
    var degreeType= req.body.degreeType;
    var college= req.body.college;
    var locationStartYear=req.body.locationStartYear;
    var locationEndYear=req.body.locationEndYear;
    var currentWork=req.body.currentWork;
    var defaultLanguage=req.body.defaultLanguage;
    var specialization=req.body.specialization;
	mongoose.model('users').findOne({
		userId:userId
	}, (function(err, userResult) {
        var userName = ((req.body.userName!=null && req.body.userName!=undefined && req.body.userName!="") ? req.body.userName : userResult.userName);
        var email = ((req.body.email!=null && req.body.email!=undefined && req.body.email!="") ? req.body.email : userResult.email);
        var password = ((req.body.password!=null && req.body.password!=undefined && req.body.password!="") ? req.body.password : userResult.password);
		var userStatus = ((req.body.userStatus!=null && req.body.userStatus!=undefined && req.body.userStatus!="") ? req.body.userStatus : userResult.userStatus);
		var mobileNo = ((req.body.mobileNo!=null && req.body.mobileNo!=undefined && req.body.mobileNo!="") ? req.body.mobileNo : userResult.mobileNo);
        var address = ((req.body.address!=null && req.body.address!=undefined && req.body.address!="") ? req.body.address : userResult.address);
        var education = ((req.body.education!=null && req.body.education!=undefined && req.body.education!="") ? req.body.education : userResult.education);
		var certification = ((req.body.certification!=null && req.body.certification!=undefined && req.body.certification!="") ? req.body.certification : userResult.certification);
        var work = ((req.body.work!=null && req.body.work!=undefined && req.body.work!="") ? req.body.work : userResult.work);
        var topicInterest = ((req.body.topicInterest!=null && req.body.topicInterest!=undefined && req.body.topicInterest!="") ? req.body.topicInterest : userResult.topicInterest);
		var userType = ((req.body.userType!=null && req.body.userType!=undefined && req.body.userType!="") ? req.body.userType : userResult.userType);
        var language = ((req.body.language!=null && req.body.language!=undefined && req.body.language!="") ? req.body.language : userResult.language);
		var status = ((req.body.status!=null && req.body.status!=undefined && req.body.status!="") ? req.body.status : userResult.status);
		var userImage = ((req.body.userImage!=null && req.body.userImage!=undefined && req.body.userImage!="") ? req.body.userImage : userResult.userImage);
		var expertIn = ((req.body.expertIn!=null && req.body.expertIn!=undefined && req.body.expertIn!="") ? req.body.expertIn : userResult.expertIn);
        var emailVerified = ((req.body.emailVerified!=null && req.body.emailVerified!=undefined && req.body.emailVerified!="") ? req.body.emailVerified : userResult.emailVerified);
		
        var companyName = ((req.body.companyName!=null && req.body.companyName!=undefined && req.body.companyName!="") ? req.body.companyName : userResult.companyName); 
        var position = ((req.body.position!=null && req.body.position!=undefined && req.body.position!="") ? req.body.position : userResult.position);
        var graduationYear = ((req.body.graduationYear!=null && req.body.graduationYear!=undefined && req.body.graduationYear!="") ? req.body.graduationYear : userResult.graduationYear);
        var degreeType = ((req.body.degreeType!=null && req.body.degreeType!=undefined && req.body.degreeType!="") ? req.body.degreeType : userResult.degreeType);
        var startYear = ((req.body.startYear!=null && req.body.startYear!=undefined && req.body.startYear!="") ? req.body.startYear : userResult.startYear);
        var endYear = ((req.body.endYear!=null && req.body.endYear!=undefined && req.body.endYear!="") ? req.body.endYear : userResult.endYear);
        var college = ((req.body.college!=null && req.body.college!=undefined && req.body.college!="") ? req.body.college : userResult.college);
        var locationEndYear = ((req.body.locationEndYear!=null && req.body.locationEndYear!=undefined
        	&& req.body.locationEndYear!="") ? req.body.locationEndYear : userResult.locationEndYear);
        var locationStartYear = ((req.body.locationStartYear!=null && req.body.locationStartYear!=undefined 
        	&& req.body.locationStartYear!="") ? req.body.locationStartYear : userResult.locationStartYear);
        var currentWork = ((req.body.currentWork!=null && req.body.currentWork!=undefined 
        	&& req.body.currentWork!="") ? req.body.currentWork : userResult.currentWork);
		 var defaultLanguage = ((req.body.defaultLanguage!=null && req.body.defaultLanguage!=undefined 
        	&& req.body.defaultLanguage!="") ? req.body.defaultLanguage : userResult.defaultLanguage);

        var specialization = ((req.body.specialization!=null && req.body.specialization!=undefined 
        	&& req.body.specialization!="") ? req.body.specialization : userResult.specialization);	

		var userdata=[userResult];
		if (userResult!=null) {
			userResult.update({
				userName:userName,
				email:email,
				password:password,
				mobileNo:mobileNo,
				address:address,
				education:education,
				certification:certification,
				work:work,
				expertIn:expertIn,
				status: status,
				userImage: userImage,
				topicInterest:topicInterest,
				userStatus:userStatus,
				userType:userType,
				emailVerified:emailVerified,
                companyName:companyName,
                position:position,
                graduationYear:graduationYear,
                degreeType:degreeType,
                startYear:startYear,
                endYear:endYear, 
                college:college, 
                locationStartYear:locationStartYear,
                locationEndYear:locationEndYear,
                currentWork:currentWork,
                defaultLanguage:defaultLanguage,
                specialization:specialization,
				language:language
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
					var msg =[{
						success: true,
						updateProfile: true,
						emailVerified: true,
						msg: "Updated successfully"
					}];
					res.format({
						json: function() {
							res.json(msg);
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

// Total user count //
router.get('/UserCount', function(req, res) {
	console.log("count emps ");
	mongoose.model('users').count({userStatus:'Enabled'}, (function(err, users) {
		res.format({
			json: function() {
				res.json(users);
			}
		});
	}))
});

//to Enable/Disable users(For updating user profile informations)
router.post('/:userId/:changeUserStatus', function(req, res) {
	console.log("inside changeUserStatus");
	var userId=req.userId;
	var userStatus = req.body.userStatus;
	var newStatus;
	mongoose.model('users').findOne({
		userId:userId,
	}, function(err, result) {
		if (err) {
			console.log(err);
		} else {
			if (result != null) {
				if (userStatus == "Enabled") {
					newStatus = "Disabled"
				} else {
					newStatus = "Enabled"
				};
				result.update({
					userStatus: userStatus
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

// get user image from uploads folder //
router.get('/getUserImg/:imageName', function(req, res) {
	console.log("inside getUserImg");
	var imageName = req.imageName;
	var http = require('http');
	var fs = require('fs');
	var path = '/home/ec2-user/baduga/uploads/UserImg/'+imageName;
	fs.readFile(path, function(err, data) {
		res.writeHead(200, {'Content-Type': 'image/jpeg'});
		res.end(data);
	});
});

function sendOTP (email,otp) {
    var request = require('request');
    var uname="20170715";
    var pass="^RDj726";
    var addValuri="Your OTP for login into Baduga is "+otp;
    var encoded = encodeURI(addValuri);
    var cmpltUri="http://103.247.98.91/API/SendMsg.aspx?uname="+uname+"&pass="+pass+"&send=BLCRSR&dest="+email+"&msg="+encoded
    request(cmpltUri, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body) 
        }
    })  
}

// validate opt //
router.post('/validateOTP', function(req, res) {
    console.log("inside validateOTP");
    var OTP = req.body.OTP;
    var userId = req.body.userId;
	console.log("userId "+userId);
	console.log("OTP "+OTP);
    mongoose.model('users').findOne({
        userId:userId,
        OTP:OTP
    }, (function(err, empOTP) {
    	console.log("dj "+empOTP);
    	if (empOTP !=null) {
    		var OTPresobj = new Object();
            OTPresobj.success = true;
            var msg =[{
                success: true,
                otpSend: true,
                msg: "Verify successfully.",
                userId: empOTP.userId
            }];
            res.format({
				json: function() {
					res.json(msg);
				}
			});
        } else {
            var msg =[{
                success: false,
                msg: "OTP authentication failed Please enter valid OTP."
            }];
            res.format({
                json: function() {
                    res.json(msg);
                }
            });
        }
    }));
});


// for facebook login //
router.post('/fbLogin', function(req, res) {
    console.log("inside fb login function");
    var userImage = req.body.userImage;
    var userId = shortid.generate();
    var email = req.body.email;
    var email = email.toLowerCase();
    var userName = req.body.userName;
    var gender = req.body.gender;
    var socialId = req.body.socialId;
    var provider = "Facebook";
    var userStatus = "Enabled";
    var userType = "Premium";
    mongoose.model('users').findOne({
        email: email,
    }, (function(err, existUser) {
        if (existUser!=null) {
            existUser.update({
             socialId:socialId,
             userName:userName,
             userStatus:userStatus,
             gender:gender,
             provider:provider,
             userImage:userImage
            }, (function(err, updtedUser) {
            if (err) {
                msg: "There is a problem to updating information of this user. Please try again."
                res.format({
                    json: function() {
                        res.json(msg);
                    }
                });
            }else{
            	var msg = [{
                    success: true,
                    msg: "Data updated successfully.",
                    userId:existUser.userId,
                    userName:existUser.userName,
                    provider:existUser.provider,
                    email:existUser.email,
                    userImage:existUser.userImage,
                    userType:existUser.userType
                }];
            	res.format({
                    json: function() {
                        res.json(msg);
                    }
                });
            }
        }));
        }else{
          mongoose.model('users').create({
              userId:userId,
              socialId:socialId,
              userName:userName,
              email: email,
              userStatus:userStatus,
              userType:userType,
              gender:gender,
              provider:provider,
              userImage:userImage
          }, (function(err, usersResult) {
            if (err) {
                var msg = [{
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
                        res.json([usersResult]);
                    }
                });
            }
        }));
      }
  }));
});

// for google login //
router.post('/GoogleLogin', function(req, res) {
    console.log("inside Google login function");
    var userId = shortid.generate();
    var email = req.body.email;
    var email = email.toLowerCase();
    var userName = req.body.userName;
    var gender = req.body.gender;
    var socialId = req.body.socialId;
    var provider = "Google";
    var userStatus = "Enabled";
    var userType = "Premium";
    var userImage = req.body.userImage;
    console.log("userImage "+userImage);
    if(userImage=="null"){
      userImage="http://35.154.169.9:4130/users/getUserImg/default.png";
    }   

    mongoose.model('users').findOne({
        email: email,
    }, (function(err, existUser) {
        if (existUser!=null) {
            existUser.update({
             socialId:socialId,
             userName:userName,
             userStatus:userStatus,
             userType:userType,
             gender:gender,
             provider:provider,
             userImage:userImage
         }, (function(err, updtedUser) {
            if (err) {
                msg: "There is a problem to updating information of this user. Please try again."
                res.format({
                    json: function() {
                        res.json(msg);
                    }
                });
            }else{
            	var msg = [{
                    success: true,
                    msg: "Data updated successfully.",
                    userId:existUser.userId,
                    userName:existUser.userName,
                    provider:existUser.provider,
                    email:existUser.email,
                    language:existUser.language,
                    userImage:existUser.userImage,
                    userType:existUser.userType
                }];
            	res.format({
                    json: function() {
                        res.json(msg);
                    }
                });
            }
        }));
        }else{
          mongoose.model('users').create({
              userId:userId,
              socialId:socialId,
              userName:userName,
              email: email,
              userStatus:userStatus,
              userType:userType,
              gender:gender,
              provider:provider,
              userImage:userImage
          }, (function(err, usersResult) {
            if (err) {
                var msg = [{
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
                        res.json([usersResult]);
                    }
                });
            }
        }));
      }
  }));
});


//Api for get following users //
router.post('/getFollowingUsers', function(req, res) {
    console.log("inside getFollowingUsers");
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
			userdata=userResult.following;
      if (userResult!=null) {
      	if(userdata.length>0){
      		var groupdatas=[];
      		for (var i = 0;i < userdata.length;i++) {
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

//For the followers user //
router.post('/getFollowerUsers', function(req, res) {
    console.log("inside getFollowerUsers");
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
			userdata=userResult.followers;
      // userdata.push({'userId':userId});
      if (userResult!=null) {
      	if(userdata.length>0){
      		var groupdatas=[];
      		for (var i = 0;i < userdata.length;i++) {
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

/////////////////////////////////////////////All Changed API from 26 march 2018//////////////////////////////////////////// 

//// Sign in for existing user ///
router.post('/signIn', function(req, res) {
	console.log("inside signIn");
	var email = ""+req.body.email;
	var password = req.body.password;
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
		          	defaultLanguage: usrResult.defaultLanguage, 
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

////Sign up for new user///
router.post('/signUp', function(req, res) {
	console.log("inside signUp");
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

////Submit feedback by existing user////
router.post('/submitFeedback', function(req, res) {
	console.log("inside submitFeedback");
	var userId = req.body.userId;
	var feedback=req.body.feedback;
	createdDate=new Date();
	mongoose.model('feedback').create({
		userId:userId,
		feedback:feedback
	}, (function(err, result) {
		if(err){
			res.format({
				json: function() {
					res.json([{
						success: false,
						msg: "Something went wrong"
					}]);
				}
			});
		}else{
			res.format({
				json: function() {
					res.json([{
						success: true,
						msg: "Thanks for your feedback"
					}]);
				}
			});
		}
	}))
});

//// Send verificaiton code for forgot password ////
router.post('/verifyEmail', function(req, res) {
	console.log("inside verifyEmail");
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
		var userdata=[adminResult];
		var userId = adminResult.userId;
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

// Get all users //
router.get('/:language/getAllUser', function(req, res) {
  	var language = req.language;
 	 mongoose.model('users').find({
      language: language
  	}, function(err, result) {
	    res.format({
	      	json: function() {
	      	  	res.json(result);
	     	}
	    });
  	});
});

//for the users email verify
router.post('/verifyUserEmail', function(req, res) {
	console.log("Inside verify user Email");
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
		var userdata=[adminResult];
		var userId = adminResult.userId;
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
		} else {
			console.log('Email sent: ' + info.response);
		}
	});
}

/// funciton for user email verification///
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
		} else {
			console.log('Email sent: ' + info.response);
		}
	});
}

//// Remove tocken id from usertokens collection ////
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

//// Add user token to usertokens collection ////
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


//// OPT validation /////
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

//// Follow people ////
router.post('/followPeople', function(req, res) {
	var userId=req.body.userId;
	var followUserId=req.body.followUserId;
	var index;
	var message;
	var sendNoti=false;
	console.log("rj userId "+userId+" follow userId "+followUserId);
	mongoose.model('users').findOne({
		userId:userId,
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
              following.splice(index,1);
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

//Optimize follow peaple api
router.post('/optFollowPeople', function(req, res) {
	var userId=req.body.userId;
	var followUserId=req.body.followUserId;
	var message;
	var sendNoti=false;
	var peopleFollow=false;
	 var followingCount;
	mongoose.model('users').findOne({
		userId:userId,
	}, (function(err, userResult) {
        if(userResult!=null){
        	var following=[];
        	following=userResult.following;
        	if(following.length>0){
              if(checkValue(followUserId, following)){
              following.remove(followUserId);
              peopleFollow=false;
            }else{ 
          		message=" is now following you";
          		following.push(followUserId);
          		sendNoti=true;   
          		peopleFollow=true;             
          	}
        }else{
      		message=" is now following you";
      		following.push(followUserId);
      		sendNoti=true;
      		peopleFollow=true
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
        		 followingCount=userResult.following.length;
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
	}, (function(err, userResult) {
	console.log("rj result  3 "+userResult);
	if(userResult!=null){
		var follwers=[];
		follwers=userResult.followers;
		if(follwers.length>0){
			
			if(checkValue(userId, follwers)){
				follwers.remove(userId);

			}else{ 
				follwers.push(userId);                
			}
		}else{
				follwers.push(userId);
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
        			// var followingCount=following.length;
        			res.format({
        				json: function() {
        					res.json([{success : true,
        						peopleFollow:peopleFollow,
        						followingCount:followingCount,
        						msg: "Data inserted successfully"}]);
        				}
        			});
        		}
        	}));
    }));
});

//
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
//Optimize get four users
router.get('/:userId/optGetTopUsers', function(req, res) {
	console.log("inside getTopUsers")
	 var userId=req.userId;
	 var resArr=[];
	 var localArray=[];
     var flage=false;
	mongoose.model('users').find({
	}, function(err, result) {
        if(result.length>0){
           for(var i=0;i<result.length;i++){
               var localUserId=result[i].userId;
               if(localUserId!=userId){
                   localArray.push(result[i]);
                }
           }// end for block  

         if(localArray.length>0){
             
                      for(var k=0;k<localArray.length;k++){
                       var userArr=[];
                       userArr=localArray[k].followers;
                     // console.log("check userId "+upVotedarr.contains("Hk27RrHdM"));
                     if(userArr.contains(userId)){
                      flage=true;
                     }else{
                      flage=false;
                     }
                   //Construct obj for like flage
                   var obj={
                      userName:localArray[k].userName,
                      userImage:localArray[k].userImage,
                      userId:localArray[k].userId,
                      peopleFollow:flage,
                      followers:localArray[k].followers
                     };

                     resArr.push(obj);
                } 
            console.log("response arr "+resArr.length);
           	res.format({
			json: function() {
				res.json(resArr);
		     	 }
		     });
          }

        }//end if block
	}).sort({
		_id : -1
	}).limit(5);
});

//Optimize for getFollowing user
router.post('/optGetFollowingUsers', function(req, res) {
    console.log("inside getFollowingUsers");
	var userId=req.body.userId;
	 var resArr=[];
     var flage=false;
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
      if (userResult!=null) {
      	if(userdata.length>0){
      		var groupdatas=[];
      		for (var i = 0;i < userdata.length;i++) {
      			mongoose.model('users').findOne({
      				userId:userdata[i]
      			}, function(err,Result){
      				groupdatas.push(Result)
      				if(groupdatas.length==userdata.length){
      					
					   for(var k=0;k<groupdatas.length;k++){
					   	if(groupdatas[k]!=null){ 
			                       var userArr=[];
			                       console.log(" rj following");
			                       console.log(groupdatas[k]);
			                       userArr=groupdatas[k].followers;
			                     // console.log("check userId "+upVotedarr.contains("Hk27RrHdM"));
			                     if(userArr.contains(userId)){
			                      flage=true;
			                     }else{
			                      flage=false;
			                     }
			                   //Construct obj for like flage
			                   var obj={
			                      userName:groupdatas[k].userName,
			                      userImage:groupdatas[k].userImage,
			                      userId:groupdatas[k].userId,
			                      peopleFollow:flage,
			                      followers:groupdatas[k].followers
			                     };

			                     resArr.push(obj);
			                 }
			                }


      					res.format({
      						json: function() {
      							res.json(resArr.sort());
      						}
      					});
      				}   
         }).sort({_id:-1});}//end forloop
      		}else{
      			// var msg =[{
      			// 	success: false,
      			// 	msg: "Something went wrong. Please try again."
      		 //  }];
      			res.format({
      				json: function() {
      					res.json([]);
      				}
      			});
      		}
      	}
      }
  });
});

//Opt Follower user 
router.post('/optGetFollowerUsers', function(req, res) {
    console.log("inside getFollowerUsers");
	var userId=req.body.userId;
	 var resArr=[];
     var flage=false
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
      if (userResult!=null) {
      	if(userdata.length>0){
      		var groupdatas=[];
      		for (var i = 0;i < userdata.length;i++) {
      			mongoose.model('users').findOne({
      				userId:userdata[i]
      			}, function(err,Result){
      				groupdatas.push(Result)
      				if(groupdatas.length==userdata.length){
      					
 						  for(var k=0;k<groupdatas.length;k++){
			                     if(groupdatas[k]!=null){ 
			                       var userArr=[];
			                       userArr=groupdatas[k].followers;
			                     // console.log("check userId "+upVotedarr.contains("Hk27RrHdM"));
			                     if(userArr.contains(userId)){
			                      flage=true;
			                     }else{ 
			                      flage=false;
			                     }
			                   //Construct obj for like flage
			                   var obj={
			                      userName:groupdatas[k].userName,
			                      userImage:groupdatas[k].userImage,
			                      userId:groupdatas[k].userId,
			                      peopleFollow:flage,
			                      followers:groupdatas[k].followers
			                     };

 			                     resArr.push(obj);
                                }
			                }


      					res.format({
      						json: function() {
      							res.json(resArr.sort());
      						}
      					});

      				}   
         }).sort({_id:-1});}//end forloop
      		}else{
      			// var msg =[{
      			// 	success: false,
      			// 	msg: "Something went wrong. Please try again."
      			// }];
      			res.format({
      				json: function() {
      					res.json([]);
      				}
      			});
      		}
      	}
      }
  });
}); 

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

//opt getUser
router.get('/:userId/:id/optGetUser', function(req, res) {
	console.log("inside getUser");
	  var userId=req.userId;
	  var resArr=[];
      var flage=false;
      var myId=req.id;
	mongoose.model('users').find({
		userId:req.userId
	}, function(err, result) {
		if (err) {
			console.log('GET Error: There was a problem retrieving: ' + err);
		} else {

          
             if(result.length>0){
             
                      for(var k=0;k<result.length;k++){
                       var userArr=[];
                       userArr=result[k].followers;
	                     if(userArr.contains(myId)){
	                      flage=true;
	                     }else{
	                      flage=false;
	                     }
                   //Construct obj for like flage
                   var obj={
		                  userName:result[k].userName,
		                  userImage:result[k].userImage,
		                  userId:result[k].userId,
		                  peopleFollow:flage,
		                  followers:result[k].followers,
	                  	language:result[k].language,
	                    address:result[k].address,
	                    mobileNo:result[k].mobileNo,
	                    email:result[k].email,
	                    work:result[k].work,
	                    education:result[k].education,
	                    notificationFlag:result[k].notificationFlag,
	                    ansCount:result[k].ansCount,
	                    queCount:result[k].queCount,
	                    topicInterest:result[k].topicInterest
                     };

                     resArr.push(obj);
                } 
            console.log("response arr "+resArr.length);
           	res.format({
			json: function() {
				res.json(resArr);
		     	 }
		     });
          }

		}
	}).sort({
		_id : -1
	});
});

//Abessive report api
router.post('/submitUserReport', function(req, res) {
    var userId = req.body.userId;
    var userName="";
    var userImage="";
    var createdDate=new Date();
    var abusiveUserName = req.body.abusiveUserName;
	var abusiveUserId = req.body.abusiveUserId;
	var abusiveText = req.body.abusiveText;
	var abusiveUserImage = req.body.abusiveUserImage;
    var language = req.body.language;
 mongoose.model('users').findOne({
    userId:userId
  }, (function(err, result) {
     if(result!=null){
      mongoose.model('userreport').create({
       userId:userId,
       userName:result.userName,
       userImage:result.userImage,
       createdDate:createdDate,
       abusiveUserName:abusiveUserName,
       abusiveUserId:abusiveUserId,
       abusiveText:abusiveText,
       language:language,
       abusiveUserImage:abusiveUserImage
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

//User block api
//Optimize bookmarked category api 
router.post('/userBlocked', function(req, res) {
  console.log("Inside userBlocked ");
  var userId=req.body.userId;
  var blockUserId=req.body.blockUserId;
  // var bookmarked = false;

  mongoose.model('users').findOne({
    userId:userId,
  }, (function(err, userResult) {
    if(userResult!=null){
      var arrUserBlocked=[];
      var following=[];
      arrUserBlocked=userResult.arrUserBlocked;
      following=userResult.arrUserBlocked;

      if(arrUserBlocked.length>0){
        
            if(arrUserBlocked.contains(blockUserId)){
              arrUserBlocked.remove(blockUserId);
              addFollowing(userId,blockUserId);
              // bookmarked = false;
            }else{  
              arrUserBlocked.push(blockUserId);                
              // bookmarked = true;
               removeFollowing(userId,blockUserId);
            }
          }else{
           arrUserBlocked.push(blockUserId);
           removeFollowing(userId,blockUserId);
           // bookmarked = true;
         }
        }//end block result 

        var obj={'arrUserBlocked':arrUserBlocked}
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
              var msg =[{
            success: true,
            msg: "User blocked successfully" }];
            res.format({
              json: function() {
                res.json(msg);
              }
            });
         }
       }));
      }));
     //for the group followers
    //  mongoose.model('category').findOne({
    //   categoryId:categoryId,
    // }, (function(err, userResult) {
    //   if(userResult!=null){
    //     var bookMarkCategory=[];
    //     bookMarkCategory=userResult.bookMarkCategory;
    //     if(bookMarkCategory.length>0){
     
    //     if(checkValue(userId, bookMarkCategory)){
    //       bookMarkCategory.remove(userId);
    //     }else{ 
    //       bookMarkCategory.push(userId);                
    //     }
    //   }else{
    //      bookMarkCategory.push(userId);
    //    }
    //     }//end block result 
    //     var obj={'bookMarkCategory':bookMarkCategory}
    //     userResult.update(obj,(function(err, updateResult) {
    //      if(err){
    //        var msg =[{
    //         success: false,
    //         msg: "Something went wrong. Please try again." }];
    //         res.format({
    //           json: function() {
    //             res.json(msg);
    //           }
    //         });
    //       }else{        
    //        res.format({
    //          json: function() {
    //           res.json([{success : true,
    //            bookmarked:bookmarked,
    //            msg: "category bookmarked successfully"}]);
    //         }
    //       });
    //      }
    //    }));
    //   }));
  });

//Function remove user from following
function removeFollowing(userId,followUserId){  
  mongoose.model('users').findOne({
		userId:userId,
	}, (function(err, userResult) {
        if(userResult!=null){
        	var following=[];
        	following=userResult.following;
            if(following.length>0){
               if(following.contains(followUserId)){
                  following.remove(followUserId);
               }
            }	
         }

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

        	}
        }));
    }));

	//for the follwers
	mongoose.model('users').findOne({
		userId:followUserId,
	}, (function(err, userResult) {
	console.log("rj result  3 "+userResult);
	if(userResult!=null){
		var follwers=[];
		follwers=userResult.followers;
		if(follwers.length>0){
			
           if(follwers.contains(userId)){
              follwers.remove(userId);
           }

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
        			console.log("success");
        		}
        	}));
    }));
}

//Fucntion add following
function addFollowing(userId,followUserId){

  mongoose.model('users').findOne({
		userId:userId,
	}, (function(err, userResult) {
        if(userResult!=null){
        	var following=[];
        	following=userResult.following;
            if(following.length>0){
               if(!following.contains(followUserId)){
                  following.push(followUserId);
               }
            }	
         }

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

        	}
        }));
    }));

	//for the follwers
	mongoose.model('users').findOne({
		userId:followUserId,
	}, (function(err, userResult) {
	console.log("rj result  3 "+userResult);
	if(userResult!=null){
		var follwers=[];
		follwers=userResult.followers;
		if(follwers.length>0){
			
           if(!follwers.contains(userId)){
              follwers.push(userId);
           }

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
        			console.log("success");
        		}
        	}));
    }));


} 

module.exports = router;