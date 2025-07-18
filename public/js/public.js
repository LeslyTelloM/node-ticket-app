let workingTickets = []


function connectToWebSockets() {

    const socket = new WebSocket('ws://localhost:3000/ws');

    socket.onmessage = (event) => {
        const { payload, type } = JSON.parse(event.data)

        if (type !== 'on-ticket-attention-changed') return;

        workingTickets = payload

        setValues()

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


function setValues() {

    if (workingTickets <= 0) return;

    for (i = 0; i < 4; i++) {
        document.querySelector(`#lbl-desk-0${i + 1}`).innerHTML = workingTickets[i] !== undefined ? workingTickets[i].handleAtDesk : '-';
        document.querySelector(`#lbl-ticket-0${i + 1}`).innerHTML = workingTickets[i] !== undefined ? workingTickets[i].number : '-'
    }

}
async function getWorkingOnTickets() {
    const workingon = await fetch('http://localhost:3000/api/ticket/working-on', {
        method: 'GET'
    }).then(resp => resp.json())

    workingTickets = workingon

    setValues()


}

getWorkingOnTickets();
connectToWebSockets();



