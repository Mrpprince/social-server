const express=require("express")
const mongoose=require('mongoose');
const dotenv=require('dotenv');
const helmet=require('helmet');
const morgan=require('morgan')
const app=express();
const userRoute=require('./routes/users');
const authRouter=require('./routes/auth');
const postRouter=require('./routes/posts');


dotenv.config();

mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser:true,
    useFindAndModify:true,
    useCreateIndex:true,
    useUnifiedTopology: true

},()=>{
    console.log("Connected to MONGODB");
})


//MiddleWares
app.use(express.json())
app.use(helmet());
app.use(morgan("common"));
app.use('/api/users',userRoute);
app.use('/api/auth',authRouter);
app.use('/api/posts',postRouter);




app.listen(8800,()=>{
    console.log("Server is running ")
})