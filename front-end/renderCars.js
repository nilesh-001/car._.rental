let filteredCars = [...cars];
let currentPage = 1;
const carsPerPage = 6;

let minPrice = 0;
let maxPrice = 1000;

let startPage = 1;
const visiblePages = 5;

const carsContainer = document.getElementById("carsContainer");

function displayCars(page) {
  carsContainer.innerHTML = "";

  const start = (page - 1) * carsPerPage;
  const end = start + carsPerPage;

  const paginatedCars = filteredCars.slice(start, end);

  paginatedCars.forEach((car) => {
    const card = `
      <div class="glass-dark rounded-xl overflow-hidden group border border-primary/5 hover:border-primary/30 transition-all">

        <div class="relative h-48 overflow-hidden">
          <img src="${car.image}"
          class="w-full h-full object-cover">

          <div class="absolute top-3 right-3 glass px-2 py-1 rounded flex items-center gap-1">
            ⭐ ${car.rating}
          </div>
        </div>

        <div class="p-5">
          <h3 class="text-lg font-bold">${car.name}</h3>
          <p class="text-primary font-black">$${car.price}/day</p>

          <a href="booking.html?id=${car.id}"
          class="block text-center w-full bg-white/5 hover:bg-primary hover:text-background-dark py-3 rounded-lg font-bold mt-4">
          Rent Now
          </a>
        </div>

      </div>
    `;

    carsContainer.insertAdjacentHTML("beforeend", card);
  });
}

function updatePriceFilter() {
  minPrice = parseInt(document.getElementById("minPrice").value);

  maxPrice = parseInt(document.getElementById("maxPrice").value);

  // prevent overlap
  if (minPrice > maxPrice) {
    [minPrice, maxPrice] = [maxPrice, minPrice];
  }

  document.getElementById("minPriceValue").innerText = `$${minPrice}`;

  document.getElementById("maxPriceValue").innerText = `$${maxPrice}`;

  applyFilters();
}

function clearFilters() {
  minPrice = 0;
  maxPrice = 1000;

  document.getElementById("minPrice").value = 0;
  document.getElementById("maxPrice").value = 1000;

  document.getElementById("minPriceValue").innerText = "$0";
  document.getElementById("maxPriceValue").innerText = "$1000";

  // reset category
  document.querySelectorAll(".category-btn").forEach((btn) => {
    btn.className =
      "category-btn text-xs font-semibold py-2 px-3 rounded bg-primary/5 hover:bg-primary/10 border border-primary/10";
  });

  const allBtn = document.querySelector('[data-value="All"]');

  allBtn.className =
    "category-btn category-active text-xs font-semibold py-2 px-3 rounded bg-primary text-background-dark border border-primary";

  // reset fuel
  document
    .querySelectorAll(".fuel-filter")
    .forEach((cb) => (cb.checked = false));

  // reset transmission
  document.querySelectorAll(".transmission-btn").forEach((btn) => {
    btn.classList.remove(
      "transmission-active",
      "bg-primary",
      "text-background-dark",
    );
  });

  filteredCars = [...cars];

  currentPage = 1;
  startPage = 1;

  displayCars(currentPage);
  renderPagination();
}

function selectTransmission(btn) {
  document.querySelectorAll(".transmission-btn").forEach((b) => {
    b.classList.remove(
      "transmission-active",
      "bg-primary",
      "text-background-dark",
    );

    b.classList.add("bg-primary/5");
  });

  btn.classList.add(
    "transmission-active",
    "bg-primary",
    "text-background-dark",
  );

  btn.classList.remove("bg-primary/5");

  applyFilters();
}

function selectCategory(btn) {
  document.querySelectorAll(".category-btn").forEach((b) => {
    b.classList.remove("category-active", "bg-primary", "text-background-dark");

    b.classList.add("bg-primary/5", "border", "border-primary/10");
  });

  btn.classList.add("category-active", "bg-primary", "text-background-dark");

  btn.classList.remove("bg-primary/5");

  applyFilters();
}

function applyFilters() {
  const selectedType =
    document.querySelector(".category-active")?.dataset.value;

  const selectedFuels = [
    ...document.querySelectorAll(".fuel-filter:checked"),
  ].map((el) => el.value);

  const selectedTransmission = document.querySelector(".transmission-active")
    ?.dataset.value;

  filteredCars = cars.filter((car) => {
    let match = true;

    if (selectedType && selectedType !== "All") {
      match = match && car.type === selectedType;
    }

    if (selectedFuels.length > 0) {
      match = match && selectedFuels.includes(car.fuel);
    }

    if (selectedTransmission) {
      match = match && car.transmission === selectedTransmission;
    }

    if (car.price < minPrice || car.price > maxPrice) {
      match = false;
    }

    return match;
  });

  const sortValue = document.getElementById("sortSelect").value;

  if (sortValue === "priceLow") {
    filteredCars.sort((a, b) => a.price - b.price);
  } else if (sortValue === "priceHigh") {
    filteredCars.sort((a, b) => b.price - a.price);
  } else if (sortValue === "rating") {
    filteredCars.sort((a, b) => b.rating - a.rating);
  }

  currentPage = 1;
  startPage = 1;

  displayCars(currentPage);
  renderPagination();
}

function renderPagination() {
  const container = document.getElementById("paginationNumbers");

  container.innerHTML = "";

  const totalPages = Math.ceil(filteredCars.length / carsPerPage);

  for (
    let i = startPage;
    i < startPage + visiblePages && i <= totalPages;
    i++
  ) {
    const btn = document.createElement("button");

    btn.innerText = i;
    btn.className = "size-10 rounded-lg font-bold";

    btn.onclick = () => changePage(i);

    if (i === currentPage) {
      btn.classList.add("bg-primary", "text-background-dark");
    } else {
      btn.classList.add("glass", "hover:bg-primary/10");
    }

    container.appendChild(btn);
  }
}

function nextPageGroup() {
  const totalPages = Math.ceil(filteredCars.length / carsPerPage);

  if (startPage + visiblePages <= totalPages) {
    startPage++;
    renderPagination();
  }
}

function prevPageGroup() {
  if (startPage > 1) {
    startPage--;
    renderPagination();
  }
}

function changePage(page) {
  currentPage = page;

  displayCars(currentPage);
  renderPagination();

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

displayCars(currentPage);
renderPagination();
