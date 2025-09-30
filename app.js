/******************************
 * MICROGREENS ORDER PROCESSOR - FRONTEND JS *
 ******************************/

// ========== QR Code library handling ========== //
let qrCodeLoaded = typeof QRCode !== 'undefined';

if (!qrCodeLoaded) {
    console.log('QRCode library not loaded - loading dynamically');
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js';
    script.onload = () => {
        qrCodeLoaded = true;
        console.log('QRCode library successfully loaded');
        if (isCheckoutStepThree()) {
            generatePaymentQRCode();
        }
    };
    script.onerror = () => {
        console.error('Failed to load QRCode library');
    };
    document.head.appendChild(script);
}

// ========== CONFIGURATION & DATA ========== //
console.log('Initializing microgreens application');
const storedCart = localStorage.getItem('microgreensCart');
console.log('Initial cart from localStorage:', storedCart ? JSON.parse(storedCart) : []);

// Product data
const productData = {
    "Sunflower Microgreens": {
        image: "images/sunflower.jpg",
        price: 100,
        description: "Sunflower microgreens are packed with nutrients and have a delightful crunchy texture.",
        benefits: [
            "High in protein for energy and muscle repair",
            "Rich in vitamin E and B6 for skin and brain health",
            "Contains magnesium and zinc for immune support",
            "Excellent source of healthy fats and amino acids"
        ],
        usage: [
            "Add to salads for extra crunch",
            "Top avocado toast for nutrition boost",
            "Blend into smoothies for protein",
            "Use as garnish for soups and curries"
        ]
    },
    "Radish Microgreens": {
        image: "images/radish.jpg",
        price: 100,
        description: "Spicy radish microgreens add a kick to any dish while providing powerful nutrients.",
        benefits: [
            "High in vitamin C for immune support",
            "Contains sulforaphane, a potent antioxidant",
            "Supports healthy digestion",
            "May help regulate blood pressure"
        ],
        usage: [
            "Add to tacos and sandwiches for spice",
            "Mix into stir-fries at the last minute",
            "Combine with milder greens in salads",
            "Use as garnish for Asian dishes"
        ]
    },
    "Mustard Microgreens": {
        image: "images/mustard.png",
        price: 90,
        description: "Mustard microgreens bring bold flavor and impressive health benefits.",
        benefits: [
            "Rich in Vitamin K for bone health",
            "Contains compounds that support detoxification",
            "May help boost metabolism",
            "High in antioxidants"
        ],
        usage: [
            "Add to sandwiches for a flavor punch",
            "Mix into egg dishes like omelets",
            "Combine with cheese plates",
            "Use sparingly in dressings"
        ]
    },
    "Wheat Grass": {
        image: "images/wheat-grass.jpg",
        price: 120,
        description: "Wheat grass is a nutrient-packed superfood known for its high chlorophyll content and detoxifying properties.",
        benefits: [
            "Rich in chlorophyll which supports blood health",
            "Contains 17 amino acids for protein building",
            "High in vitamins A, C, and E for immunity",
            "Powerful detoxifier and alkalizing agent"
        ],
        usage: [
            "Juice with lemon and ginger for a health shot",
            "Add to smoothies for nutrient boost",
            "Mix with water as a daily detox drink",
            "Use in salads for texture and nutrition"
        ]
    },
    "Mixed Microgreens": {
        image: "images/mixed.jpg",
        price: 120,
        description: "Our mixed microgreens provide a variety of flavors and nutrients in one convenient package.",
        benefits: [
            "Provides diverse range of nutrients",
            "Offers multiple health benefits in one serving",
            "Contains variety of antioxidants",
            "Supports overall health and wellness"
        ],
        usage: [
            "Perfect base for salads",
            "Great addition to wraps and sandwiches",
            "Use as pizza topping after baking",
            "Mix into grain bowls for extra nutrition"
        ]
    }
};

// Recipe data
const recipeData = {
    "Microgreens Avocado Toast": {
        image: "images/avocado-toast.jpg",
        description: "A nutritious and delicious breakfast option packed with healthy fats and microgreen nutrients.",
        ingredients: [
            "2 slices whole grain bread",
            "1 ripe avocado",
            "50g sunflower microgreens",
            "1 tbsp lemon juice",
            "Salt and pepper to taste",
            "Red pepper flakes (optional)"
        ],
        instructions: [
            "Toast the bread until golden and crisp.",
            "Mash the avocado with lemon juice, salt, and pepper.",
            "Spread the avocado mixture evenly on the toast.",
            "Top generously with sunflower microgreens.",
            "Sprinkle with red pepper flakes if desired.",
            "Serve immediately and enjoy!"
        ],
        benefits: [
            "Rich in healthy monounsaturated fats from avocado",
            "High in fiber for digestive health",
            "Packed with vitamins and minerals from microgreens",
            "Provides sustained energy throughout the morning"
        ]
    },
    "Sunflower Green Smoothie": {
        image: "images/sunflower-smoothie.jpg",
        description: "A protein-packed smoothie that's perfect for post-workout recovery or a nutritious breakfast.",
        ingredients: [
            "1 banana",
            "1 cup almond milk",
            "50g sunflower microgreens",
            "1 tbsp almond butter",
            "1 tsp honey (optional)",
            "Ice cubes"
        ],
        instructions: [
            "Add all ingredients to a blender.",
            "Blend until smooth and creamy.",
            "Add more almond milk if needed for desired consistency.",
            "Pour into a glass and enjoy immediately."
        ],
        benefits: [
            "High in plant-based protein",
            "Rich in vitamins and minerals",
            "Great for muscle recovery",
            "Provides sustained energy"
        ]
    },
    "Microgreen Buddha Bowl": {
        image: "images/buddha-bowl.jpg",
        description: "A colorful and nutritious bowl packed with wholesome ingredients and fresh microgreens.",
        ingredients: [
            "1 cup cooked quinoa",
            "50g mixed microgreens",
            "1/2 avocado, sliced",
            "1/2 cup chickpeas",
            "1/4 cup shredded carrots",
            "1/4 cup sliced cucumber",
            "2 tbsp tahini dressing"
        ],
        instructions: [
            "Arrange quinoa at the bottom of a bowl.",
            "Add microgreens, avocado, chickpeas, carrots, and cucumber.",
            "Drizzle with tahini dressing.",
            "Toss gently before eating or enjoy as arranged."
        ],
        benefits: [
            "Complete plant-based meal",
            "High in fiber and protein",
            "Packed with vitamins and antioxidants",
            "Supports gut health"
        ]
    },
    "Radish Microgreen Salad": {
        image: "images/radish-salad.jpg",
        description: "A refreshing and spicy salad with radish microgreens as the star ingredient.",
        ingredients: [
            "50g radish microgreens",
            "1 cup mixed salad greens",
            "1/2 cup cherry tomatoes, halved",
            "1/4 cup sliced radishes",
            "2 tbsp olive oil",
            "1 tbsp lemon juice",
            "Salt and pepper to taste"
        ],
        instructions: [
            "Combine radish microgreens, salad greens, tomatoes, and radishes in a bowl.",
            "Whisk together olive oil, lemon juice, salt, and pepper.",
            "Drizzle dressing over salad and toss gently.",
            "Serve immediately for maximum freshness."
        ],
        benefits: [
            "High in vitamin C",
            "Supports digestion",
            "Low calorie but nutrient-dense",
            "Antioxidant-rich"
        ]
    }
};

// Google Apps Script endpoint
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyaXzkzgg7-02Pr3uP57ComlaPPRsT4VBYDvSkGrc8qDQwchMuiJQeCRN6Amc9VLLKb/exec";

// Cart functionality
let cart = [];
let currentCheckoutStep = 1;

// UPI Configuration
const UPI_ID = '9738082343-0@airtel';
const PAYEE_NAME = 'Aishaura Microgreens';
const UPI_NOTE = 'Microgreens Order';

// ========== VALIDATION FUNCTIONS ========== //
function validateField(fieldId) {
    const field = document.getElementById(fieldId);
    const value = field.value.trim();
    
    clearFieldError(fieldId);
    
    switch(fieldId) {
        case 'customer-name':
            if (value && value.length < 2) {
                showFieldError(fieldId, 'Name must be at least 2 characters long');
            }
            break;
            
        case 'customer-phone':
            if (value && !/^[6-9]\d{9}$/.test(value)) {
                showFieldError(fieldId, 'Please enter a valid 10-digit Indian mobile number');
            }
            break;
            
        case 'customer-email':
            if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                showFieldError(fieldId, 'Please enter a valid email address');
            }
            break;
            
        case 'customer-address':
            if (value && value.length < 10) {
                showFieldError(fieldId, 'Please provide a complete address');
            }
            break;

        case 'customer-pincode':
            if (value && value.length !== 6) {
                showFieldError(fieldId, 'Please enter a valid 6-digit pincode');
            }
            break;
    }
}

function clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    const formGroup = field.closest('.form-group');
    if (!formGroup) return;
    
    const errorElement = formGroup.querySelector('.error-message');
    
    field.classList.remove('error');
    if (errorElement) {
        errorElement.style.display = 'none';
    }
}

function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    const formGroup = field.closest('.form-group');
    if (!formGroup) return;
    
    // Add error class
    field.classList.add('error');
    
    // Create or update error message
    let errorElement = formGroup.querySelector('.error-message');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        formGroup.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

function clearValidationErrors() {
    const fields = ['customer-name', 'customer-phone', 'customer-email', 'customer-address', 'customer-pincode'];
    fields.forEach(fieldId => {
        if (document.getElementById(fieldId)) {
            clearFieldError(fieldId);
        }
    });
}

function validateCustomerInfo() {
    const name = document.getElementById('customer-name').value.trim();
    const phone = document.getElementById('customer-phone').value.trim();
    const email = document.getElementById('customer-email').value.trim();
    const address = document.getElementById('customer-address').value.trim();
    const pincode = document.getElementById('customer-pincode')?.value.trim();

    // Clear previous errors
    clearValidationErrors();

    let isValid = true;

    // Name validation
    if (!name) {
        showFieldError('customer-name', 'Please enter your full name');
        isValid = false;
    } else if (name.length < 2) {
        showFieldError('customer-name', 'Name must be at least 2 characters long');
        isValid = false;
    }

    // Phone validation
    if (!phone) {
        showFieldError('customer-phone', 'Please enter your phone number');
        isValid = false;
    } else if (!/^[6-9]\d{9}$/.test(phone)) {
        showFieldError('customer-phone', 'Please enter a valid 10-digit Indian mobile number');
        isValid = false;
    }

    // Email validation
    if (!email) {
        showFieldError('customer-email', 'Please enter your email address');
        isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showFieldError('customer-email', 'Please enter a valid email address');
        isValid = false;
    }

    // Address validation
    if (!address) {
        showFieldError('customer-address', 'Please enter your delivery address');
        isValid = false;
    } else if (address.length < 10) {
        showFieldError('customer-address', 'Please provide a complete address with street and landmark');
        isValid = false;
    }

    // Pincode validation (if field exists)
    if (pincode !== undefined) {
        if (!pincode) {
            showFieldError('customer-pincode', 'Please enter your pincode');
            isValid = false;
        } else if (pincode.length !== 6) {
            showFieldError('customer-pincode', 'Please enter a valid 6-digit pincode');
            isValid = false;
        }
    }

    return { valid: isValid };
}

function setupFormValidation() {
    const formFields = ['customer-name', 'customer-phone', 'customer-email', 'customer-address', 'customer-pincode'];
    
    formFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('blur', function() {
                validateField(fieldId);
            });
            
            field.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    clearFieldError(fieldId);
                }
            });
        }
    });
}

// ========== DELIVERY & PINCODE FUNCTIONS ========== //
function setupDeliveryOptions() {
    populateDeliveryDates();
    setupPincodeValidation();
}

function populateDeliveryDates() {
    const deliverySelect = document.getElementById('delivery-date');
    if (!deliverySelect) return;
    
    deliverySelect.innerHTML = '<option value="">Select delivery date</option>';
    
    const today = new Date();
    for (let i = 1; i <= 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        
        if (date.getDay() === 0) continue; // Skip Sundays
        
        const option = document.createElement('option');
        option.value = date.toISOString().split('T')[0];
        option.textContent = date.toLocaleDateString('en-IN', { 
            weekday: 'long', 
            month: 'short', 
            day: 'numeric' 
        });
        
        if (date.getDay() === 5) {
            option.textContent += ' 🚚 (Regular Delivery Day)';
        }
        
        deliverySelect.appendChild(option);
    }
}

function setupPincodeValidation() {
    const pincodeInput = document.getElementById('customer-pincode');
    const checkButton = document.getElementById('check-pincode');
    
    if (!pincodeInput || !checkButton) return;
    
    pincodeInput.addEventListener('input', function() {
        this.value = this.value.replace(/\D/g, '').slice(0, 6);
        clearPincodeMessage();
    });
    
    checkButton.addEventListener('click', validatePincode);
    pincodeInput.addEventListener('blur', validatePincode);
}

async function validatePincode() {
    const pincodeInput = document.getElementById('customer-pincode');
    const messageDiv = document.getElementById('pincode-message');
    const pincode = pincodeInput.value.trim();
    
    clearPincodeMessage();
    
    if (pincode.length !== 6) {
        showPincodeMessage('Please enter a 6-digit pincode', 'error');
        return false;
    }
    
    showPincodeMessage('Checking delivery availability...', 'info');
    
    try {
        const isValid = await checkPincodeDelivery(pincode);
        
        if (isValid) {
            showPincodeMessage('✅ Delivery available in your area!', 'success');
            return true;
        } else {
            showPincodeMessage('❌ Delivery not available in your area. Please contact us for special arrangements.', 'error');
            return false;
        }
    } catch (error) {
        showPincodeMessage('⚠️ Unable to verify delivery. Please continue with your order.', 'warning');
        return true;
    }
}

async function checkPincodeDelivery(pincode) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const firstTwoDigits = parseInt(pincode.substring(0, 2));
            resolve(firstTwoDigits >= 56 && firstTwoDigits <= 59);
        }, 1000);
    });
}

function showPincodeMessage(message, type) {
    const messageDiv = document.getElementById('pincode-message');
    if (!messageDiv) return;
    
    messageDiv.textContent = message;
    messageDiv.className = `pincode-message ${type}`;
    messageDiv.style.display = 'block';
}

function clearPincodeMessage() {
    const messageDiv = document.getElementById('pincode-message');
    if (messageDiv) {
        messageDiv.style.display = 'none';
    }
}

// ========== IMAGE OPTIMIZATION ========== //
function optimizeImages() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.setAttribute('loading', 'lazy');
        img.setAttribute('decoding', 'async');
        
        img.addEventListener('error', function() {
            console.warn('Image failed to load:', this.src);
            this.src = 'images/placeholder.jpg';
            this.alt = 'Image not available';
            this.style.opacity = '1';
        });
        
        if (!img.complete) {
            img.style.opacity = '0';
            img.addEventListener('load', function() {
                this.style.transition = 'opacity 0.3s ease';
                this.style.opacity = '1';
            });
        } else {
            img.style.opacity = '1';
        }
    });
}

// ========== INITIALIZATION ========== //
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded - initializing application');

    // Initialize cart first
    cart = storedCart ? JSON.parse(storedCart) : [];
    console.log('Cart initialized with:', cart);

    // Then initialize all functionality
    initializeModal();
    initializeCart();
    setupProductQuantity();
    setupCheckout();
    updateCartDisplay();
    loadLogo();
    optimizeImages();

    // Initialize form validation and delivery
    setupFormValidation();
    setupDeliveryOptions();
    setupMobileCartClose(); // Add this
});

// ========== LOGO LOADING ========== //
function loadLogo() {
    const logoExtensions = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'];
    const logoBasePath = 'images/generated-image.';
    const logoImg = document.getElementById('logo-img');

    (function tryLogo(i = 0) {
        if (i >= logoExtensions.length) {
            logoImg.alt = "Logo not found";
            logoImg.style.display = "none";
            return;
        }
        const ext = logoExtensions[i];
        const testImg = new Image();
        testImg.onload = function() {
            logoImg.src = logoBasePath + ext;
            logoImg.style.display = "inline";
        };
        testImg.onerror = function() {
            tryLogo(i + 1);
        };
        testImg.src = logoBasePath + ext;
    })();
}

// ========== MODAL FUNCTIONS ========== //
function initializeModal() {
    const modal = document.getElementById('product-modal');
    const closeBtn = document.querySelector('.close-modal');

    // Add click event to all product cards
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', function(e) {
            // Prevent modal from opening if quantity buttons or add to cart button are clicked
            if (e.target.closest('.quantity-selector') || e.target.closest('.add-to-cart')) {
                return;
            }

            const productName = this.querySelector('.gallery-title').textContent;
            const product = productData[productName];

            if (product) {
                document.getElementById('modal-image').src = product.image;
                document.getElementById('modal-image').alt = productName;
                document.getElementById('modal-title').textContent = productName;
                document.getElementById('modal-price').textContent = `₹${product.price} per 50g`;
                document.getElementById('modal-description').textContent = product.description;

                const benefitsList = document.getElementById('modal-benefits');
                benefitsList.innerHTML = '';
                product.benefits.forEach(benefit => {
                    const li = document.createElement('li');
                    li.textContent = benefit;
                    benefitsList.appendChild(li);
                });

                const usageList = document.getElementById('modal-usage');
                usageList.innerHTML = '<h3>Usage Tips</h3>';
                const productUsageList = document.createElement('ul');
                product.usage.forEach(use => {
                    const li = document.createElement('li');
                    li.textContent = use;
                    productUsageList.appendChild(li);
                });
                usageList.appendChild(productUsageList);

                // Set initial quantity to 50g for modal add to cart
                document.querySelector('#product-modal .quantity-input').value = 50;

                document.getElementById('add-to-cart-modal').onclick = function() {
                    const quantity = parseInt(document.querySelector('#product-modal .quantity-input').value);
                    addToCart(productName, quantity, product.price);
                    modal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                };

                document.querySelector('#product-modal .quantity-selector').style.display = 'flex';
                document.getElementById('add-to-cart-modal').style.display = 'block';

                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Add click event to all recipe cards
    document.querySelectorAll('.recipe-art').forEach(recipeCard => {
        recipeCard.addEventListener('click', function() {
            const recipeName = this.querySelector('.gallery-title').textContent;
            const recipe = recipeData[recipeName];

            if (recipe) {
                document.getElementById('modal-image').src = recipe.image;
                document.getElementById('modal-image').alt = recipeName;
                document.getElementById('modal-title').textContent = recipeName;
                document.getElementById('modal-price').textContent = '';
                document.getElementById('modal-description').textContent = recipe.description;

                const benefitsList = document.getElementById('modal-benefits');
                benefitsList.innerHTML = '<h3>Benefits</h3>';
                const recipeBenefitsList = document.createElement('ul');
                recipe.benefits.forEach(benefit => {
                    const li = document.createElement('li');
                    li.textContent = benefit;
                    recipeBenefitsList.appendChild(li);
                });
                benefitsList.appendChild(recipeBenefitsList);

                const usageList = document.getElementById('modal-usage');
                usageList.innerHTML = '<h3>Ingredients</h3>';
                const ingredientsList = document.createElement('ul');
                recipe.ingredients.forEach(ingredient => {
                    const li = document.createElement('li');
                    li.textContent = ingredient;
                    ingredientsList.appendChild(li);
                });
                usageList.appendChild(ingredientsList);

                usageList.innerHTML += '<h3>Instructions</h3>';
                const instructionsList = document.createElement('ol');
                recipe.instructions.forEach(instruction => {
                    const li = document.createElement('li');
                    li.textContent = instruction;
                    instructionsList.appendChild(li);
                });
                usageList.appendChild(instructionsList);

                document.querySelector('#product-modal .quantity-selector').style.display = 'none';
                document.getElementById('add-to-cart-modal').style.display = 'none';

                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            }
        });
    });

    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    // Close modal if clicking outside content
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

// ========== CART FUNCTIONS ========== //
function initializeCart() {
    const cartIcon = document.getElementById('cart-icon');
    const cartDropdown = document.getElementById('cart-dropdown');
    
    // Toggle cart dropdown
    cartIcon.addEventListener('click', function(event) {
        event.stopPropagation();
        cartDropdown.classList.toggle('show');
        
        // Hide cart count when dropdown is open
        const cartCount = document.getElementById('cart-count');
        if (cartDropdown.classList.contains('show')) {
            cartCount.style.display = 'none';
        } else {
            cartCount.style.display = 'flex';
        }
    });

    // Close cart dropdown if clicking outside
    document.addEventListener('click', function(event) {
        const cartContainer = document.getElementById('cart-container');
        if (cartDropdown.classList.contains('show') && !cartContainer.contains(event.target)) {
            closeCartDropdown();
        }
    });

    // Close cart when clicking on close button in mobile
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('close-cart') || 
            event.target.closest('.close-cart')) {
            closeCartDropdown();
        }
    });

    document.getElementById('clear-cart').addEventListener('click', clearCart);

    document.getElementById('view-cart').addEventListener('click', function() {
        showCheckoutModal();
        closeCartDropdown();
    });

    document.getElementById('checkout-btn').addEventListener('click', function() {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        showCheckoutModal();
        closeCartDropdown();
    });
}

function closeCartDropdown() {
    const cartDropdown = document.getElementById('cart-dropdown');
    const cartCount = document.getElementById('cart-count');
    
    cartDropdown.classList.remove('show');
    cartCount.style.display = 'flex';
}

function setupProductQuantity() {
    console.log('Setting up product quantity controls');

    document.body.addEventListener('click', function(e) {
        if (e.target.classList.contains('quantity-btn')) {
            const btn = e.target;
            const input = btn.parentElement.querySelector('.quantity-input');
            let value = parseInt(input.value);
            const step = parseInt(input.step) || 50;
            const min = parseInt(input.min) || 50;

            value = btn.classList.contains('minus')
                ? Math.max(min, value - step)
                : value + step;

            input.value = value;
        } else if (e.target.classList.contains('add-to-cart')) {
            const btn = e.target;
            const product = btn.getAttribute('data-product');
            const price = parseFloat(btn.getAttribute('data-price'));
            const quantity = parseInt(btn.parentElement.querySelector('.quantity-input').value);

            addToCart(product, quantity, price);
        }
    });
}

function addToCart(product, quantity, price) {
    console.log('Adding to cart:', { product, quantity, price });

    if (!product || !productData[product]) {
        console.error('Invalid product:', product);
        return;
    }

    quantity = Math.max(50, parseInt(quantity) || 50);
    price = parseFloat(price) || productData[product].price;

    const existingIndex = cart.findIndex(item => item.product === product);
    if (existingIndex >= 0) {
        cart[existingIndex].quantity = quantity;
    } else {
        cart.push({ product, quantity, price });
    }

    localStorage.setItem('microgreensCart', JSON.stringify(cart));
    updateCartDisplay();
    showCartNotification(`${quantity}g of ${product} added to cart`);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('microgreensCart', JSON.stringify(cart));
    updateCartDisplay();
    if (cart.length === 0) {
        document.getElementById('checkout-modal').style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function updateItemQuantity(index, newQuantity) {
    if (newQuantity >= 50) {
        cart[index].quantity = newQuantity;
        localStorage.setItem('microgreensCart', JSON.stringify(cart));
        updateCartDisplay();
    }
}

function clearCart() {
    cart = [];
    localStorage.removeItem('microgreensCart');
    updateCartDisplay();
    closeCartDropdown();
    document.getElementById('checkout-modal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function updateCartDisplay() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartDelivery = document.getElementById('cart-delivery');
    const cartTotal = document.getElementById('cart-total');

    cartCount.textContent = cart.length;
    cartItems.innerHTML = '';

    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align:center; color:#666;">Your cart is empty</p>';
        cartSubtotal.textContent = '₹0';
        cartDelivery.textContent = 'FREE';
        cartTotal.textContent = 'Total: ₹0';
        return;
    }

    let subtotal = 0;

    cart.forEach((item, index) => {
        const itemPrice = (item.quantity / 50) * item.price;
        subtotal += itemPrice;

        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';

        itemElement.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.product}</h4>
                <div>${item.quantity}g @ ₹${item.price}/50g</div>
                <div class="item-total">₹${itemPrice.toFixed(2)}</div>
            </div>
            <button class="remove-item" data-index="${index}">×</button>
        `;

        cartItems.appendChild(itemElement);
    });

    const total = subtotal;

    cartSubtotal.textContent = `₹${subtotal.toFixed(2)}`;
    cartDelivery.textContent = 'FREE';
    cartTotal.innerHTML = `<span>Total:</span> <span>₹${total.toFixed(2)}</span>`;

    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            removeFromCart(index);
        });
    });
}

function calculateOrderTotal() {
    console.log('Calculating order total from cart:', cart);
    const subtotal = cart.reduce((total, item) => {
        const itemTotal = (item.quantity / 50) * item.price;
        console.log(`Calculating: ${item.product} - ${item.quantity}g @ ₹${item.price}/50g = ₹${itemTotal.toFixed(2)}`);
        return total + itemTotal;
    }, 0);
    console.log('Final subtotal:', subtotal);
    return subtotal;
}

function showCartNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// ========== CHECKOUT FUNCTIONS ========== //
function showCheckoutModal() {
    document.getElementById('checkout-modal').style.display = 'block';
    document.body.style.overflow = 'hidden';
    showCheckoutStep(1);
}

function showCheckoutStep(step) {
    currentCheckoutStep = step;

    document.querySelectorAll('.step').forEach(stepEl => {
        stepEl.classList.remove('active');
        if (parseInt(stepEl.getAttribute('data-step')) <= step) {
            stepEl.classList.add('active');
        }
    });

    document.querySelectorAll('.checkout-step').forEach(stepEl => {
        stepEl.style.display = 'none';
    });
    document.getElementById(`step-${step}`).style.display = 'block';

    if (step === 1) {
        updateCheckoutItems();
    } else if (step === 3) {
        updatePaymentSummary();
        generatePaymentQRCode();
    }
}

function setupCheckout() {
    document.getElementById('btn-continue').addEventListener('click', function() {
        if (cart.length === 0) {
            alert('Your cart is empty. Please add items before placing an order.');
            return;
        }
        showCheckoutStep(2);
    });

    document.querySelectorAll('.btn-back').forEach(btn => {
        btn.addEventListener('click', function() {
            const currentStepEl = document.querySelector('.checkout-step[style="display: block;"]');
            const currentStep = parseInt(currentStepEl.id.replace('step-', ''));

            if (currentStep > 1) {
                showCheckoutStep(currentStep - 1);
            } else {
                document.getElementById('checkout-modal').style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    });

    document.getElementById('btn-to-payment').addEventListener('click', function() {
        const validation = validateCustomerInfo();
        if (validation.valid) {
            showCheckoutStep(3);
        } else {
            showErrorNotification('Please fix the form errors before continuing');
        }
    });

    document.querySelectorAll('.payment-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.payment-option').forEach(opt => {
                opt.classList.remove('active');
            });
            this.classList.add('active');
        });
    });

    document.getElementById('btn-place-order').addEventListener('click', submitOrder);

    document.querySelector('#checkout-modal .close-modal').addEventListener('click', function() {
        document.getElementById('checkout-modal').style.display = 'none';
        document.body.style.overflow = 'auto';
    });
}

function isCheckoutStepThree() {
    const modal = document.getElementById('checkout-modal');
    return modal && modal.style.display === 'block' && currentCheckoutStep === 3;
}

function generatePaymentQRCode() {
    const qrContainer = document.querySelector('#step-3 #upi-qr-code');
    if (!qrContainer) {
        console.warn('QR container not found in step 3');
        return;
    }

    qrContainer.innerHTML = '';

    const total = calculateOrderTotal();
    const upiLink =
        `upi://pay?pa=${encodeURIComponent(UPI_ID)}` +
        `&pn=${encodeURIComponent(PAYEE_NAME)}` +
        `&am=${total.toFixed(2)}&cu=INR&tn=${encodeURIComponent(UPI_NOTE)}`;

    if (typeof QRCode === 'undefined') {
        showQRCodeFallback(qrContainer, total, upiLink);
        return;
    }

    new QRCode(qrContainer, {
        text: upiLink,
        width: 200,
        height: 200,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });

    const payBtn = document.getElementById('upi-pay-button');
    if (payBtn) {
        payBtn.onclick = () => window.open(upiLink, '_blank');
    }
}

function showQRCodeFallback(qrContainer, total) {
    qrContainer.innerHTML = `
        <div class="upi-fallback">
            <p>Please send payment to:</p>
            <p class="upi-id">${UPI_ID}</p>
            <p>Amount: ₹${total.toFixed(2)}</p>
            <button id="manual-upi-pay" class="upi-pay-button">Pay with UPI App</button>
        </div>
    `;

    const upiLink = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(PAYEE_NAME)}&am=${total.toFixed(2)}&cu=INR&tn=${encodeURIComponent(UPI_NOTE)}`;
    
    document.getElementById('manual-upi-pay').addEventListener('click', function() {
        window.open(upiLink, '_blank');
    });
}
// Show/hide mobile close button based on screen size
function setupMobileCartClose() {
    const closeBtn = document.querySelector('.cart-close-mobile');
    const cartDropdown = document.getElementById('cart-dropdown');
    
    function checkScreenSize() {
        if (window.innerWidth <= 768) {
            closeBtn.style.display = 'block';
        } else {
            closeBtn.style.display = 'none';
        }
    }
    
    // Check on load and resize
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
}

// Call this in your DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    // ... your existing code
    setupMobileCartClose();
});
function updateCheckoutItems() {
    const itemsContainer = document.getElementById('checkout-items');
    itemsContainer.innerHTML = '';

    let subtotal = 0;

    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'order-item';

        const itemPrice = (item.quantity / 50) * item.price;
        subtotal += itemPrice;

        itemElement.innerHTML = `
            <div class="order-item-name">${item.product} (${item.quantity}g)</div>
            <div class="order-item-price">₹${itemPrice.toFixed(2)}</div>
        `;

        itemsContainer.appendChild(itemElement);
    });

    const total = subtotal;

    document.getElementById('checkout-subtotal').textContent = `₹${subtotal.toFixed(2)}`;
    document.getElementById('checkout-delivery').textContent = 'FREE';
    document.getElementById('checkout-total').textContent = `₹${total.toFixed(2)}`;
}

function updatePaymentSummary() {
    const container = document.getElementById('payment-order-items');
    container.innerHTML = '';

    const total = cart.reduce((sum, item) => {
        const itemPrice = (item.quantity / 50) * item.price;
        container.innerHTML += `
            <div class="order-item">
                <div class="order-item-name">${item.product} (${item.quantity}g)</div>
                <div class="order-item-price">₹${itemPrice.toFixed(2)}</div>
            </div>
        `;
        return sum + itemPrice;
    }, 0);

    document.getElementById('payment-total').textContent = `₹${total.toFixed(2)}`;
}

// ========== ORDER SUBMISSION FUNCTIONS ========== //
function generateOrderId() {
    const date = new Date();
    return 'ORD-' + 
        date.getFullYear().toString().substr(-2) + 
        (date.getMonth() + 1).toString().padStart(2, '0') + 
        date.getDate().toString().padStart(2, '0') + '-' + 
        Math.floor(1000 + Math.random() * 9000);
}

async function submitOrder() {
    const submitBtn = document.getElementById('btn-place-order');
    const originalText = submitBtn.innerHTML;
    
    try {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="btn-loading"></span> Processing...';
        
        const validation = validateCustomerInfo();
        if (!validation.valid) {
            showErrorNotification('Please fix the errors in the form before submitting');
            return;
        }

        const orderData = {
            name: document.getElementById('customer-name').value.trim(),
            phone: document.getElementById('customer-phone').value.trim(),
            email: document.getElementById('customer-email').value.trim(),
            address: document.getElementById('customer-address').value.trim(),
            pincode: document.getElementById('customer-pincode')?.value.trim() || '',
            delivery_date: document.getElementById('delivery-date')?.value || '',
            notes: document.getElementById('customer-notes').value.trim(),
            payment_method: document.querySelector('.payment-option.active')?.getAttribute('data-method') || 'upi',
            amount: calculateOrderTotal().toFixed(2),
            products: JSON.stringify(cart),
            order_summary: generateOrderSummary(),
            timestamp: new Date().toISOString()
        };

        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(orderData)
        });

        if (!response.ok) {
            throw new Error(`Server returned ${response.status} status`);
        }

        const result = await response.json();

        if (!result || !result.orderId) {
            throw new Error("Missing order ID in response");
        }

        await handleOrderSuccess(result.orderId, orderData);
        
    } catch (error) {
        console.error('Order submission error:', error);
        showErrorNotification(`Order failed: ${error.message}. Please try again or contact us.`);
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

function generateOrderSummary() {
    let summary = "Order Details:\n";
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = (item.quantity / 50) * item.price;
        total += itemTotal;
        summary += `• ${item.product}: ${item.quantity}g - ₹${itemTotal.toFixed(2)}\n`;
    });
    
    summary += `\nSubtotal: ₹${total.toFixed(2)}`;
    summary += `\nDelivery: FREE`;
    summary += `\nTotal: ₹${total.toFixed(2)}`;
    
    return summary;
}

async function handleOrderSuccess(orderId, orderData) {
    showOrderConfirmation(orderId, orderData.amount);
    
    // Show enhanced success notification instead of WhatsApp
    showEnhancedSuccessNotification(orderId, orderData);
    
    clearCart();
    updateCartDisplay();
}

function showEnhancedSuccessNotification(orderId, orderData) {
    const notification = document.createElement('div');
    notification.className = 'success-notification enhanced';
    notification.innerHTML = `
        <div style="text-align: center;">
            <div style="font-size: 2rem; margin-bottom: 10px;">✅</div>
            <h3 style="margin: 0 0 10px 0; color: #2d5016;">Order Confirmed!</h3>
            <p style="margin: 5px 0; font-weight: bold;">Order ID: #${orderId}</p>
            <p style="margin: 5px 0;">Total Amount: ₹${parseFloat(orderData.amount).toFixed(2)}</p>
            <p style="margin: 5px 0; font-size: 0.9rem; color: #666;">
                We'll contact you shortly with delivery details.
            </p>
        </div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 5000); // Show for 5 seconds
    }, 10);
}

function formatDeliveryDate(dateString) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
}

// ========== NOTIFICATION FUNCTIONS ========== //
function showSuccessNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.innerHTML = `
        <span>✓</span>
        <span>${message}</span>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }, 10);
}

function showErrorNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'error-notification';
    notification.innerHTML = `
        <span>✗</span>
        <span>${message}</span>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 5000);
    }, 10);
}

// Force center the checkout modal
function centerCheckoutModal() {
    const checkoutModal = document.getElementById('checkout-modal');
    const modalContent = checkoutModal.querySelector('.modal-content');
    
    if (modalContent) {
        modalContent.style.cssText = `
            position: fixed !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            margin: 0 !important;
            width: 90% !important;
            max-width: 600px !important;
            max-height: 90vh !important;
            overflow-y: auto !important;
        `;
    }
}

// Call this when showing the checkout modal
function showCheckoutModal() {
    document.getElementById('checkout-modal').style.display = 'block';
    document.body.style.overflow = 'hidden';
    showCheckoutStep(1);
    centerCheckoutModal(); // Add this line
}

// Also call it when showing order confirmation
function showOrderConfirmation(orderId, total) {
    document.getElementById('confirmation-id').textContent = orderId;
    document.getElementById('confirmation-total').textContent = `₹${parseFloat(total).toFixed(2)}`;
    showCheckoutStep(4);
    centerCheckoutModal(); // Add this line
}
