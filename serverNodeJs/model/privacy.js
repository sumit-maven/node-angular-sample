var mongoose = require('mongoose');  
var privacySchema = new mongoose.Schema({  
	userId:String,
	policy1:String,
	policy2:String,
	policy3:String,
	policy4:String,
	policy5:String,
	policy6:String,
	policy7:String,
	policy8:String,
	policy9:String,
	language:String,
	createdDate: Date,
	updatedDate: Date
});
mongoose.model('privacy', privacySchema,'privacy');