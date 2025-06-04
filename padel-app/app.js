const courts = JSON.parse(localStorage.getItem('courts') || '[]');
const matches = JSON.parse(localStorage.getItem('matches') || '[]');

const courtForm = document.getElementById('court-form');
const courtList = document.getElementById('court-list');
const matchForm = document.getElementById('match-form');
const matchList = document.getElementById('match-list');
const matchCourtSelect = document.getElementById('match-court');

function saveData() {
    localStorage.setItem('courts', JSON.stringify(courts));
    localStorage.setItem('matches', JSON.stringify(matches));
}

function renderCourts() {
    courtList.innerHTML = '';
    matchCourtSelect.innerHTML = '';
    courts.forEach((court, index) => {
        const li = document.createElement('li');
        li.textContent = court.name + ' - ' + court.location;
        courtList.appendChild(li);

        const option = document.createElement('option');
        option.value = index;
        option.textContent = court.name;
        matchCourtSelect.appendChild(option);
    });
}

function renderMatches() {
    matchList.innerHTML = '';
    matches.forEach(match => {
        const li = document.createElement('li');
        const court = courts[match.court];
        li.textContent = `${match.date} - ${match.player1} vs ${match.player2} @ ${court ? court.name : 'Pista'}`;
        matchList.appendChild(li);
    });
}

courtForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('court-name').value;
    const location = document.getElementById('court-location').value;
    courts.push({ name, location });
    saveData();
    renderCourts();
    courtForm.reset();
});

matchForm.addEventListener('submit', e => {
    e.preventDefault();
    const player1 = document.getElementById('player1').value;
    const player2 = document.getElementById('player2').value;
    const date = document.getElementById('match-date').value;
    const courtIndex = matchCourtSelect.value;
    matches.push({ player1, player2, date, court: courtIndex });
    saveData();
    renderMatches();
    matchForm.reset();
});

// Initial render
renderCourts();
renderMatches();
