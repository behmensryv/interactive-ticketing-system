const venueData = {
    rows: 8, cols: 14,
    zones: {
        vip: { name: 'VIP Zolaq', price: 100, type: 'vip', startRow: 1, endRow: 3 },
        standart: { name: 'Standart Zolaq', price: 40, type: 'standart', startRow: 4, endRow: 8 }
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