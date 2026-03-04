function searchCars() {

  const location = document.getElementById("pickupLocation").value.trim();
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;

  if (!location || !startDate || !endDate) {
    alert("Please fill all fields");
    return;
  }

  const query = new URLSearchParams({
    location: location,
    start: startDate,
    end: endDate
  });

  window.location.href = `carlisting.html?${query.toString()}`;

}