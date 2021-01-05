const express=require("express");
const router=express.Router();
const multer=require('multer');
const path=require('path');
const File=require('../models/file');
const {v4:uuid4}=require('uuid');


let storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads/');
    },
    filename:(req,file,cb)=>{
        const uniquename=`${Date.now()}-${Math.round(Math.random()*1E9)}${path.extname(file.originalname)}`;
        //34564567546-23424525643.jpeg
        cb(null,uniquename);
    }
});


let upload=multer({
    storage:storage,
    limits:{
        fileSize:1000000*100,
    }
}).single('myfile');

router.post("/",async(req,res,next)=>{
    
    //store a file in uploads using multer
    upload(req,res,async(err)=>{
        //Validate request
        if (err){
            return res.status(500).send({"error":err.message});
        }
        //stores data in database
    const file=new File({
        filename:req.file.filename,
        uuid:uuid4(),
        path:req.file.path,
        size:req.file.size,

    });
    //response=>link
    const response=await file.save();
    return res.status(201).json({file:`${process.env.APP_BASE_URL}/files/${response.uuid}`});

    });
    
});

router.post('/send',async(req,res,next)=>{
const { uuid, emailTo, emailFrom} = req.body;
  if(!uuid || !emailTo || !emailFrom) {
      return res.status(422).send({ error: 'All fields are required except expiry.'});
  }
  // Get data from db 
    const file = await File.findOne({ uuid: uuid });
    if(file.sender!=null){
      return res.status(422).send({ error: 'Email already sent once.'});
    }
    file.sender = emailFrom;
    file.receiver = emailTo;
    const response = await file.save();
    // send mail
    const sendMail = require('../services/emailService');
    sendMail({
      from: emailFrom,
      to: emailTo,
      subject: 'inShare file sharing',
      text: `${emailFrom} shared a file with you.`,
      html: require('../services/emailTemplate')({
                emailFrom, 
                downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}` ,
                size: parseInt(file.size/1000) + ' KB',
                expires: '24 hours'
            })
    });
    res.status(201).send({success:true});
});

module.exports=router;
