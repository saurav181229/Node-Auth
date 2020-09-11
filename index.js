const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const signUpRoutes = require('./routes/signUpRoutes');
const signup = require('./models/signup');
const user = require('./models/signup');

const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const transporter = nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key:'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'
    }
}));




app.use(bodyParser.urlencoded({extended:true}));
//const router = express.Router()


mongoose.connect("mongodb://localhost/signUp",{useNewUrlParser:true,useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error',console.error.bind(console,'connection error:'));
db.once('open',()=>{
    console.log('connected to db');
})




app.set('view engine','ejs');
app.use('/static',express.static('static'));


app.get('/',(req,res)=>{
    res.render('login');
})
app.get('/signup',(req,res)=>{
    res.render('signup')
})


app.post('/',(req,res,next)=>{
const name = req.body.name;
const email = req.body.email;
const pass = req.body.password;

console.log(name,email,pass);
user.findOne({email:email}).then(User=>{
    if(User){
        return res.redirect('/')
    }
    return bcrypt.hash(pass,12).then(hashPassword=>{
        const add = new user({
            name:name,
            email:email,
            password:hashPassword
        });
        return add.save();
    })
    .then(result=>{
        res.redirect('/')
        console.log(email);
       return transporter.sendMail({
            to: email,
            from:'rajchu1234567@gmail.com',
            subject:'signed up successfully',
            html:'<h1>you successfully signed up</h1>'

        });

    
    })
    .catch(err=>{
        console.log(err);
    })
   
})

.catch(err=>{
    console.log(err);
})
})

app.post('/welcome',(req,res)=>{
    email = req.body.email;
    pass = req.body.password;
    console.log(email,pass);

    user.findOne({email:email})
 .then(person=>{
     console.log(person);
     if(!person){
         return res.redirect('/');
     }
     bcrypt.compare(pass,person.password).then(result=>{
         if(result){
            return res.render('welcome');

         }
         res.redirect('/');

     }).catch(err=>{
         console.log(err) 
        return res.redirect("/");
        } )
 })
 
 .catch(err=>{
     console.log(err);
 })

})

//app.use('/signup',signUpRoutes)
///app.use('/signup',signUpRoutes);

app.listen(process.env.PORT||8000,()=>{
    console.log("server up and running");
})