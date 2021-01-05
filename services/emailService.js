const nodemailer=require('nodemailer');

async function sendMail({from,to,subject,text,html}){
    //we have done obj de refferencing
    var transpoter=nodemailer.createTransport({
        host:process.env.SMTP_HOST,
        port:process.env.SMTP_PORT,
        secure:false,
        auth:{
            user:process.env.MAIL_USER,
            pass:process.env.MAIL_PASSWORD,
        }
        
    });

    let info=await transpoter.sendMail({
        from:from,
        to:to,
        subject:subject,
        text:text,
        html:html,
    });

}

module.exports=sendMail;