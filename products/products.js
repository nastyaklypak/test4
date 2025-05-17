class Product {
    constructor() {
        this.catalog = CATALOG;
        this.filteredCatalog = [...this.catalog];
        this.itemsPerPage = 4;
        this.shownItems = 0;
    }

    render() {
        this.renderDropdown();
        this.renderProducts();
        this.addDropdownFunctionality();
    }

    renderDropdown() {
        const categories = ['All'];
        const categoryNames = this.catalog.map(item => item.category);

        categoryNames.forEach(category => {
            if (!categories.includes(category)) {
                categories.push(category);
            }
        });

        const menu = document.querySelector('.menu');
        menu.innerHTML = categories.map(category => `<li>${category}</li>`).join('');

        this.updateDropdownOptions();
    }

    loadMore() {
        const productsElements = document.querySelectorAll(".products-element");
        const btnMore = document.querySelector(".btn-more");

        this.showItems(productsElements);

        btnMore.addEventListener("click", (e) => {
            e.preventDefault();
            this.shownItems += this.itemsPerPage;
            this.showItems(productsElements);

            if (this.shownItems >= productsElements.length) {
                btnMore.textContent = "No content";
                btnMore.classList.add("nocontent");
                btnMore.disabled = true;
            }
        });
    }

    showItems(items) {
        for (let i = 0; i < this.shownItems + this.itemsPerPage; i++) {
            if (items[i]) {
                items[i].classList.add("show");
            }
        }
    }

    renderProducts() {
        let htmlCatalog = '';

        this.filteredCatalog.forEach(({ name, price, img, description }) => {
            htmlCatalog += `
                <li class="products-element">
                    <span class="products-element__name">${name}</span>
                    <img class="products-element__img" src="${img}" />
                    <span class="products-element__price">${price}</span>
                    <p class="products-element__description hidden">${description}</p>
                    <button class="products-element__btn">Додати в кошик</button>
                </li>`;
        });

        document.getElementById("products").innerHTML = `<ul class="products-container">${htmlCatalog}</ul>`;

        const cart  = {};
        this.shownItems = 0;
        this.loadMore();
        this.addDescriptionToggle();
        this.addHoverEffect();
        this.addHoverEffect();
        this.addToCartFunctionality();
    }

    addToCartFunctionality() {
        const buttons = document.querySelectorAll('.products-element__btn');
    
        buttons.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                const product = this.filteredCatalog[index];
                if (!product || !product.id) {
                    console.error("Неможливо додати товар без ID");
                    return;
                }
    
                addToCart(product.id); 
    
                console.log(`Додано до кошика: ${product.name}`);
                alert(`Додано до кошика: ${product.name}`);
            });
        });
    }
    

    addDescriptionToggle() {
        document.querySelectorAll('.products-element__img').forEach((img, index) => {
            img.addEventListener('click', () => {
                const description = document.querySelectorAll('.products-element__description')[index];
                description.classList.toggle('hidden');
            });
        });
    }

    addDropdownFunctionality() {
        const select = document.querySelector('.select');
        const caret = document.querySelector('.caret');
        const menu = document.querySelector('.menu');

        select.addEventListener('click', () => {
            select.classList.toggle('selected-clicked');
            caret.classList.toggle('caret-rotate');
            menu.classList.toggle('menu-open');
        });

        this.updateDropdownOptions();
    }

    updateDropdownOptions() {
        const options = document.querySelectorAll('.menu li');
        const selected = document.querySelector('.selected');

        options.forEach(option => {
            option.addEventListener('click', () => {
                selected.innerText = option.innerText;
                document.querySelector('.menu').classList.remove('menu-open');
                document.querySelector('.caret').classList.remove('caret-rotate');
                document.querySelector('.select').classList.remove('selected-clicked');

                this.filterProducts(option.innerText);
            });
        });
    }

    filterProducts(category) {
        if (category === 'All') {
            this.filteredCatalog = [...this.catalog];
        } else {
            this.filteredCatalog = this.catalog.filter(item => item.category === category);
        }
        this.renderProducts();
    }

    addHoverEffect() {
        const images = document.querySelectorAll('.products-element__img');
        
        images.forEach(image => {
            image.addEventListener('mouseenter', () => {
                image.style.transform = 'scale(0.9)';
                image.style.transition = 'transform 0.3s ease';
            });

            image.addEventListener('mouseleave', () => {
                image.style.transform = 'scale(1)';
            });
        });
    }
   

}

let timerInterval;
let timeLeft = 10;

function showAdvertisement() {
    const advertisement = document.getElementById("advertisement");
    const closeBtn = document.getElementById("close-btn");
    const timerDisplay = document.getElementById("timer");

    advertisement.classList.add("show");
    closeBtn.disabled = true; 

    timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            timerDisplay.textContent = timeLeft;
        } else {
            clearInterval(timerInterval);
            closeBtn.disabled = false; 
        }
    }, 1000);
}

setTimeout(showAdvertisement, 5000);

document.getElementById("close-btn").addEventListener("click", () => {
    const advertisement = document.getElementById("advertisement");
    advertisement.classList.remove("show");
});

window.addEventListener("scroll", () => {
    if (window.scrollY > 200 && !document.getElementById("advertisement").classList.contains("show")) {
        showAdvertisement();
    }
});


window.addEventListener("load", () => {
    const subscriptionModal = document.getElementById("subscription-modal");
    const acceptBtn = document.getElementById("accept-btn");
    const declineBtn = document.getElementById("decline-btn");
    const thankYouMessage = document.getElementById("thank-you-message");

    if (!sessionStorage.getItem("subscribed")) {
        setTimeout(() => {
            subscriptionModal.classList.add("show"); 
           
        }, 3000);
    }

    acceptBtn.addEventListener("click", () => {
        sessionStorage.setItem("subscribed", "true");
        subscriptionModal.classList.remove("show"); 
        showThankYouMessage();
    });

    declineBtn.addEventListener("click", () => {
        subscriptionModal.classList.remove("show"); 
    });

    function showThankYouMessage() {
        thankYouMessage.classList.add("show");
        setTimeout(() => {
            thankYouMessage.classList.add("hidden");
        }, 2000);
    }
});


const productsPage = new Product();
productsPage.render();