const express = require('express');
const bodyParser = require('body-parser');
var authenticate = require('../authenticate');
const promoRouter = express.Router();

promoRouter.use(bodyParser.json());
const Promos = require('../models/promotions');

promoRouter.route('/')
.get((req,res,next)=>{
    Promos.find({})
    .then((promos) =>{
        res.StatusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(promos);
    }, (err) => next(err))
    .catch(err => next(err));
})
.post(authenticate.verifyUser,(req,res,next)=>{
    if(authenticate.verifyAdmin(req.user.admin)){
        Promos.create(req.body)
        .then((promos) =>{
            res.StatusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(promos);
        },(err)=> next(err))
        .catch((err)=>next(err));
    }
    else{
        err = new Error("You are not authorized to perform this operation!");
        err.status = 403;
        next(err);
    }
})
.put(authenticate.verifyUser,(req,res,next)=>{
    if(authenticate.verifyAdmin(req.user.admin)){
        res.StatusCode = 403;
        res.end('PUT operation is not supported on /promos');
    }
    else{
        err = new Error("You are not authorized to perform this operation!");
        err.status = 403;
        next(err);
    }
})
.delete(authenticate.verifyUser,(req,res,next)=>{
    if(authenticate.verifyAdmin(req.user.admin)){
        Promos.remove({})
        .then((promos)=>{
            res.StatusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(promos);
        },(err)=>next(err))
        .catch((err)=>next(err));
    }
    else{
        err = new Error("You are not authorized to perform this operation!");
        err.status = 403;
        next(err);
    }
});

promoRouter.route('/:promoid')
.get((req,res,next)=> {
    Promos.findById(req.params.promoid)
    .then((promo)=>{
        res.StatusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(promo);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post(authenticate.verifyUser,(req,res,next)=>{
    if(authenticate.verifyAdmin(req.user.admin)){
        res.StatusCode = 403;
        res.end('POST operation not supported on particular /promos/'+req.params.promoid);
    }
    else{
        err = new Error("You are not authorized to perform this operation!");
        err.status = 403;
        next(err);
    }
})
.put(authenticate.verifyUser,(req,res,next)=>{
    if(authenticate.verifyAdmin(req.user.admin)){
        Promos.findByIdAndUpdate(req.params.promoid,{$set: req.body},{new:true})
        .then((promo)=>{
            res.StatusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(promo);
        },(err)=>next(err))
        .catch((err)=>next(err));
    }
    else{
        err = new Error("You are not authorized to perform this operation!");
        err.status = 403;
        next(err);
    }
})
.delete(authenticate.verifyUser,(req,res,next)=>{
    if(authenticate.verifyAdmin(req.user.admin)){
        Promos.findByIdAndRemove(req.params.promoid)
        .then((promos)=>{
            res.StatusCode = 200 ;
            res.setHeader('Content-Type','application/json');
            res.json(promos);
        },(err)=>next(err))
        .catch((err)=>next(err));
    }
    else{
        err = new Error("You are not authorized to perform this operation!");
        err.status = 403;
        next(err);
    }
});

module.exports = promoRouter;