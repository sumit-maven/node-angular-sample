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

router.param('modId', function(req, res, next, modId) {
  req.modId = modId;
  next();
});

router.param('groupId', function(req, res, next, groupId) {
  req.groupId = groupId;
  next();
});

router.param('modName', function(req, res, next, modName) {
  req.modName = modName;
  next();
});

router.param('imageName', function(req, res, next, imageName) {
  req.imageName = imageName;
  next();
});

//Create Moderator account//
router.post('/addModerator', function(req, res) {
  console.log("inside add moderator api");
  var groupId = req.body.groupId;
  var userId = req.body.userId;
  var modId = shortid.generate();
  var modName = req.body.modName;
  var categoryName = req.body.categoryName;
  var email = req.body.email;
  var password=req.body.password;
  var assignedGrps=req.body.assignedGrps;
  var modStatus=req.body.modStatus;
  var createdDate = new Date();
  var updatedDate = new Date();
  mongoose.model('moderator').findOne({
    email: email,
  }, function(err, result) {
    if (result!=null) {
      res.format({
        json: function() {
          res.json([{
            success: false,
            msg: "This Email already exist."
          }]);
        }
      });
    }else{
      mongoose.model('moderator').create({
        groupId:groupId,
        userId:userId,
        modId:modId,
        modName:modName,
        email:email,
        password:password,
        categoryName:categoryName,
        assignedGrps:assignedGrps,
        modStatus:modStatus,
        createdDate:createdDate,
        updatedDate:updatedDate
      }, function(err, result) {
        if (err) {
         res.format({
          json: function() {
            res.json(result);
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
    }
  })
});

// Get all Group//
router.get('/getAllMods', function(req, res) {
  console.log("inside getAllMods ");
  mongoose.model('moderator').find({
  }, function(err, result) {
    res.format({
      json: function() {
        res.json(result);
      }
    });
  });
});


// get mod by mod id //
router.post('/getModById', function(req, res) {
  console.log("inside get moderator by id");
  var modId=req.body.modId;
  console.log("modId "+modId);
  mongoose.model('moderator').findOne({
    modId:modId
  }, function(err, result) {
    res.format({
      json: function() {
        res.json(result);
      }
    });
  });
});

// search moderator //
router.post('/searchModerator', function(req, res) {
  console.log("inside searchModerator");
  var modName=req.body.modName;
  mongoose.model('moderator').find({ 
    modName:new RegExp(modName, 'i')
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

//Delete a Single moderator(This API is useful for deleting single user from moderator collection)
router.post('/:modId/deleteSinglmod', function(req, res) {
  console.log("inside deleteSinglmod");
  mongoose.model('moderator').remove({
    modId: req.modId,
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

// Total group count //
router.get('/countAllModerator', function(req, res) {
  console.log("inside countAllModerator");
  mongoose.model('moderator').count({}, (function(err, moderator) {
    res.format({
      json: function() {
        res.json(moderator);
      }
    });
  }))
});

module.exports = router;