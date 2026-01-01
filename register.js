document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const message = document.getElementById('message');
    message.textContent = '';
    message.className = 'message';

    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });

        if (response.ok) {
            message.textContent = 'Registration successful! Redirecting to login...';
            message.classList.add('success');

            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            message.textContent = 'Registration failed. Try again.';
            message.classList.add('error');
        }

    } catch (error) {
        message.textContent = 'Server error. Please try later.';
        message.classList.add('error');
    }
});
