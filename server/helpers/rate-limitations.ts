import { LimitationType } from './limitationType'


export default class RateLimitations {
  /*
  limitation:{
    field,
    type:lt,lte,gt,gte,
    value
  }
   */
  static limitation(config,checkLimitation):any{
    for(let item of checkLimitation){
      if(item.type==LimitationType.lt){
        if(!(item.value<config[item.field])){
          return {isSuccess:false,field:item.field}
        }
      }else if(item.type==LimitationType.lte){
        if(!(item.value<=config[item.field])){
          return {isSuccess:false,field:item.field}
        }
      }else if(item.type==LimitationType.gt){
        if(!(item.value>config[item.field])){
          return {isSuccess:false,field:item.field}
        }
      }else if(item.type==LimitationType.gte){
        if(!(item.value>=config[item.field])){
          return {isSuccess:false,field:item.field}
        }
      }
    }

    return {isSuccess:true}
  }
}
