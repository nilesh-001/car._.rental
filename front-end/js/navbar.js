const navAuth = document.getElementById("navAuth");

if (navAuth) {

  const userName = localStorage.getItem("userName");

  if (userName) {

    const firstLetter = userName.charAt(0).toUpperCase();

    navAuth.innerHTML = `
      <a href="myrentals.html" title="My Rentals">
        <div class="w-10 h-10 rounded-full bg-primary text-black flex items-center justify-center font-bold text-lg cursor-pointer hover:scale-105 transition">
          ${firstLetter}
        </div>
      </a>
    `;

  } else {

    navAuth.innerHTML = `
      <a
        href="login.html"
        class="bg-primary text-background-dark px-6 py-2.5 rounded-full font-bold text-sm hover:opacity-90 transition-all"
      >
        Login / Signup
      </a>
    `;

  }

}