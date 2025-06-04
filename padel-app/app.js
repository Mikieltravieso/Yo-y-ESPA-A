const reservations = JSON.parse(localStorage.getItem('reservations') || '[]');

const reservationForm = document.getElementById('reservation-form');
const reservationList = document.getElementById('reservation-list');
const timeSelect = document.getElementById('reservation-time');

function saveData() {
    localStorage.setItem('reservations', JSON.stringify(reservations));
}

function renderTimes() {
    const times = [
        '08:00','09:00','10:00','11:00','12:00','13:00',
        '14:00','15:00','16:00','17:00','18:00','19:00','20:00'
    ];
    times.forEach(t => {
        const option = document.createElement('option');
        option.value = t;
        option.textContent = t;
        timeSelect.appendChild(option);
    });
}

function renderReservations() {
    reservationList.innerHTML = '';
    reservations.forEach(res => {
        const li = document.createElement('li');
        li.textContent = `${res.court} - ${res.time} - ${res.name}`;
        reservationList.appendChild(li);
    });
}

reservationForm.addEventListener('submit', e => {
    e.preventDefault();
    const courtInput = document.querySelector('input[name="court"]:checked');
    if (!courtInput) return;
    const court = courtInput.value;
    const time = timeSelect.value;
    const name = document.getElementById('reservation-name').value;
    reservations.push({ court, time, name });
    saveData();
    renderReservations();
    reservationForm.reset();
    courtInput.checked = false;
});

renderTimes();
renderReservations();
