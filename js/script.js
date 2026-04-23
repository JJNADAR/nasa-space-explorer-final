const API_KEY = "DEMO_KEY";

const gallery = document.getElementById("gallery");
const startDateInput = document.getElementById("startDate");
const endDateInput = document.getElementById("endDate");
const button = document.querySelector("button");

/* ---------------- LOADING ---------------- */
function showLoading() {
  gallery.innerHTML = `<p class="loading">Loading space images...</p>`;
}

/* ---------------- SPACE FACT ---------------- */
function showFact() {
  const facts = [
    "One day on Venus is longer than one year on Venus.",
    "Neutron stars can spin 600 times per second.",
    "There are more stars in the universe than grains of sand on Earth.",
    "A spoonful of a neutron star would weigh billions of tons."
  ];

  const fact = facts[Math.floor(Math.random() * facts.length)];

  const factBox = document.createElement("div");
  factBox.className = "space-fact";
  factBox.innerHTML = `
    <strong>Did You Know?</strong>
    <p>${fact}</p>
  `;

  gallery.prepend(factBox);
}

/* ---------------- FETCH NASA ---------------- */
async function fetchNASA(start, end) {
  try {
    showLoading();

    const url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&start_date=${start}&end_date=${end}`;

    const res = await fetch(url);
    const data = await res.json();

    console.log("NASA response:", data);

    const items = Array.isArray(data) ? data : [data];

    const images = items.filter(item =>
      item && item.media_type === "image" && item.url
    );

    if (images.length === 0) {
      gallery.innerHTML = `<p class="loading">No images found for this date range. Try different dates.</p>`;
      return;
    }

    renderGallery(images.slice(0, 9));
    showFact();

  } catch (err) {
    console.error(err);
    gallery.innerHTML = `<p class="loading">Failed to load NASA images.</p>`;
  }
}

/* ---------------- RENDER GALLERY ---------------- */
function renderGallery(items) {
  gallery.innerHTML = "";

  items.forEach((item) => {
    const div = document.createElement("div");
    div.className = "gallery-item";

    div.innerHTML = `
      <img src="${item.url}" alt="${item.title}">
      <p><strong>${item.title}</strong></p>
      <p>${item.date}</p>
    `;

    div.addEventListener("click", () => openModal(item));

    gallery.appendChild(div);
  });
}

/* ---------------- MODAL ---------------- */
function openModal(item) {
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.style.display = "flex";

  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-modal">&times;</span>
      <h2>${item.title}</h2>
      <p>${item.date}</p>
      <img src="${item.url}" alt="${item.title}">
      <p>${item.explanation}</p>
    </div>
  `;

  modal.querySelector(".close-modal").addEventListener("click", () => {
    modal.remove();
  });

  document.body.appendChild(modal);
}

/* ---------------- BUTTON CLICK ---------------- */
button.addEventListener("click", () => {
  const start = startDateInput.value;
  const end = endDateInput.value;

  if (!start || !end) {
    alert("Please select both dates");
    return;
  }

  fetchNASA(start, end);
});