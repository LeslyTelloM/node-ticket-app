
const currentTicketLabel = document.querySelector('span')
const createTicketButton = document.querySelector('button')

async function getLastTicket() {

    const lastTicket = await fetch('http://localhost:3000/api/ticket/last', {
        method: 'GET',
    }).then((response) => response.json())

    currentTicketLabel.innerHTML = lastTicket;

}


async function createTicket() {
    const newTicket = await fetch('http://localhost:3000/api/ticket', {
        method: 'POST',
    }).then((response) => response.json())

    currentTicketLabel.innerHTML = newTicket.number;
}


getLastTicket()

createTicketButton.addEventListener('click', createTicket);

