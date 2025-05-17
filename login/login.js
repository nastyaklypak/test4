document.getElementById('login-form').addEventListener('submit', async function(event) {
  event.preventDefault();

  const loginInput = this.login.value.trim();
  const passwordInput = this.password.value.trim();

  clearValidationErrors();

  let isValid = true;

  // Валідація логіну
  if (!loginInput) {
    showValidationError('login', 'Логін обов’язковий');
    isValid = false;
  }

  // Валідація пароля
  if (!passwordInput) {
    showValidationError('password', 'Пароль обов’язковий');
    isValid = false;
  }

  if (!isValid) return;

  const submitButton = this.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  submitButton.textContent = 'Зачекайте...';

  const url = 'https://chnu-student-interview-preparation.netlify.app/.netlify/functions/userLogin';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: loginInput, password: passwordInput }),
    });

    if (!response.ok) {
      throw new Error('Невірний логін або пароль');
    }

    const data = await response.json();

    localStorage.setItem('token', data.token);
    localStorage.setItem('role', data.role);

    alert('Вхід успішний!');
    window.location.href = '../index.html';

  } catch (error) {
    alert(error.message);
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = 'Увійти';
  }
});

function showValidationError(fieldName, message) {
  const input = document.querySelector(`input[name="${fieldName}"]`);
  if (!input) return;

  input.classList.add('input-error');

  let errorElem = input.parentNode.querySelector('.error-message');
  if (!errorElem) {
    errorElem = document.createElement('div');
    errorElem.className = 'error-message';
    errorElem.style.color = 'red';
    errorElem.style.fontSize = '13px';
    input.parentNode.appendChild(errorElem);
  }

  errorElem.textContent = message;
}

function clearValidationErrors() {
  document.querySelectorAll('.error-message').forEach(el => el.remove());
  document.querySelectorAll('.input-error').forEach(input => {
    input.classList.remove('input-error');
  });
}
