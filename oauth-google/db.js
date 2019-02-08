const mongoose = require('mongoose');

const db_url = "mongodb://abhi980:suab123@ds026898.mlab.com:26898/fadmits";
mongoose.connect(db_url).catch(err => console.log(err));

const google_schema=new mongoose.Schema({name:String, email:String })
const google_model=mongoose.model("google_model",google_schema);

const meeting_schema=new mongoose.Schema({email:String,date:String,time:String});

const meeting_model=mongoose.model("meeting",meeting_schema);
module.exports = {
    database_google:google_model,
    meeting_model
}