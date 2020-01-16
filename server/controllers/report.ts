import { ResponseContent } from '../base/responseContent'
import BaseCtrl from "./base";
import Report from "../models/report";

export default class ReportCtrl extends BaseCtrl {
    model=Report


    response:ResponseContent;
    insertReport = (req, res) => {
        var report = req.body
        report.reporter = req.payload.user._id
        if(req.params.type==='question-comment'){
            report.type='question_comment';
        }else if(req.params.type==='answer-comment'){
            report.type='answer_comment';
        }else{
            report.type=req.params.type;
        }
        if(report[report.type]){
            const obj = new this.model(report)
            obj.save((err, item) => {
                if (err && err.code === 11000) {
                    res.sendStatus(400)
                }
                if (err) {
                    return res.send(err)
                }
                this.response = new ResponseContent(true, item)

                return res.status(200).json(this.response)
            })
        }else{
            return res.status(400).json({
                isSuccessful: false,
                message: `${report.type} id is not exist`
            })
        }



    }
}
