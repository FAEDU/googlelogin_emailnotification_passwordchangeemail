const google=require('passport-google-oauth20').Strategy;
const passport=require('passport');
const {database_google}=require('./db');
const axios=require('axios');

passport.serializeUser((user,done)=>{
    done(null,user.id);
})

passport.deserializeUser((id,done)=>{
    database_google.findById({_id:id}).then(user=>{done(null,user)}).catch(err=>console.log(err))
})
passport.use(new google({
    callbackURL:"/google/google_redirect",
    clientID:"921118557266-dn6ccbp19ojg6np1ulp8ioj6vced6r97.apps.googleusercontent.com",
    clientSecret:"nsiq3NTEmZjfTtibJpi0A1fV"
},
(accessToken,refreshToken,profile,done)=>{
    console.log("accesstoken"+accessToken)
    console.log("refreshtoken"+refreshToken)
    database_google.findOne({email:profile.emails[0].value}).then(user=>{
        if(user){
            console.log(`database ${user}`)
            done(null,user);
        }
        else{
            const db=new database_google;
            db.email=profile.emails[0].value;
            db.name=profile.displayName;
            db.google_id=profile.id
            db.save().then(user=>{
                console.log(`new user ${user}`)
                done(null,user)
                axios.post("https://arcane-ocean-14843.herokuapp.com/api/UserSignUps",{email:user.email,Name:user.name})
                .then(res=>console.log("saved data is"+res.data));
            }).catch(err=>console.log(err));
        }
    })
  }
))




