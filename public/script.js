const form = document.getElementById('authForm');
const message = document.getElementById('message');
const submitButton = document.getElementById('submitButton');
const toggleButton = document.getElementById('toggleButton');

let isSignup = true;

toggleButton.addEventListener('click', () => {
  isSignup = !isSignup;

  submitButton.textContent = isSignup ? 'Sign Up' : 'Login';
  toggleButton.textContent = isSignup
    ? 'Switch to Login'
    : 'Switch to Sign Up';

  message.textContent = '';
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  message.textContent = 'Please wait...';

  try {
    const response = await fetch(
      isSignup ? '/signup' : '/login',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      }
    );

    const data = await response.json();

    message.textContent = data.message;

    if (response.ok) {
      form.reset();
    }
  } catch (error) {
    message.textContent = 'Cannot connect to server.';
  }
});