const venueData = {
    rows: 8, cols: 14,
    zones: {
        vip: { name: 'VIP Zone', price: 100, type: 'vip', startRow: 1, endRow: 3 },
        standart: { name: 'Standart Zone', price: 40, type: 'standart', startRow: 4, endRow: 8 }
    }
};

let seats = [];
let cart = [];
let inspectedSeatId = null;

let scale = 1;
let translateX = 0;
let translateY = 0;

function init() {
    
}
window.onload = init;


function generateSeatsData() {
    for (let r = 1; r <= venueData.rows; r++) {
        for (let c = 1; c <= venueData.cols; c++) {
            if (c === 7 || c === 8) continue;
            let zone = (r <= venueData.zones.vip.endRow) ? venueData.zones.vip : venueData.zones.standart;
            let isUnavailable = Math.random() < 0.15;
            seats.push({ id: `${r}-${c}`, row: r, col: c, zoneName: zone.name, type: zone.type, price: zone.price, status: isUnavailable ? 'unavailable' : 'available' });
        }
    }
}

function renderVenue() {
    const venueEl = document.getElementById('venue');
    const stageHTML = '<div class="stage">STAGE</div>';
    let seatsHTML = '';

    for (let r = 1; r <= venueData.rows; r++) {
        seatsHTML += `<div class="seat-row">`;
        const rowSeats = seats.filter(s => s.row === r);
        rowSeats.forEach((seat, index) => {
            if (index === 6) seatsHTML += `<div style="width: 40px;"></div>`;
            
            let extraClasses = `${seat.type} ${seat.status}`;
            if (cart.find(item => item.id === seat.id)) extraClasses += ' in-cart';
            if (inspectedSeatId === seat.id) extraClasses += ' inspected';

            seatsHTML += `<button class="seat ${extraClasses}" id="seat-${seat.id}" onclick="inspectSeat('${seat.id}')" ${seat.status === 'unavailable' ? 'disabled' : ''}>${seat.col}</button>`;
        });
        seatsHTML += `</div>`;
    }
    venueEl.innerHTML = stageHTML + seatsHTML;
}