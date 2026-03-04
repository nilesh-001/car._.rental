const params = new URLSearchParams(window.location.search);
const carId = params.get("id");
console.log("Car ID:", carId);

async function loadCar() {
  try {
    const res = await fetch(`http://localhost:4044/api/cars/${carId}`);
    const car = await res.json();

    window.carPricePerDay = car.price;

    document.getElementById("carPrice").textContent = `₹${car.price}/day`;

    document.getElementById("totalPrice").textContent = `₹${car.price}`;

    document.getElementById("carName").textContent = car.name;

    document.getElementById("carDetails").textContent =
      `${car.fuel} • ${car.transmission} • ${car.category}`;

    document.getElementById("carImage").src =
      `http://localhost:4044${car.image}`;

    document.getElementById("carPrice").textContent = `₹${car.price}/day`;
  } catch (err) {
    console.error("Error loading car:", err);
  }
}

function calculatePrice() {

  const pickup = document.getElementById("pickupDate").value;
  const drop = document.getElementById("returnDate").value;

  if (!pickup || !drop) return;

  const start = new Date(pickup);
  const end = new Date(drop);

  const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

  if (diff <= 0) return;

  document.getElementById("rentalDays").textContent = diff;

  const total = diff * window.carPricePerDay;

  document.getElementById("totalPrice").textContent =
    `₹${total}`;
}

document.getElementById("pickupDate").addEventListener("change", calculatePrice);
document.getElementById("returnDate").addEventListener("change", calculatePrice);

document
.getElementById("completeBookingBtn")
.addEventListener("click", async () => {

const userId = localStorage.getItem("userId");

const name = document.getElementById("name").value;
const email = document.getElementById("email").value;
const phone = document.getElementById("phone").value;

const pickupLocation = document.getElementById("pickupLocation").value;

const pickupDate = document.getElementById("pickupDate").value;
const returnDate = document.getElementById("returnDate").value;

const totalPrice =
document.getElementById("totalPrice")
.textContent.replace("₹","");

if(!name || !email || !phone || !pickupDate || !returnDate){

alert("Please fill all required fields");
return;

}

try{

const res = await fetch(
"http://localhost:4044/api/bookings",
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body: JSON.stringify({

userId,
carId,
name,
email,
phone,
pickupLocation,
pickupDate,
returnDate,
totalPrice

})
}
);

const data = await res.json();

if(!res.ok){

alert(data.message);
return;

}

alert("Booking Successful 🚗");

window.location.href = "index.html";

}catch(err){

console.error("Booking error:", err);

}

});

loadCar();
