export class NotificationClass {
  user:string;
  message:string
  type:string;
  meta:any;
  constructor(user,message,type,meta?){
    this.user=user;
    this.message=message
    this.type=type
    if(meta){
      this.meta=meta
    }
  }

}
