const express=require('express');
const router=express.Router();
const File=require('../models/file');

router.get('/:uuid',async(req,res,next)=>{
    const uuid=req.params.uuid;
    try{
        const file=await File.findOne({uuid:uuid});
       if(!file){
        return res.status(404).render('download',{error:"File doesn't exist or link has been expired"});
        }
        return res.status(200).render('download',{
            uuid:file.uuid,
            fileName:file.filename,
            fileSize:file.size,
            downloadLink:`${process.env.APP_BASE_URL}/files/download/${file.uuid}`
            //http://localhost/files/download/dfbhjkdfh-djkd-denjkdwehn;
        });
    }
    catch{
       return res.status(500).render('download',{error:"OOPs!! Something went wrong"});
    }
    


});

module.exports=router;