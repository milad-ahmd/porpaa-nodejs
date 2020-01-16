export class ResponseContent {
    isSuccessful:boolean;
    data:any
    constructor(isSuccessful,data){
        this.isSuccessful=isSuccessful;
        this.data=data
    }

}
