const express= require('express');

const routes=express.Router();

routes.get("/",(req,res,next)=>{
    res.status(200).json({
        Orders: "List of all orders"
    });
});

routes.get("/:orderId",(req,res,next)=>{
    const id=req.params.orderId;
    res.status(200).json({
        Orders: "list of all order from this group "+ id
    });

});

routes.post("/",(req,res,next)=>{
    const order={
        productId:req.body.productId,
        quantity: req.body.quantity
    }
    res.status(201).json({
        message :'Order was created',
        order : order
    });

});

routes.delete("/:orderId",(req,res,next)=>{
    const id =req.params.orderId;
    res.status(200).json({
      Deleted : "List of order delete from  "+id  
    });
});

module.exports=routes;