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

function inspectSeat(seatId) {
    const seatData = seats.find(s => s.id === seatId);
    if (!seatData || seatData.status === 'unavailable') return;

    inspectedSeatId = seatId;
    renderVenue();

    document.getElementById('inspector-content').innerHTML = `
        <p><strong>Zolaq:</strong> ${seatData.zoneName}</p>
        <p><strong>Sıra:</strong> ${seatData.row}</p>
        <p><strong>Yer:</strong> ${seatData.col}</p>
        <p><strong>Qiymət:</strong> ${seatData.price} ₼</p>
    `;

    const addBtn = document.getElementById('add-to-cart-btn');
    if (cart.some(item => item.id === seatId)) {
        addBtn.disabled = true; addBtn.innerText = "ARTIQ SƏBƏTDƏDİR";
    } else {
        addBtn.disabled = false; addBtn.innerText = "SƏBƏTƏ ƏLAVƏ ET";
    }
}

function applyTransform() {
    scale = Math.max(0.5, Math.min(scale, 3));
    translateX = Math.max(-1000, Math.min(translateX, 1000));
    translateY = Math.max(-1000, Math.min(translateY, 1000));
    document.getElementById('venue').style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
}
function zoomIn() { scale += 0.2; applyTransform(); }
function zoomOut() { scale -= 0.2; applyTransform(); }
function move(dx, dy) { translateX += dx; translateY += dy; applyTransform(); }
function resetView() { scale = 1; translateX = 0; translateY = 0; applyTransform(); }

function addToCart() {
    if (!inspectedSeatId) return;
    const seatData = seats.find(s => s.id === inspectedSeatId);
    if (cart.some(item => item.id === inspectedSeatId)) return;

    cart.push(seatData);
    updateCartUI();
    inspectSeat(inspectedSeatId); 
}

function removeFromCart(seatId) {
    cart = cart.filter(item => item.id !== seatId);
    updateCartUI();
    if (inspectedSeatId === seatId) inspectSeat(seatId); 
    else renderVenue(); 
}

function updateCartUI() {
    const cartItemsEl = document.getElementById('cart-items');
    const cartTotalEl = document.getElementById('cart-total');
    
    if (cart.length === 0) {
        cartItemsEl.innerHTML = '<p style="color: #7f8c8d; font-style: italic;">Səbətiniz boşdur.</p>';
        cartTotalEl.innerText = `Total: 0 ₼`;
        return;
    }

    let html = '';
    let total = 0;
    cart.forEach(item => {
        total += item.price;
        html += `<div class="cart-item">
            <div><strong>Sıra ${item.row}, Yer ${item.col}</strong><br><small>${item.zoneName}</small></div>
            <div><span style="font-weight: bold; margin-right: 15px;">${item.price} ₼</span>
            <button class="remove-btn" onclick="removeFromCart('${item.id}')">X</button></div>
        </div>`;
    });
    cartItemsEl.innerHTML = html;
    cartTotalEl.innerText = `Total: ${total} ₼`;
}