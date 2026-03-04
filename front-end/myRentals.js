if (!localStorage.getItem("token")) {
  window.location.href = "login.html";
}

const rentalsContainer = document.getElementById("rentalsContainer");
const activeContainer = document.getElementById("activeBookingContainer");

const activeBookingsCount = document.getElementById("activeBookingsCount");
const totalTripsCount = document.getElementById("totalTripsCount");
const driverRating = document.getElementById("driverRating");

const seeAllButton = document.getElementById("seeAllRentals");

const modal = document.getElementById("receiptModal");

const userId = localStorage.getItem("userId");

let allBookings = [];
let showAll = false;

async function loadRentals() {
  try {
    const res = await fetch(
      `http://localhost:4044/api/bookings/user/${userId}`,
    );

    const bookings = await res.json();

    // newest bookings first
    bookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    allBookings = bookings;

    renderBookings();
  } catch (err) {
    console.error("Error loading rentals:", err);
  }
}

function renderBookings() {
  rentalsContainer.innerHTML = "";
  activeContainer.innerHTML = "";

  let activeCount = 0;

  // count active bookings
  allBookings.forEach((booking) => {
    if (booking.status === "active") {
      activeCount++;
    }
  });

  // update dashboard stats
activeBookingsCount.textContent = activeCount;

// completed trips only
const completedTrips = allBookings.filter(
  (b) => b.status === "completed"
);

totalTripsCount.textContent = completedTrips.length;


// calculate rating
const ratings = completedTrips
  .map((b) => b.rating)
  .filter((r) => r !== undefined);

if (ratings.length > 0) {

  const avg =
    ratings.reduce((a, b) => a + b, 0) / ratings.length;

  driverRating.textContent = avg.toFixed(1) + " ⭐";

} else {

  driverRating.textContent = "—";

}

  // temporary rating
  // driverRating.textContent = (4.5 + Math.random() * 0.5).toFixed(1);

  const bookingsToShow = showAll ? allBookings : allBookings.slice(0, 5);

  bookingsToShow.forEach((booking) => {
    const car = booking.carId || { name: "Unknown Car", image: "" };

    const pickup = new Date(booking.pickupDate).toLocaleDateString();
    const drop = new Date(booking.returnDate).toLocaleDateString();

    // ACTIVE BOOKING CARD
    if (booking.status === "active" && activeContainer.innerHTML === "") {
      activeContainer.innerHTML = `

<div class="relative overflow-hidden bg-slate-900 rounded-lg shadow-2xl">

<img
class="absolute inset-0 w-full h-full object-cover opacity-40"
src="http://localhost:4044${car.image}"
/>

<div class="relative z-20 p-8 flex justify-between items-end">

<div>

<div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 mb-3">
<span class="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
<span class="text-primary text-xs font-bold uppercase">
In Progress
</span>
</div>

<h4 class="text-3xl font-black text-white">
${car.name}
</h4>

<p class="text-slate-300 mt-2">
Pickup: ${pickup}
</p>

<p class="text-slate-300">
Return: ${drop}
</p>

</div>

<div class="text-right">

<p class="text-primary text-2xl font-bold">
₹${booking.totalPrice}
</p>

</div>

</div>

</div>
`;
    }

    // TABLE ROW
    const row = `

<tr class="hover:bg-slate-50 dark:hover:bg-primary/5 transition-colors">

<td class="px-6 py-4">

<div class="flex items-center gap-4">

<img
class="w-12 h-12 rounded-lg object-cover"
src="http://localhost:4044${car.image}"
/>

<div>

<p class="font-bold text-slate-900 dark:text-white">
${car.name}
</p>

<p class="text-xs text-slate-500">
${car.type || "Car"}
</p>

</div>

</div>

</td>

<td class="px-6 py-4 text-sm">
${pickup} - ${drop}
</td>

<td class="px-6 py-4 font-bold">
₹${booking.totalPrice}
</td>

<td class="px-6 py-4">

<span class="px-3 py-1 text-xs font-bold uppercase rounded-full
${
  booking.status === "active"
    ? "bg-primary/10 text-primary"
    : "bg-emerald-500/10 text-emerald-500"
}">
${booking.status}
</span>

</td>

<td class="px-6 py-4">

<button
class="p-2 text-slate-400 hover:text-primary"
onclick='openReceipt(${JSON.stringify(booking)})'
>

<span class="material-symbols-outlined">
receipt_long
</span>

</button>

</td>

</tr>

`;

    rentalsContainer.innerHTML += row;
  });

  // show message if no active booking
  if (activeContainer.innerHTML === "") {
    activeContainer.innerHTML = `

<div class="bg-slate-900 rounded-lg p-10 text-center text-slate-400">

<span class="material-symbols-outlined text-4xl mb-3">
directions_car
</span>

<p>No active bookings</p>

</div>

`;
  }
}

seeAllButton.addEventListener("click", () => {
  showAll = true;
  renderBookings();
});

function openReceipt(booking) {
  const car = booking.carId || { name: "Unknown" };

  document.getElementById("receiptCar").textContent = car.name;

  document.getElementById("receiptPickup").textContent = new Date(
    booking.pickupDate,
  ).toLocaleDateString();

  document.getElementById("receiptReturn").textContent = new Date(
    booking.returnDate,
  ).toLocaleDateString();

  document.getElementById("receiptPrice").textContent = booking.totalPrice;

  document.getElementById("receiptStatus").textContent = booking.status;

  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

document.getElementById("closeReceipt").onclick = () => {
  modal.classList.add("hidden");
};

const logoutBtn = document.getElementById("logoutBtn");
const logoutModal = document.getElementById("logoutModal");
const cancelLogout = document.getElementById("cancelLogout");
const confirmLogout = document.getElementById("confirmLogout");

logoutBtn.addEventListener("click", () => {
  logoutModal.classList.remove("hidden");
  logoutModal.classList.add("flex");
});

cancelLogout.addEventListener("click", () => {
  logoutModal.classList.add("hidden");
});

confirmLogout.addEventListener("click", () => {
  // remove login data
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("userName");

  // redirect
  window.location.href = "index.html";
});

loadRentals();
