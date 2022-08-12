const express =require('express');

const router=express.Router();

const Product=require('../models/product');

const mongoose=require("mongoose");
const e = require('express');
const { response } = require('../../app');

router.get('/',(req,res,next)=>{
    Product.find()
           .select('name price _id')
           .exec()
           .then(docs =>{
           // if (docs.length>0){
            const responseGet={
                count : docs.length,
                product :docs.map(doc=>{
                    return {
                       name :doc.name,
                       price :doc.price,
                       _id : doc.id,
                       request :{
                        type :'Get',
                        url :'http://localhost:9000/products/'+doc._id
                       } 
                    }
                })

            };
            res.status(200).json(responseGet);
        //    }else{
        //     res.status(404).json({ 
        //         "message":"No data found"
        //     });
        //    }
           }).catch(err=>{
            console.log(err);
            res.status(500).json({"error":err});
           })
});

router.get('/:productId',(req,res,next)=>{
        const id=req.params.productId;
   Product.findById(id)
          .exec()
          .then(doc =>{

            console.log(doc);
            if (doc){
                const responseGetID={
                    message: "Create product Successfully",
                    productDetail :{
                        name: doc.name,
                        price: doc.price,
                        _id : doc.id,
                        request :{
                            type : "Get",
                            url  : "http://localhost:9000/products/"
                        }
                    }
                }
                res.status(200).json(responseGetID);
            }else{
                res.status(401).json({"error":"Enter a Valid ID"});
            }

          })
          .catch(err=>{console.log(err);
            res.status(500).json({error :err});
        });
});


router.post('/',(req,res,next)=>{
    const porduct={ 
        name:req.body.name,
        price:req.body.price
    };
   const product=new Product({
        _id: new mongoose.Types.ObjectId(),
        name :req.body.name, 
        price:req.body.price
    });

    product.save().then(result=>{
        const responsePut={
            message: "Create product Successfully",
            createdProduct :{
                name: result.name,
                price: result.price,
                _id : result.id,
                request :{
                    type : "Get",
                    url  : "http://localhost:9000/products/"+result.id
                }
            }
        }
        console.log(responsePut);
        res.status(200).json(responsePut);
    }).catch(err =>{ console.log(err),
    res.status(400).json({"error":err})});
});

router.delete('/:productId',(req,res,next)=>{

    const id= req.params.productId;
    Product.deleteOne({_id:id})
        .select('name price _id')
        .exec()
        .then(result=>{
            const responseDel={
                message: "Create product Successfully",
                createdProduct :{
                    name: result.name,
                    price: result.price,
                    _id : result.id,
                    request :{
                        type : "Get",
                        url  : "http://localhost:9000/products"
                    }
                }
            }
            console.log(responseDel);
            res.status(200).json(responseDel);
        }).catch(err=>{
            console.log(err);
            res.status(400).json({"error":err});
        });
});

router.patch('/:productId',(req,res,next)=>{
    const id= req.params.productId;
    const updateOps={};
    for (const ops of req.body){
        updateOps[ops.propName]=ops.value;
    }
    Product.updateOne({_id:id},{$set:updateOps})
            .exec()
            .then(result =>{
                
                if (result.acknowledged){
                    if (result.matchedCount){
                        const responsePat={
                            responseValue :"SuccessFull",
                            message :"Value is update for the given "+id,
                            request :{
                                type : "Get",
                                url  : "http://localhost:9000/products/"+id
                            }
                        }
                        console.log(responsePat);
                        res.status(200).json(responsePat)
                    }else{
                        const responsePat={
                            responseValue :"Error",
                            message:"Enter product Id doesn't exits"
                        }
                        console.log(responsePat);
                        res.status(200).json(responsePat)
                    }

                }
                else{
                    const responsePat={
                        responseValue :"Error",
                        message:"Please Enter the correct property Name"
                    }
                    console.log(responsePat);
                    res.status(200).json(responsePat)
                }
                
            }).catch(err => {
                console.log(err);
                res.status(501).json({"error":err.message});
            });
            
});
module.exports=router