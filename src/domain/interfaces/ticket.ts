export interface Ticket{
    id: string;
    number: number;
    createdAt: Date;
    handleAtDesk?: string; //escritorio 1-2...
    handleAt?: Date;
    done: boolean,
    //doneAt: Date



}