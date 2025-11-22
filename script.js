// ========== SCRIPT WEBSITE NỘI THẤT ==========
// Phiên bản đơn giản, hoạt động tốt với localStorage
// ==============================================

// ======= ĐĂNG KÝ NGƯỜI DÙNG =======
function registerUser() {
    const name = document.getElementById("regName").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const pass = document.getElementById("regPassword").value.trim();
    const confirm = document.getElementById("regConfirm").value.trim();

    if (!name || !email || !pass || !confirm) {
        alert("Vui lòng nhập đầy đủ thông tin!");
        return;
    }
    if (pass !== confirm) {
        alert("Mật khẩu xác nhận không khớp!");
        return;
    }

    const user = { name, email, pass };
    localStorage.setItem(email, JSON.stringify(user));

    alert("Đăng ký thành công!");
    window.location.href = "login.html";
}

// ======= ĐĂNG NHẬP =======
function loginUser() {
    const email = document.getElementById("loginEmail").value.trim();
    const pass = document.getElementById("loginPassword").value.trim();
    const data = localStorage.getItem(email);

    if (!data) {
        alert("Tài khoản không tồn tại!");
        return;
    }

    const user = JSON.parse(data);
    if (user.pass !== pass) {
        alert("Mật khẩu sai!");
        return;
    }

    localStorage.setItem("currentUser", JSON.stringify(user));
    alert("Đăng nhập thành công!");
    window.location.href = "index.html";
}

// ======= ĐĂNG XUẤT =======
function logoutUser() {
    localStorage.removeItem("currentUser");
    alert("Bạn đã đăng xuất!");
    window.location.href = "index.html";
}

// ======= KIỂM TRA NGƯỜI DÙNG ĐANG ĐĂNG NHẬP =======
function checkLoginStatus() {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    const loginBtn = document.getElementById("loginBtn");
    const logoutBtn = document.getElementById("logoutBtn");

    if (user) {
        if (loginBtn) loginBtn.style.display = "none";
        if (logoutBtn) logoutBtn.style.display = "inline-block";
    } else {
        if (loginBtn) loginBtn.style.display = "inline-block";
        if (logoutBtn) logoutBtn.style.display = "none";
    }
}

// ======= GIỎ HÀNG =======
function addToCart(id, name, price, img) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find(p => p.id === id);

    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ id, name, price, img, qty: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Đã thêm sản phẩm vào giỏ hàng!");
}

// ======= HIỂN THỊ GIỎ HÀNG =======
function loadCart() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const table = document.getElementById("cartList");
    const total = document.getElementById("cartTotal");

    if (!table) return;
    table.innerHTML = "";
    let sum = 0;

    cart.forEach(item => {
        const price = Number(item.price);
        sum += price * item.qty;
        table.innerHTML += `
            <tr>
                <td><img src="${item.img}" width="60"></td>
                <td>${item.name}</td>
                <td>${price.toLocaleString()}₫</td>
                <td>${item.qty}</td>
                <td><button onclick="removeFromCart('${item.id}')">Xóa</button></td>
            </tr>
        `;
    });

    total.textContent = sum.toLocaleString() + "₫";
}

// ======= XÓA SẢN PHẨM TRONG GIỎ =======
function removeFromCart(id) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter(p => p.id !== id);
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
}

// ======= THANH TOÁN =======
function checkout() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
        alert("Giỏ hàng trống!");
        return;
    }
    alert("Thanh toán thành công! Cảm ơn bạn đã mua hàng.");
    localStorage.removeItem("cart");
    window.location.href = "index.html";
}

// ======= TÌM KIẾM SẢN PHẨM =======
function searchProduct() {
    const keyword = document.getElementById("searchInput").value.toLowerCase();
    const items = document.querySelectorAll(".product-item");

    items.forEach(item => {
        const name = item.querySelector("h3").textContent.toLowerCase();
        item.style.display = name.includes(keyword) ? "block" : "none";
    });
}

// ======= KHỞI ĐỘNG =======
document.addEventListener("DOMContentLoaded", () => {
    checkLoginStatus();
    if (document.getElementById("cartList")) loadCart();
});
// ====== Thêm sản phẩm vào giỏ ======
document.addEventListener("DOMContentLoaded", function() {
    const addButtons = document.querySelectorAll(".add-to-cart");
    addButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const product = {
                name: btn.dataset.name,
                price: parseInt(btn.dataset.price),
                img: btn.dataset.img,
                quantity: 1
            };

            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            const existing = cart.find(item => item.name === product.name);

            if (existing) {
                existing.quantity++;
            } else {
                cart.push(product);
            }

            localStorage.setItem("cart", JSON.stringify(cart));
            alert("✅ Đã thêm vào giỏ hàng!");
        });
    });

    // ====== Hiển thị giỏ hàng trong cart.html ======
    const cartTable = document.getElementById("cart-items");
    if (cartTable) {
        renderCart();
    }

    // ====== Cập nhật tổng tiền ======
    function renderCart() {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        const cartBody = document.getElementById("cart-items");
        const totalEl = document.getElementById("cart-total");

        if (cart.length === 0) {
            cartBody.innerHTML = `<tr><td colspan="5">🛍 Giỏ hàng trống</td></tr>`;
            totalEl.textContent = "0đ";
            return;
        }

        let total = 0;
        cartBody.innerHTML = "";
        cart.forEach((item, i) => {
            const subtotal = item.price * item.quantity;
            total += subtotal;

            const row = document.createElement("tr");
            row.innerHTML = `
        <td><img src="${item.img}" width="60"> ${item.name}</td>
        <td>${item.price.toLocaleString()}đ</td>
        <td>
          <input type="number" value="${item.quantity}" min="1" data-index="${i}" class="qty-input">
        </td>
        <td>${subtotal.toLocaleString()}đ</td>
        <td><button class="btn-remove" data-index="${i}">✖</button></td>
      `;
            cartBody.appendChild(row);
        });

        totalEl.textContent = total.toLocaleString() + "đ";

        // Gắn sự kiện xoá và thay đổi số lượng
        document.querySelectorAll(".btn-remove").forEach(btn => {
            btn.addEventListener("click", removeItem);
        });
        document.querySelectorAll(".qty-input").forEach(input => {
            input.addEventListener("change", updateQuantity);
        });
    }

    // ====== Xoá sản phẩm ======
    function removeItem(e) {
        const index = e.target.dataset.index;
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
    }

    // ====== Cập nhật số lượng ======
    function updateQuantity(e) {
        const index = e.target.dataset.index;
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart[index].quantity = parseInt(e.target.value);
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
    }
});
document.getElementById("checkout-btn").addEventListener("click", () => {
    if (cart.length === 0) {
        alert("🛍️ Giỏ hàng của bạn đang trống!");
    } else {
        alert("✅ Cảm ơn bạn đã đặt hàng! Chúng tôi sẽ liên hệ xác nhận sớm nhất.");
        localStorage.removeItem("cart"); // Xoá giỏ hàng sau khi thanh toán
        location.reload(); // Làm mới lại trang
    }
});