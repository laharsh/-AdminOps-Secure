const express = require('express');
const bodyParser = require('body-parser');
var authenticate = require('../authenticate');
const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());
const Leaders = require('../models/leaders');

leaderRouter.route('/')
.get((req,res,next)=>{
    Leaders.find({})
    .then((leaders) =>{
        res.StatusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(leaders);
    }, (err) => next(err))
    .catch(err => next(err));
})
.post(authenticate.verifyUser,(req,res,next)=>{
    if(authenticate.verifyAdmin(req.user.admin)){
        Leaders.create(req.body)
        .then((leaders) =>{
            res.StatusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(leaders);
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
        res.end('PUT operation is not supported on /leaders');
    } 
    else{
        err = new Error("You are not authorized to perform this operation!");
        err.status = 403;
        next(err);
    }
})
.delete(authenticate.verifyUser,(req,res,next)=>{
    if(authenticate.verifyAdmin(req.user.admin)){
        Leaders.remove({})
        .then((leaders)=>{
            res.StatusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(leaders);
        },(err)=>next(err))
        .catch((err)=>next(err));
    }
    else{
        err = new Error("You are not authorized to perform this operation!");
        err.status = 403;
        next(err);
    }
})

leaderRouter.route('/:leaderid')
.get((req,res,next)=> {
    Leaders.findById(req.params.leaderid)
    .then((leader)=>{
        res.StatusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(leader);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post(authenticate.verifyUser,(req,res,next)=>{
    if(authenticate.verifyAdmin(req.user.admin)){
        res.StatusCode = 403;
        res.end('POST operation not supported on particular /leaders/'+req.params.leaderid);
    }
    else{
        err = new Error("You are not authorized to perform this operation!");
        err.status = 403;
        next(err);
    }
})
.put(authenticate.verifyUser,(req,res,next)=>{
    if(authenticate.verifyAdmin(req.user.admin)){
        Leaders.findByIdAndUpdate(req.params.leaderid,{$set: req.body},{new:true})
        .then((leader)=>{
            res.StatusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(leader);
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
        Leaders.findByIdAndRemove(req.params.leaderid)
        .then((leaders)=>{
            res.StatusCode = 200 ;
            res.setHeader('Content-Type','application/json');
            res.json(leaders);
        },(err)=>next(err))
        .catch((err)=>next(err));
    }
    else{
        err = new Error("You are not authorized to perform this operation!");
        err.status = 403;
        next(err);
    }
});

module.exports = leaderRouter;