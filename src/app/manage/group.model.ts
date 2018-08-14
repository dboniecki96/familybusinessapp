export class Group{
  static amount: any;
  static percentage: number;
    constructor
    ( public id: number,
      public date: string,
      public balance: number, 
      public money_left: number,
      public name: string, 
      public percentage: number,
      public budget: number,
      public userID: number
    ){
    }
}