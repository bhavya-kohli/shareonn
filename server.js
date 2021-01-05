const express=require("express");
const app=express();
const path=require('path');
const PORT=process.env.PORT || 3000;
const filesroute=require('./routes/files');
const showroute=require('./routes/show');

//DB connect
const connectDB=require('./config/db');
connectDB();

//view engine
app.set('views',path.join(__dirname,'/views'));
app.set('view engine','ejs');

//static asset
app.use(express.static('public'));

app.use(express.json());

//routes
app.use('/api/files',filesroute); 
app.use('/files',showroute);
app.use('/files/download',require('./routes/download'));

app.listen(PORT,()=>{
    console.log("server running successfully");
});

