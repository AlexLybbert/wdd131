const products = [
  { id: "fc-1888", name: "flux capacitor", averagerating: 4.5 },
  { id: "fc-2050", name: "power laces", averagerating: 4.7 },
  { id: "fs-1987", name: "time circuits", averagerating: 3.5 },
  { id: "ac-2000", name: "low voltage reactor", averagerating: 3.9 },
  { id: "jj-1969", name: "warp equalizer", averagerating: 5.0 }
];

document.addEventListener("DOMContentLoaded", () => {
  // Populate product select if it exists
  const productSelect = document.getElementById("product");
  if (productSelect) {
    products.forEach(product => {
      const option = document.createElement("option");
      option.value = product.id;       // Use id as value
      option.textContent = product.name; // Display name
      productSelect.appendChild(option);
    });
  }

  // Increment review counter if review page
  const reviewCountDisplay = document.getElementById("reviewCount");
  if (reviewCountDisplay) {
    let reviewCount = localStorage.getItem("reviewCount");
    reviewCount = reviewCount ? parseInt(reviewCount) : 0;
    reviewCount++;
    localStorage.setItem("reviewCount", reviewCount);
    reviewCountDisplay.textContent = reviewCount;
  }
});
