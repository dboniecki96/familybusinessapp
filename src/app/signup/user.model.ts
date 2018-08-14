export class User{
    constructor(
        public userID: number,
        public name: string,
        public surname: string,
        public birth_date: string,
        public residence: string,
        public country: string,
        public login: string,
        public password: string,
        public email: string

    ){}
}