import MissionCard from '../models/missionCard'
import BaseCtrl from "./base";
import Level from "../models/level";

export default class LevelCtrl extends BaseCtrl {
    model=Level
    childModel=MissionCard;


    getAll=(req,res)=>{
        this.model.find({ deleted: false }).sort({order:'asc'}).exec((err, docs) => {
            if (err) { return res.send(err); }
            res.status(200).json({isSuccessful:true,data:docs});
        })
    }
    getCurrentLevelMissionCard=(req,res)=>{
        this.childModel.find({levelId:req.params.levelId}).exec((err,docs)=>{
            if(err){return res.send(err);}
            res.status(200).json({isSuccessful:true,data:docs});
        })
    }
}
