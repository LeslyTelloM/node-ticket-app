import { Request, Response } from "express";
import { TicketService } from "../service/ticket.service";

export class TicketController {
    constructor(private readonly ticketService = new TicketService()) { }

    public getTickets = async (req: Request, res: Response) => {
        res.json(this.ticketService._tickets)

    }

    public getLastTicketNumber = (req: Request, res: Response) => {
        res.json(this.ticketService.lastTicketNumber)

    }


    public getPendingTickets = (req: Request, res: Response) => {
        res.json(this.ticketService.pendingTickets)
        

    }


    public createTicket = (req: Request, res: Response) => {
        const ticketCreated = this.ticketService.createTicket()



        res.status(201).json(ticketCreated)

    }


    public drawTicket = (req: Request, res: Response) => {

        const { desk } = req.params
        const ticketCreated = this.ticketService.drawTicket(desk)
        res.status(200).json(ticketCreated)

    }

    public ticketFinished = (req: Request, res: Response) => {

        const { ticket } = req.params
        res.json(this.ticketService.onFinishedTicket(ticket))

    }

    public workingOn = (req: Request, res: Response) => {
        res.json(this.ticketService.lastWorkingOnTickets)

    }
}