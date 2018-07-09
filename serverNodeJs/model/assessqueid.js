var mongoose = require('mongoose');  
var assessqueidSchema = new mongoose.Schema({  
  assessmentId : String,
  language:String,
  questionId : Array,
});
mongoose.model('assessqueid', assessqueidSchema, 'assessqueid');
