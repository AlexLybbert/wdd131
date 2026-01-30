const yearSpan = document.getElementById("year");
const modifiedSpan = document.getElementById("lastModified");
const menuButton = document.getElementById("menuButton");
const navMenu = document.getElementById("navMenu");

const temples = [
  {
    templeName: "Aba Nigeria",
    location: "Aba, Nigeria",
    dedicated: "2005, August, 7",
    area: 11500,
    imageUrl:
    "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/aba-nigeria/400x250/aba-nigeria-temple-lds-273999-wallpaper.jpg"
  },
  {
    templeName: "Manti Utah",
    location: "Manti, Utah, United States",
    dedicated: "1888, May, 21",
    area: 74792,
    imageUrl:
    "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/manti-utah/400x250/manti-temple-768192-wallpaper.jpg"
  },
  {
    templeName: "Payson Utah",
    location: "Payson, Utah, United States",
    dedicated: "2015, June, 7",
    area: 96630,
    imageUrl:
    "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/payson-utah/400x225/payson-utah-temple-exterior-1416671-wallpaper.jpg"
  },
  {
    templeName: "Yigo Guam",
    location: "Yigo, Guam",
    dedicated: "2020, May, 2",
    area: 6861,
    imageUrl:
    "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/yigo-guam/400x250/yigo_guam_temple_2.jpg"
  },
  {
    templeName: "Washington D.C.",
    location: "Kensington, Maryland, United States",
    dedicated: "1974, November, 19",
    area: 156558,
    imageUrl:
    "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/washington-dc/400x250/washington_dc_temple-exterior-2.jpeg"
  },
  {
    templeName: "Lima Perú",
    location: "Lima, Perú",
    dedicated: "1986, January, 10",
    area: 9600,
    imageUrl:
    "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/lima-peru/400x250/lima-peru-temple-evening-1075606-wallpaper.jpg"
  },
  {
    templeName: "Mexico City Mexico",
    location: "Mexico City, Mexico",
    dedicated: "1983, December, 2",
    area: 116642,
    imageUrl:
    "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/mexico-city-mexico/400x250/mexico-city-temple-exterior-1518361-wallpaper.jpg"
  },
  {
    templeName: "Okinawa Japan",
    location: "Okinawa, Japan",
    dedicated: "2023, November, 12",
    area: 12437,
    imageUrl: "https://churchofjesuschristtemples.org/assets/img/temples/okinawa-japan-temple/okinawa-japan-temple-40844.jpg"
  },
  {
    templeName: "Tallahassee Florida",
    location: "Tallahassee, Florida",
    dedicated: "2024, December, 8",
    area: 29255,
    imageUrl: "https://churchofjesuschristtemples.org/assets/img/temples/tallahassee-florida-temple/tallahassee-florida-temple-54694.jpg"
  },
  {
    templeName: "Nauvoo Illinois",
    location: "Nauvoo, Illinois",
    dedicated: "2002, June, 30",
    area: 54000,
    imageUrl: "https://churchofjesuschristtemples.org/assets/img/temples/nauvoo-illinois-temple/nauvoo-illinois-temple-50576.jpg"
  }
];

yearSpan.textContent = new Date().getFullYear();
modifiedSpan.textContent = document.lastModified;

menuButton.addEventListener("click", () => {
    navMenu.classList.toggle("open");
    menuButton.textContent = navMenu.classList.contains("open") ? "✖" : "☰";
});

function displayTemples(filteredTemples) {
    const templeGrid = document.querySelector(".temple-grid");
    templeGrid.innerHTML = ""; // Clear existing

    filteredTemples.forEach(temple => {
        const figure = document.createElement("figure");

        const img = document.createElement("img");
        img.src = temple.imageUrl;
        img.alt = temple.name;
        img.loading = "lazy";

        const caption = document.createElement("figcaption");
        caption.innerHTML = `
            <strong>${temple.templeName}</strong><br>
            ${temple.location}<br>
            Dedicated: ${temple.dedicated}<br>
            Area: ${temple.area.toLocaleString()} sq ft
        `;

        figure.appendChild(img);
        figure.appendChild(caption);
        templeGrid.appendChild(figure);
    });
}

// Initial display: show all
displayTemples(temples);

// Navigation menu filtering
const navLinks = document.querySelectorAll("#navMenu a");
navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        const filter = link.getAttribute("href").replace("#", "");

        let filtered;
        switch (filter) {
            case "old":
                filtered = temples.filter(t => getDedicatedYear(t) < 1900);
                break;
            case "new":
                filtered = temples.filter(t => getDedicatedYear(t) > 2000);
                break;
            case "large":
                filtered = temples.filter(t => t.area > 90000);
                break;
            case "small":
                filtered = temples.filter(t => t.area < 10000);
                break;
            default:
                filtered = temples;
        }

        displayTemples(filtered);
    });
});

function getDedicatedYear(temple) {
    return Number(temple.dedicated.split(",")[0]);
}

menuButton.addEventListener("click", () => {
    navMenu.classList.toggle("open");
});

// Footer dynamic year and last modified
document.getElementById("year").textContent = new Date().getFullYear();
document.getElementById("lastModified").textContent = document.lastModified;