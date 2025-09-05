document.addEventListener('DOMContentLoaded', () => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function showCartCount() {
        const total = cart.reduce((sum, item) => sum + item.quantity, 0);
        document.getElementById('cart-count').textContent = total;
    }

    function renderCart() {
        const container = document.getElementById('cart-items-container');
        const emptyMsg = document.getElementById('empty-cart-message');
        const table = document.getElementById('cart-items');
        const totalField = document.getElementById('cart-total');

        if (cart.length === 0) {
            container.classList.add('d-none');
            emptyMsg.classList.remove('d-none');
        } else {
            emptyMsg.classList.add('d-none');
            container.classList.remove('d-none');
            table.innerHTML = '';
            let sum = 0;

            cart.forEach((item, i) => {
                const itemTotal = item.price * item.quantity;
                sum += itemTotal;

                const row = document.createElement('tr');
                row.innerHTML = `
          <td>
            <div class="d-flex align-items-center">
              <img src="${item.img}" class="cart-item-img me-3" alt="${item.name}">
              <div>${item.name}</div>
            </div>
          </td>
          <td>$${item.price.toFixed(2)}</td>
          <td>
            <div class="input-group input-group-sm" style="width: 100px;">
              <button class="btn btn-outline-secondary decrease" data-i="${i}">-</button>
              <input type="number" class="form-control text-center" value="${item.quantity}" readonly>
              <button class="btn btn-outline-secondary increase" data-i="${i}">+</button>
            </div>
          </td>
          <td>$${itemTotal.toFixed(2)}</td>
          <td>
            <button class="btn btn-sm btn-outline-danger remove" data-i="${i}">
              <i class="bi bi-trash"></i>
            </button>
          </td>
        `;
                table.appendChild(row);
            });

            totalField.textContent = `$${sum.toFixed(2)}`;
        }

        showCartCount();
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.productId;
            const name = btn.dataset.productName;
            const price = parseFloat(btn.dataset.productPrice);
            const img = btn.dataset.productImg;

            const existing = cart.findIndex(item => item.id === id);
            if (existing >= 0) {
                cart[existing].quantity++;
            } else {
                cart.push({ id, name, price, img, quantity: 1 });
            }

            const toast = document.createElement('div');
            toast.className = 'position-fixed z-3 bottom-0 end-0 p-3';
            toast.innerHTML = `
        <div class="toast show" role="alert">
          <div class="toast-header">
            <i class="bi bi-cart-check text-success me-2"></i>
            <strong class="me-auto">Added to Cart</strong>
            <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
          </div>
          <div class="toast-body">${name} added to your cart.</div>
        </div>
      `;
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 3000);

            renderCart();
        });
    });

    document.getElementById('cart-items-container')?.addEventListener('click', e => {
        if (e.target.classList.contains('increase')) {
            cart[e.target.dataset.i].quantity++;
        }
        if (e.target.classList.contains('decrease')) {
            const i = e.target.dataset.i;
            cart[i].quantity > 1 ? cart[i].quantity-- : cart.splice(i, 1);
        }
        if (e.target.classList.contains('remove') || e.target.parentElement.classList.contains('remove')) {
            const btn = e.target.closest('.remove');
            cart.splice(btn.dataset.i, 1);
        }
        renderCart();
    });

    document.getElementById('clear-cart')?.addEventListener('click', () => {
        if (confirm('Clear your cart?')) {
            cart = [];
            renderCart();
        }
    });

    document.getElementById('checkout-btn')?.addEventListener('click', () => {
        alert('Thanks for shopping! (Demo only, no real payment 😅)');
    });

    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const cat = btn.dataset.category;
            document.querySelectorAll('#product-list .card').forEach(card => {
                card.classList.toggle('d-none', !(cat === 'all' || card.dataset.category === cat));
            });
        });
    });

    document.getElementById('contact-form')?.addEventListener('submit', e => {
        e.preventDefault();
        alert('Message sent (just kidding, this is a demo 😅).');
        e.target.reset();
    });

    renderCart();
});
