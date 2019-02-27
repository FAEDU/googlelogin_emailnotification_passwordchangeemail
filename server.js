const session=require('cookie-session');
const express=require('express');
const app=express();
const {router}=require('./oauth-google/route');
const google_authentication=require('./oauth-google/config')
const {database_google}=require('./oauth-google/db');
const passport=require('passport');
const nodemailer=require('nodemailer');
const {meeting_model}=require('./oauth-google/db')
const bodyparser=require('body-parser');
const cron=require('node-cron');
const datetime=require('node-datetime');
const axios=require('axios');
const cors=require('cors')

app.use(cors())
app.use(session({key:'user_sid',secret:"suab321",resave:false,saveUninitialized:false,cookie:{maxAge:1000*60*60}}))
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('views'));
app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json());
app.use('/google',router);

//nodemailer Code



const transporter=nodemailer.createTransport({
    service:'gmail',
    auth:{
        type:'OAuth2',
        user:'foreignadmitsweb@gmail.com',
        clientId:'174142696382-hus011q4k9tul00lf0d7436j4d9vhevo.apps.googleusercontent.com',
        clientSecret:'fx2Tz_HqsPyyKvDn8E-ucP2T',
        refreshToken:'1/8T99L3bbUCJsl2RuPQbtVG4kOknTC8uQzxI9mLAj7X4'
    }
})

const notify=(req,res,next)=>{
    const mailoption={
        from:'foreignadmitsweb@gmail.com',
        to:req.params.email,
        subject:"Foreign Admits Thanks for choosing us",
        html:"<p>Thanks for trusting us with your career</p><p>We will reach back to you as soon as possible</p>"
    }
    transporter.sendMail(mailoption,(err,res)=>{
        if(err)
            res.status(400),josn(err)
        else
            next();
    })
}

const eve=(req,res,next)=>{
    var mailoption={
        from:'foreignadmitsweb@gmail.com',
        to:req.params.email,
        subject:"Foreign Admits reset your passoword",
        html:'<p>Thanks for registering for the event'+req.params.name+'</p>'
    }
    transporter.sendMail(mailoption,(err,res)=>{
        if(err)
            res.status(400).josn(err);
        else
            next();
    })
}

const reset=(email,string)=>{
    var mailoption={
        from:'foreignadmitsweb@gmail.com',
        to:email,
        subject:"Foreign Admits reset your passoword",
        html:'<p>Click the link for Resetting your password<a href="https://warm-inlet-93009.herokuapp.com/reset/'+string+'/'+email+'">Verify</a></p>'
    }
    transporter.sendMail(mailoption,(err,res)=>{
        if(err)
            console.log(err)
        else
            console.log(res);
    })
}

const send=(user)=>{

    var mailoption1={
        from:'foreignadmitsweb@gmail.com',
        to:user.m_email,
        subject:'Foreign Admits meeting with your mentor',
        text:'Hello '+user.m_name+' you have an upcoming meeting with your mentor '+ user.s_name +'at' +user.Time
    }
    transporter.sendMail(mailoption1,(err,res)=>{
        if(err)
            console.log(err)
        else
            console.log(res);
    })

    var mailoption2={
        from:'foreignadmitsweb@gmail.com',
        to:user.s_email,
        subject:'Foreign Admits meeting with your mentor',
        text:'Hello '+user.s_name+' you have an upcoming meeting with your mentor '+ user.m_name +' at ' +user.Time
    }
    transporter.sendMail(mailoption2,(err,res)=>{
        if(err)
            console.log(err)
        else
            console.log(res);
    })
}



cron.schedule('0 0 */3 * * *',()=>{
    var samay=datetime.create().format('Y-m-d H:M');
    const time=samay.split(' ')[1];
    console.log(samay)
    const date=samay.split(' ')[0];
    axios.get('https://glacial-citadel-47306.herokuapp.com/api/Appointments').then(res=>{
        if(res.status===200){
            //console.log(res.data)
            res.data.map(i=>{
                if(i.Date===date && i.Time>time){
                    console.log(i);
                    send(i);
                }
            })
        }
    })
    
})

app.get('/reset/:string/:email',(req,res)=>{
    console.log("email id is"+req.params.email,req.params.string);
    reset(req.params.email,req.params.string);
    res.status(200).json("yes");
})


app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/views/home.html');
})
app.route('/schedule')
    .get((req,res)=>{
        res.sendFile(__dirname+'/views/form.html');
    })
    .post((req,res)=>{
        const db=new meeting_model
        db.email=req.body.email;
        db.date=req.body.date;
        db.time=req.body.time;
        db.save().then(user=>{
            console.log(user);
        }).catch(err=>{
            console.log(err);
        })
    })
app.get('/gettingdata/:email',(req,res)=>{
    database_google.findOne({email:req.params.email}).then(user=>{
        //send(user,email);
        res.status(200).json(user);
    })
})
app.get('/sendemailtostudent/:email',notify,(req,res)=>{
    res.status(200).json('ok');
})

app.get('/event_reg/:email/:name',eve,(req,res)=>{
    res.status(200).jssn("sent");
})






app.listen(process.env.PORT||3002);
