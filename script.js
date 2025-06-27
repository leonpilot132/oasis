document.addEventListener('DOMContentLoaded', () => {
    const baseOptions = document.querySelectorAll('input[name="base"]');
    const sauceOptions = document.querySelectorAll('input[name="sauce"]');
    const cheeseOptions = document.querySelectorAll('input[name="cheese"]');
    const veggieOptions = document.querySelectorAll('input[name="veggie"]');

    const summaryBase = document.getElementById('summary-base');
    const summarySauce = document.getElementById('summary-sauce');
    const summaryCheese = document.getElementById('summary-cheese');
    const summaryVeggies = document.getElementById('summary-veggies');
    const totalPriceSpan = document.getElementById('total-price');

    const suggestNameBtn = document.getElementById('suggest-name-btn');
    const generateDescriptionBtn = document.getElementById('generate-description-btn');
    const addToCartBtn = document.getElementById('add-to-cart-btn');

    let currentPizza = {
        base: { name: '', price: 0 },
        sauce: { name: '', price: 0 },
        cheese: { name: '', price: 0 },
        veggies: []
    };

    function updateSummary() {
        let total = 0;

        // Base
        const selectedBase = Array.from(baseOptions).find(radio => radio.checked);
        if (selectedBase) {
            currentPizza.base.name = selectedBase.value;
            currentPizza.base.price = parseFloat(selectedBase.dataset.price);
            summaryBase.textContent = `${currentPizza.base.name} ($${currentPizza.base.price})`;
            total += currentPizza.base.price;
        }

        // Sauce
        const selectedSauce = Array.from(sauceOptions).find(radio => radio.checked);
        if (selectedSauce) {
            currentPizza.sauce.name = selectedSauce.value;
            currentPizza.sauce.price = parseFloat(selectedSauce.dataset.price);
            summarySauce.textContent = `${currentPizza.sauce.name} ($${currentPizza.sauce.price})`;
            total += currentPizza.sauce.price;
        }

        // Cheese
        const selectedCheese = Array.from(cheeseOptions).find(radio => radio.checked);
        if (selectedCheese) {
            currentPizza.cheese.name = selectedCheese.value;
            currentPizza.cheese.price = parseFloat(selectedCheese.dataset.price);
            summaryCheese.textContent = `${currentPizza.cheese.name} ($${currentPizza.cheese.price})`;
            total += currentPizza.cheese.price;
        }

        // Veggies
        currentPizza.veggies = [];
        const selectedVeggies = Array.from(veggieOptions).filter(checkbox => checkbox.checked);
        if (selectedVeggies.length > 0) {
            summaryVeggies.textContent = selectedVeggies.map(v => {
                const veggiePrice = parseFloat(v.dataset.price);
                currentPizza.veggies.push({ name: v.value, price: veggiePrice });
                total += veggiePrice;
                return `${v.value} ($${veggiePrice})`;
            }).join(', ');
        } else {
            summaryVeggies.textContent = 'None selected';
        }

        totalPriceSpan.textContent = `$${total.toFixed(2)}`;
    }

    // Add event listeners
    baseOptions.forEach(radio => radio.addEventListener('change', updateSummary));
    sauceOptions.forEach(radio => radio.addEventListener('change', updateSummary));
    cheeseOptions.forEach(radio => radio.addEventListener('change', updateSummary));
    veggieOptions.forEach(checkbox => checkbox.addEventListener('change', updateSummary));

    // Initial update
    updateSummary();

    // Event listeners for AI/ML buttons (conceptual)
    suggestNameBtn.addEventListener('click', () => {
        // In a real application, this would make an API call to a backend
        // that uses an AI model (e.g., GPT, custom ML model) to suggest a name
        alert('AI Suggestion: "The Green Goddess Delight" (This would come from a real AI API)');
        console.log('Current Pizza Config for AI:', currentPizza);
    });

    generateDescriptionBtn.addEventListener('click', () => {
        // Similar to suggest name, this would call an AI API
        alert('AI Description: "A delightful blend of fresh veggies, rich mozzarella, and tangy marinara on a perfect thin crust." (From AI API)');
        console.log('Current Pizza Config for AI:', currentPizza);
    });

    addToCartBtn.addEventListener('click', () => {
        // In a real application, this would:
        // 1. Send the currentPizza object to a backend API (e.g., using fetch API or Axios)
        // 2. The backend would store it in a database (e.g., cart collection)
        // 3. Then redirect the user to the checkout page.
        alert('Pizza added to cart! Proceeding to checkout (conceptually).');
        console.log('Adding to cart:', currentPizza);
        // Example of what might happen next (redirect to checkout)
        // window.location.href = 'checkout.html';
    });
});
