const homeContainer = document.getElementById("homeCars");

let cars = [];
let selectedCategory = "Luxury";

/* Load cars from backend */
async function loadCars() {
  try {
    const res = await fetch("http://localhost:4044/api/cars");
    cars = await res.json();

    renderHomeCars();
  } catch (err) {
    console.error("Error loading cars:", err);
  }
}

/* render cars */
function renderHomeCars() {

  homeContainer.innerHTML = "";

  const filtered = cars
    .filter(car => car.category === selectedCategory)
    .slice(0, 3);

  filtered.forEach(car => {

    homeContainer.innerHTML += `
      <div class="glass-card rounded-xl overflow-hidden">

        <img src="${car.image}"
        class="h-52 w-full object-cover">

        <div class="p-6">
          <h3 class="text-xl font-bold text-white">
            ${car.name}
          </h3>

          <p class="text-primary font-bold">
            ₹${car.price}/day
          </p>

          <a href="booking.html?id=${car._id}"
          class="block text-center w-full bg-white/5 hover:bg-primary hover:text-background-dark py-3 rounded-lg font-bold mt-4">
          Rent Now
          </a>
        </div>

      </div>
    `;
  });
}

/* category buttons */
document.querySelectorAll(".fleet-btn").forEach(btn => {

  btn.onclick = () => {

    document.querySelectorAll(".fleet-btn").forEach(b => {

      b.classList.remove(
        "bg-primary",
        "text-background-dark"
      );

      b.classList.add(
        "text-slate-400"
      );
    });

    btn.classList.add(
      "bg-primary",
      "text-background-dark"
    );

    btn.classList.remove(
      "text-slate-400"
    );

    selectedCategory = btn.dataset.category;

    renderHomeCars();
  };
});

/* start loading cars */
loadCars();