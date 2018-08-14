export class Expense{
    constructor(
        public id: number,
        public date: string,
        public sum: number,
        public userID: number,
        public expensegroupID: number
    ){}
}