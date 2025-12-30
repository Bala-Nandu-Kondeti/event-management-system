const eventsGrid = document.getElementById('eventsGrid');
const searchInput = document.getElementById('searchInput');

let allEvents = [];

// Fetch events from backend
fetch('/api/events')
    .then(res => res.json())
    .then(data => {
        allEvents = data;
        displayEvents(allEvents);
    });

// Display events
function displayEvents(events) {
    eventsGrid.innerHTML = '';

    if (events.length === 0) {
        eventsGrid.innerHTML = '<p>No events found</p>';
        return;
    }

    events.forEach(event => {
        const card = document.createElement('div');
        card.className = 'card';

        card.innerHTML = `
            <img src="uploads/${event.image || 'default.jpg'}">
            <div class="card-body">
                <h3>${event.title}</h3>
                <p>${event.description}</p>
                <div class="date">${event.event_date} | ${event.event_time}</div>
            </div>
        `;

        eventsGrid.appendChild(card);
    });
}

// Search filter
searchInput.addEventListener('input', () => {
    const keyword = searchInput.value.toLowerCase();

    const filtered = allEvents.filter(event =>
        event.title.toLowerCase().includes(keyword) ||
        event.description.toLowerCase().includes(keyword)
    );

    displayEvents(filtered);
});
