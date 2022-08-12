const express=require('express');

const app=express();

//Logger package
const morganLogger=require('morgan');

//Mongoose connect
const mongoose=require("mongoose");

//Calling mongoose root-shop  mypass12
mongoose.connect('mongodb+srv://'+process.env.MDBUSER+":"+process.env.MDBPASS+'@cluster0.iayjjdi.mongodb.net/?retryWrites=true&w=majority');
mongoose.Promise=global.Promise;
//mongoose.connect('mongodb+srv://root-shop:mypass12@cluster0.iayjjdi.mongodb.net/?retryWrites=true&w=majority');
//console.log(process.env.MDBUSER+"==="+process.env.MDBPASS);
////process.env.MONGOS_ATLAS_US +process.env.MONGOS_ATLAS_PW
const  productRoutes=require('./api/routes/products');
const ordersRoutes=require('./api/routes/orders');

//import body parser package
const bodyParser=require('body-parser');

// Passing logger package 
app.use(morganLogger('dev'));


//Body Parsing 
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// addding header to respose 
app.use((req,res,next)=>{
   res.header('Access-Control-Allow-Origin','*');
   res.header('Access-Control-Allow-Headers', "Origin,X-Requested-With,Content-Type,Accept,Authorization" );

   if (req.method=='Options'){
    res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE');
    return res.status(200).json({});
   }
   next()
});

// passing request to routes based on url 
app.use('/orders',ordersRoutes);
app.use('/products',productRoutes);

app.use((req,res,next)=>{
    const error= new Error('Not Found');
    error.status=404;
    next(error);
});

app.use((error,req,res,next)=>{
    res.status( error.status ||505);
    res.json({
        error: {
            message : error.message
        }
    });
});


module.exports=app;