const express=require('express');
const router=express.Router();
const File=require('../models/file');

router.get('/:uuid',async(req,res,next)=>{
    const uuid=req.params.uuid;
    try{
        const file=await File.findOne({uuid:uuid});
        if(!file){
            return res.status(404).render('download',{error:"file doesnot exist"});    
        }
        const filePath=`${__dirname}/../${file.path}`;
        return res.download(filePath);
    }catch{
        return res.status(500).render('download',{error:"OOPS !! something went wrong"});
    }
});

module.exports=router