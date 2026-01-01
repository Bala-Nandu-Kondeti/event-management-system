
const grid = document.getElementById('eventsGrid');
const searchInput = document.getElementById('searchInput');

let allEvents = [];

fetch('/api/events')
    .then(res => res.json())
    .then(data => {
        allEvents = data;
        displayEvents(allEvents);
    });

function displayEvents(events) {
    grid.innerHTML = '';

    if (events.length === 0) {
        grid.innerHTML = '<p>No events found</p>';
        return;
    }

    events.forEach(event => {
        grid.innerHTML += `
            <div class="col-md-4 mb-4">
                <div class="card shadow h-100">
                    <img src="uploads/${event.image || 'default.jpg'}" class="card-img-top" style="height:200px; object-fit:cover;">
                    <div class="card-body">
                        <h5 class="card-title">${event.title}</h5>
                        <p class="card-text">${event.description}</p>
                        <p class="text-primary">${event.event_date} | ${event.event_time}</p>
                    </div>
                </div>
            </div>
        `;
    });
}

searchInput.addEventListener('input', () => {
    const keyword = searchInput.value.toLowerCase();
    const filtered = allEvents.filter(e =>
        e.title.toLowerCase().includes(keyword) ||
        e.description.toLowerCase().includes(keyword)
    );
    displayEvents(filtered);
});
