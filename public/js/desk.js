

console.log('Escritorio HTML');

const lblPending = document.querySelector('#lbl-pending')
const lblEmpty = document.querySelector('#lbl-empty-tickets')
const deskHeader = document.querySelector('h1');

const noMoreAlert = document.querySelector('.alert')
const btnEnd = document.querySelector('#btn-end');
const btnAttend = document.querySelector('#btn-attend');
const currentTicketLabel = document.querySelector('#current-ticket');

const searchParams = new URLSearchParams(window.location.search)
if (!searchParams.has('escritorio')) {
    window.location = 'index.html';
    throw new Error('Escritorio requerido')

}

const deskNumber = searchParams.get('escritorio')
let currentTicket;
deskHeader.innerText = deskNumber


function checkTicketCount(currentCount = 0) {

    if (currentCount === 0) {
        noMoreAlert.classList.remove('d-none');
        btnAttend.classList.add('disabled');
    } else {
        noMoreAlert.classList.add('d-none');
        btnAttend.classList.remove('disabled');
    }
    lblPending.innerHTML = currentCount;
}





async function loadInitialCount() {
    const pending = await fetch('http://localhost:3000/api/ticket/pending', {
        method: 'GET'
    }).then(resp => resp.json());
    lblPending.innerHTML = pending.length || 0;
    checkTicketCount(pending.length)
}
function connectToWebSockets() {


    const socket = new WebSocket('ws://localhost:3000/ws');

    socket.onmessage = (event) => { //on-ticket-count-changed
        console.log(event.data);

        const { payload, type } = JSON.parse(event.data)

        if (type !== 'on-ticket-count-changed') return;

        checkTicketCount(payload)

    };

    socket.onclose = (event) => {
        console.log('Connection closed');
        setTimeout(() => {
            console.log('retrying to connect');
            connectToWebSockets();
        }, 1500);

    };

    socket.onopen = (event) => {
        console.log('Connected');
    };

}

loadInitialCount()
connectToWebSockets()
btnAttend.addEventListener('click', async () => {
    const response = await fetch(`http://localhost:3000/api/ticket/draw/${deskNumber}`).then(resp => resp.json()).catch(e=>{


    })

    if(!response.status) currentTicketLabel.innerHTML = currentTicket.message;

    currentTicket = response.ticket;
    currentTicketLabel.innerHTML = currentTicket.number;
    btnAttend.classList.add('disabled')





})


btnEnd.addEventListener('click', async () => {
    if (!currentTicket) return;
    btnAttend.classList.remove('disabled')
    await fetch(`http://localhost:3000/api/ticket/done/${currentTicket.id}`, { method: 'PUT' })
    currentTicket = null
    currentTicketLabel.innerHTML = 'NINGUNO'


})
