const router=require('express').Router();
const passport=require('passport');


router.get('/login',
    passport.authenticate("google",{
        scope:['profile','email',],
        accessType: 'offline',
        prompt: 'consent',
    })
)
router.get('/google_redirect',passport.authenticate('google',{failureRedirect:'https://scholaratlas.com/login/student'}),(req,res)=>{
    console.log("my session"+req.user);
    res.redirect(`http://scholaratlas.com/googlelogin/${req.user.email}/${req.user.name}/${req.user._id}`);
})

module.exports={router};
