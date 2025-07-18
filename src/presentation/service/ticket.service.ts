import { UuidAdapter } from "../../config/uuid.adapter";
import { Ticket } from "../../domain/interfaces/ticket";
import { WssService } from "./wss.service";

export class TicketService {

    constructor(private readonly wssService: WssService = WssService.instance) {

    }

    public readonly _tickets: Ticket[] = []

    private readonly workingOnTickets: Ticket[] = []


    public get lastWorkingOnTickets(): Ticket[] {

        return this.workingOnTickets.slice(0, 4)

    }

    public get pendingTickets(): Ticket[] {
        return this._tickets.filter(t => !t.handleAtDesk);
    }

    public get lastTicketNumber(): number {
        return this._tickets.length > 0 ? this._tickets.at(-1)!.number : 0

    }

    public createTicket() {

        const ticket: Ticket = {
            id: UuidAdapter.v4(),
            number: this.lastTicketNumber + 1,
            createdAt: new Date(),
            done: false
        }

        this._tickets.push(ticket)

        //comunicar con el websocket
        this.onTicketNumberChanged()



        return ticket

    }

    private onTicketNumberChanged() {
        this.wssService.sendMessage('on-ticket-count-changed', this.pendingTickets.length)
    }

    private onTicketAttentionChange() {
        this.wssService.sendMessage('on-ticket-attention-changed', this.lastWorkingOnTickets)
    }

    public drawTicket(desk: string) {
        const ticket = this._tickets.find(t => !t.handleAtDesk) //nulo

        if (!ticket) return { status: 'error', message: 'No hay tickets pendientes' }

        ticket.handleAtDesk = desk;
        ticket.handleAt = new Date();

        this.workingOnTickets.unshift({ ...ticket })

        this.onTicketNumberChanged()
        this.onTicketAttentionChange()


        return { status: 'ok', ticket }



    }


    public onFinishedTicket(id: string) {
        const ticket = this._tickets.find(t => t.id === id);
        if (!ticket) return { status: 'error', message: 'Ticket no encontrado' }

        this._tickets.map(t => {
            if (t.id === id) {
                t.done = true

            }

            return t
        })

        return { status: 'OK' }

    }



}