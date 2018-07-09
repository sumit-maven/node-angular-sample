var mongoose = require('mongoose');  
var articalsSchema = new mongoose.Schema({  
	userId:String,
	articalType:String,
	articalText : String,
	email:String,
	language:String,
	createdDate: Date,
	updatedDate: Date
});
mongoose.model('articals', articalsSchema,'articals');