require('dotenv').config();
const mongoose=require('mongoose');

function connectDB(){
    //database connection
    const url=process.env.MONGO_CONNECTION_URL;
    mongoose.connect(url,{useUnifiedTopology:true,useCreateIndex:true,useNewUrlParser:true,useFindAndModify:true});
    const connection=mongoose.connection;

    connection.once('open',()=>{
        console.log("Db connected");
    }).catch((e)=>{
        console.log("connection failed");
    });
};

module.exports=connectDB;