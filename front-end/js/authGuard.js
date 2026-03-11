const loginModal = document.getElementById("loginRequiredModal");
const cancelLoginModal = document.getElementById("cancelLoginModal");
const goToLogin = document.getElementById("goToLogin");

function handleRentNow(carId) {

const token = localStorage.getItem("token");

if (!token) {

loginModal.classList.remove("hidden");
loginModal.classList.add("flex");

return;

}

window.location.href = `booking.html?id=${carId}`;

}

cancelLoginModal?.addEventListener("click", () => {
loginModal.classList.add("hidden");
});

goToLogin?.addEventListener("click", () => {
window.location.href = "login.html";
});