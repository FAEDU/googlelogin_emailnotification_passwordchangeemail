const mongoose = require('mongoose');

const db_url = "mongodb://googlelogin:suab123@ds127825.mlab.com:27825/googlelogin_users_foreignadmits";
mongoose.connect(db_url).catch(err => console.log(err));

const google_schema=new mongoose.Schema({name:String, email:String })
const google_model=mongoose.model("google_model",google_schema);

const meeting_schema=new mongoose.Schema({email:String,date:String,time:String});

const unviversity_schema=new mongoose.Schema({
    uni_id:String,
    count:{type:Number,default:0}
})
const university_model=mongoose.model("university",unviversity_schema);

const meeting_model=mongoose.model("meeting",meeting_schema);
module.exports = {
    database_google:google_model,
    meeting_model,
    university_model
}