import UserChallenge from '../models/userChallenge'
import BaseCtrl from "./base";
import Challenge from "../models/challenge";
import moment = require("moment-timezone");

export default class ChallengeCtrl extends BaseCtrl {
  model=Challenge;
  userChallenge=UserChallenge;

  start=(req,res)=>{
    let user=req.payload.user;
    this.model.findById(req.body._id).exec((err,challenge)=>{
      if(err){
        return res.status(200).json({isSuccessful:false,message:'challenge not found',err:err})
      }
      if(challenge){
        let userChallenge={
          challenge,
          user:user._id,
          userCompleteProgress:0,
          deadline:moment().tz('Asia/Tehran').unix()+challenge.hoursLimitation*60*60
        }
        const obj = new this.userChallenge(userChallenge);
        obj.save((err, item) => {
          if (err && err.code === 11000) {
            res.sendStatus(400);
          }
          if (err) {
            return res.send(err);
          }
          res.status(200).json({isSuccessful:true,data:item});
        });

      }else{
        return res.status(200).json({isSuccessful:false,message:'challenge not found'})
      }
    })
  }
  getMyActiveChallenge=(req,res)=>{
    let user=req.payload.user;
    let finder={deleted:false,user:user._id}
    let timestampNow=moment().tz('Asia/Tehran').unix()

    finder['deadline']= { $gte: timestampNow }
    this.userChallenge.find(finder).exec((err,userChallenges)=>{
      if(err){
        return res.status(200).json({isSuccessful:false,message:'user challenge not found',err:err})
      }
      if(userChallenges){
        return res.status(200).json({isSuccessful:true,data:userChallenges});

      }else{
        return res.status(200).json({isSuccessful:false,message:'user challenge not found'})

      }
    })
  }

  getMyExpiredChallenge=(req,res)=>{
    let user=req.payload.user;
    let finder={deleted:false,user:user._id}
    let timestampNow=moment().tz('Asia/Tehran').unix()

    finder['deadline']= { $lte: timestampNow }
    this.userChallenge.find(finder).exec((err,userChallenges)=>{
      if(err){
        return res.status(200).json({isSuccessful:false,message:'user challenge not found',err:err})
      }
      if(userChallenges){
        let challenges=[]
        userChallenges.forEach((item,index)=>{
          if(item.userCompleteProgress!=item.challenge.questionNumber){
            challenges.push(item)
          }
          if(index===userChallenges.length-1){
            return res.status(200).json({isSuccessful:true,data:challenges});

          }
        })

      }else{
        return res.status(200).json({isSuccessful:false,message:'user challenge not found'})

      }
    })
  }
  getMyFinishedChallenge=(req,res)=>{
    let user=req.payload.user;
    let finder={deleted:false,user:user._id}
    let timestampNow=moment().tz('Asia/Tehran').unix()

    finder['deadline']= { $gte: timestampNow }
    this.userChallenge.find(finder).exec((err,userChallenges)=>{
      if(err){
        return res.status(200).json({isSuccessful:false,message:'user challenge not found',err:err})
      }
      if(userChallenges){
        let challenges=[]
        userChallenges.forEach((item,index)=>{
          if(item.userCompleteProgress===item.challenge.questionNumber){
            challenges.push(item)
          }
          if(index===userChallenges.length-1){
            return res.status(200).json({isSuccessful:true,data:challenges});

          }
        })

      }else{
        return res.status(200).json({isSuccessful:false,message:'user challenge not found'})

      }
    })
  }
}
