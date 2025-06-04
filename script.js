function addToCart(id) {
  const BACKEND_URL = "https://biblesbyblessing-backend.onrender.com";

  fetch(`${BACKEND_URL}/api/products`)
    .then(res => res.json())
    .then(products => {
      const product = products.find(p => p.id === id);
      if (!product) {
        alert("Product not found.");
        return;
      }

      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      const existing = cart.find(item => item.id === id);

      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1
        });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      alert(`✅ ${product.name} added to cart!`);
    })
    .catch(err => {
      console.error("Error adding to cart:", err);
      alert("🚫 Could not add to cart.");
    });
}

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("product-container");
  const BACKEND_URL = "https://biblesbyblessing-backend.onrender.com";

  fetch(`${BACKEND_URL}/api/products`)
    .then(res => res.json())
    .then(products => {
      renderProducts(products);
      setupCategoryFiltering(products);
    })
    .catch(error => {
      console.error("Failed to load products:", error);
      container.innerHTML = "<p style='text-align:center;'>🚫 Could not load product data.</p>";
    });

  function renderProducts(productList) {
    container.innerHTML = "";

    if (productList.length === 0) {
      container.innerHTML = "<p style='text-align:center;'>No products found in this category.</p>";
      return;
    }

    productList.forEach(product => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <p><strong>R${product.price.toFixed(2)}</strong></p>
        <button onclick="addToCart('${product.id}')">Add to Cart</button>
      `;
      container.appendChild(card);
    });
  }

  function setupCategoryFiltering(products) {
    document.querySelectorAll(".nav-menu a[data-category]").forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const category = e.target.dataset.category;
        const filtered = products.filter(p => p.category === category);
        renderProducts(filtered);
      });
    });
  }
});
