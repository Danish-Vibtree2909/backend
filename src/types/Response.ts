export default interface IResponse{
    code : number;
    status : boolean;
    message : string;
    count? : number;
    data : any;
  }
