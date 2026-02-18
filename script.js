const INITIAL_BUDGET = 200;
const CARBON_MAX = 24;

const products = {
  "yogur-pack-6": {
    name: "Pack de 6 yogures",
    price: 3,
    carbonLabel: "Alta",
    carbonPoints: 6,
    quality: "Media",
    extraInfo: "6 envases de plástico y cartón generan residuos de corta vida.",
  },
  "yogur-tarro-vidrio": {
    name: "Yogur en tarro grande de vidrio",
    price: 7,
    carbonLabel: "Muy baja",
    carbonPoints: 1,
    quality: "Alta",
    extraInfo: "El tarro de vidrio se puede reutilizar y reciclar con facilidad.",
  },
  "pack-boligrafos-plastico": {
    name: "Pack de 10 bolígrafos de plástico",
    price: 4,
    carbonLabel: "Media",
    carbonPoints: 4,
    quality: "Baja",
    extraInfo: "Mucho plástico de un solo uso para una vida útil corta.",
  },
  "boligrafo-metal-recargable": {
    name: "1 bolígrafo de metal recargable",
    price: 6,
    carbonLabel: "Baja",
    carbonPoints: 2,
    quality: "Alta",
    extraInfo: "Solo requiere recambio de tinta, reduciendo residuos.",
  },
  "coche-fabrica-lejana": {
    name: "Coche de plástico de La Gran Gran Fábrica Lejana",
    price: 2,
    carbonLabel: "Muy alta",
    carbonPoints: 8,
    quality: "Baja",
    extraInfo: "Viaja más de 10.000 km en barco y camión antes de llegar a tienda.",
  },
  "tren-madera-local": {
    name: "Tren de madera del carpintero del pueblo",
    price: 9,
    carbonLabel: "Mínima",
    carbonPoints: 0,
    quality: "Muy alta",
    extraInfo: "Fabricado con madera local y sin transporte de larga distancia.",
  },
};

let budget = INITIAL_BUDGET;
let carbon = 0;
let ecoRadarActive = false;
const cart = [];

const budgetValue = document.getElementById("budget-value");
const carbonValue = document.getElementById("carbon-value");
const budgetBar = document.getElementById("budget-bar");
const carbonBar = document.getElementById("carbon-bar");
const checkoutZone = document.getElementById("checkout-zone");
const cartList = document.getElementById("cart-list");
const report = document.getElementById("report");
const finishBtn = document.getElementById("finish-btn");
const ecoRadarBtn = document.getElementById("eco-radar-btn");
const productGrid = document.getElementById("product-grid");

const ecoModal = document.getElementById("eco-modal");
const ecoModalClose = document.getElementById("eco-modal-close");
const ecoModalTitle = document.getElementById("eco-modal-title");
const ecoModalPrice = document.getElementById("eco-modal-price");
const ecoModalCarbon = document.getElementById("eco-modal-carbon");
const ecoModalQuality = document.getElementById("eco-modal-quality");
const ecoModalExtra = document.getElementById("eco-modal-extra");

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

function renderEcoRadar() {
  ecoRadarBtn.textContent = `🟢 Eco Radar: ${ecoRadarActive ? "ON" : "OFF"}`;
  ecoRadarBtn.classList.toggle("active", ecoRadarActive);
}

function closeEcoModal() {
  ecoModal.classList.add("hidden");
}

function openEcoModal(productId) {
  const product = products[productId];
  if (!product) {
    return;
  }

  ecoModalTitle.textContent = product.name;
  ecoModalPrice.textContent = `Precio: ${product.price} €`;
  ecoModalCarbon.textContent = `Huella: ${product.carbonLabel} (+${product.carbonPoints})`;
  ecoModalQuality.textContent = `Calidad: ${product.quality}`;
  ecoModalExtra.textContent = product.extraInfo;

  ecoModal.classList.remove("hidden");
}

function toggleEcoRadar() {
  ecoRadarActive = !ecoRadarActive;
  renderEcoRadar();

  if (ecoRadarActive) {
    productGrid.classList.remove("eco-flash");
    void productGrid.offsetWidth;
    productGrid.classList.add("eco-flash");
    return;
  }

  productGrid.classList.remove("eco-flash");
  closeEcoModal();
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
  item.textContent = `${product.name} - ${product.price} € | Huella ${product.carbonLabel} (+${product.carbonPoints}) | Calidad ${product.quality}`;
  cartList.appendChild(item);

  closeEcoModal();
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
  card.addEventListener("click", () => {
    if (!ecoRadarActive || card.classList.contains("dragging")) {
      return;
    }

    openEcoModal(card.dataset.id);
  });

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

ecoModalClose.addEventListener("click", closeEcoModal);
ecoModal.addEventListener("click", (event) => {
  if (event.target === ecoModal) {
    closeEcoModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeEcoModal();
  }
});

ecoRadarBtn.addEventListener("click", toggleEcoRadar);
finishBtn.addEventListener("click", evaluateResult);

renderStatus();
renderEcoRadar();
