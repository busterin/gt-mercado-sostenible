const INITIAL_BUDGET = 200;
const CARBON_MAX = 24;

const products = {
  "yogur-pack-6": {
    name: "Pack de 6 yogures",
    price: 3,
    carbonLabel: "Alta",
    carbonPoints: 6,
  },
  "yogur-tarro-vidrio": {
    name: "Yogur en tarro grande de vidrio",
    price: 7,
    carbonLabel: "Muy baja",
    carbonPoints: 1,
  },
};

let budget = INITIAL_BUDGET;
let carbon = 0;
const cart = [];

const budgetValue = document.getElementById("budget-value");
const carbonValue = document.getElementById("carbon-value");
const budgetBar = document.getElementById("budget-bar");
const carbonBar = document.getElementById("carbon-bar");
const checkoutZone = document.getElementById("checkout-zone");
const cartList = document.getElementById("cart-list");
const report = document.getElementById("report");
const finishBtn = document.getElementById("finish-btn");

const productCards = [...document.querySelectorAll(".product-card")];

function renderStatus() {
  budgetValue.textContent = `${budget} €`;
  carbonValue.textContent = `${carbon} pts`;

  const budgetPct = Math.max((budget / INITIAL_BUDGET) * 100, 0);
  const carbonPct = Math.min((carbon / CARBON_MAX) * 100, 100);

  budgetBar.style.width = `${budgetPct}%`;
  carbonBar.style.width = `${carbonPct}%`;

  finishBtn.disabled = cart.length === 0;
}

function addToCart(productId) {
  const product = products[productId];
  if (!product) return;

  if (budget < product.price) {
    alert("No tienes presupuesto suficiente para este producto.");
    return;
  }

  budget -= product.price;
  carbon += product.carbonPoints;
  cart.push(product);

  const card = document.querySelector(`[data-id="${productId}"]`);
  if (card) {
    card.remove();
  }

  const item = document.createElement("li");
  item.textContent = `${product.name} - ${product.price} € | Huella ${product.carbonLabel} (+${product.carbonPoints})`;
  cartList.appendChild(item);

  renderStatus();
}

function evaluateResult() {
  const spent = INITIAL_BUDGET - budget;
  let level = "good";
  let title = "Compra sostenible excelente";
  let feedback = "Has priorizado opciones de baja huella con un buen control del presupuesto.";

  if (carbon >= 9 || spent > 70) {
    level = "bad";
    title = "Compra mejorable";
    feedback = "Tu huella o tu gasto han sido altos. Prueba más productos reutilizables y locales.";
  } else if (carbon >= 5 || spent > 30) {
    level = "medium";
    title = "Compra aceptable";
    feedback = "Vas bien, pero todavía puedes reducir más el impacto ambiental.";
  }

  report.className = `report ${level}`;
  report.innerHTML = `
    <h2>Informe final</h2>
    <p><strong>Dinero gastado:</strong> ${spent} €</p>
    <p><strong>Presupuesto restante:</strong> ${budget} €</p>
    <p><strong>Huella total:</strong> ${carbon} puntos</p>
    <p><strong>Resultado:</strong> ${title}</p>
    <p>${feedback}</p>
  `;
}

productCards.forEach((card) => {
  card.addEventListener("dragstart", (event) => {
    card.classList.add("dragging");
    event.dataTransfer.setData("text/plain", card.dataset.id);
  });

  card.addEventListener("dragend", () => {
    card.classList.remove("dragging");
  });
});

checkoutZone.addEventListener("dragover", (event) => {
  event.preventDefault();
  checkoutZone.classList.add("over");
});

checkoutZone.addEventListener("dragleave", () => {
  checkoutZone.classList.remove("over");
});

checkoutZone.addEventListener("drop", (event) => {
  event.preventDefault();
  checkoutZone.classList.remove("over");
  const productId = event.dataTransfer.getData("text/plain");
  addToCart(productId);
});

finishBtn.addEventListener("click", evaluateResult);

renderStatus();
