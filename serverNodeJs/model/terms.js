var mongoose = require('mongoose');  
var termsSchema = new mongoose.Schema({  
	description:String,
	language: String
});
mongoose.model('terms', termsSchema,'terms');