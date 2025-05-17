// Функція для обробки форми додавання товару
document.addEventListener('DOMContentLoaded', function() {
  const addProductForm = document.getElementById('addProductForm');
  const successMessage = document.getElementById('successMessage');
  
  if (addProductForm) {
    addProductForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Перевірка авторизації
      const token = localStorage.getItem('token');
      if (!token) {
        successMessage.textContent = 'Помилка: Ви не авторизовані';
        successMessage.style.color = 'red';
        return;
      }
      
      // Отримання значень з форми
      const name = document.getElementById('name').value;
      const img = document.getElementById('img').value;
      const price = document.getElementById('price').value;
      const category = document.getElementById('category').value;
      const description = document.getElementById('description').value;
      const stock = parseInt(document.getElementById('stock').value);
      
      // Генерація ID (в реальному проекті ID зазвичай генерується на сервері)
      const newId = Math.floor(Math.random() * 10000) + 100;
      
      // Створення об'єкта товару
      const newProduct = {
        id: newId,
        name,
        img,
        price,
        category,
        description,
        stock
      };
      
      // Відправка товару на сервер
      sendProductToServer(newProduct, token);
    });
  }
  
  // Функція для відправки товару на сервер
  function sendProductToServer(product, token) {
    const apiUrl = 'https://chnu-student-interview-preparation.netlify.app/.netlify/functions/userCreateItem';
    
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(product)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Товар успішно додано:', data);
      // Очищення форми
      document.getElementById('addProductForm').reset();
      // Показ повідомлення про успіх
      successMessage.textContent = 'Товар успішно додано!';
      successMessage.style.color = 'green';
      // Приховування повідомлення через 3 секунди
      setTimeout(() => {
        successMessage.textContent = '';
      }, 3000);
    })
    .catch(error => {
      console.error('Помилка при додаванні товару:', error);
      successMessage.textContent = `Помилка: ${error.message}`;
      successMessage.style.color = 'red';
    });
  }
});