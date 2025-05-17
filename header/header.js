
function updateCartCount() {
    
    const cartCountEl = document.getElementById('cart-count');
    
    
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    
    const count = cartItems.length;
    
    cartCountEl.textContent = count;
    
   
    if (count > 0) {
      cartCountEl.style.display = 'inline-block';
    } else {
      cartCountEl.style.display = 'none';
    }
  }
  

  function addToCart(productId) {
    
    productId = parseInt(productId);
    
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    
    const exists = cartItems.some(item => item.id === productId);
    
    if (!exists) {
      cartItems.push({ id: productId });
      
      localStorage.setItem('cart', JSON.stringify(cartItems));
      updateCartCount();
      
    } 
  }
  

  document.addEventListener('DOMContentLoaded', function() {
  
    updateCartCount();
    
    const addButtons = document.querySelectorAll('.add-to-cart');
    
 
    addButtons.forEach(function(button) {
      button.addEventListener('click', function() {
     
        const productId = this.getAttribute('data-id');
        
      
        addToCart(productId);
      });
    });
  });