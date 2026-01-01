
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const message = document.getElementById('message');

    message.textContent = '';
    message.className = 'message';

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data.success) {
            message.textContent = 'Login successful! Redirecting...';
            message.classList.add('success');

            setTimeout(() => {
                window.location.href = 'events.html';
            }, 1500);
        } else {
            message.textContent = data.message || 'Invalid credentials';
            message.classList.add('error');
        }

    } catch (err) {
        message.textContent = 'Server error. Try again later.';
        message.classList.add('error');
    }
});
