const API_KEY = "DEMO_KEY";

const gallery = document.getElementById("gallery");
const startDateInput = document.getElementById("startDate");
const endDateInput = document.getElementById("endDate");
const button = document.querySelector("button");

/* ---------------- LOADING ---------------- */
function showLoading() {
  gallery.innerHTML = `<p class="loading">Loading space images...</p>`;
}

/* ---------------- FACT ---------------- */
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

/* ---------------- FETCH NASA (FIXED RELIABLE VERSION) ---------------- */
async function fetchNASA(start, end) {
  try {
    showLoading();

    const startDate = new Date(start);
    const endDate = new Date(end);

    let results = [];

    // Fetch each day individually (most reliable NASA method)
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split("T")[0];

      const url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${dateStr}`;

      const res = await fetch(url);
      const data = await res.json();

      // Only keep images
      if (data && data.media_type === "image" && data.url) {
        results.push(data);
      }
    }

    if (results.length === 0) {
      gallery.innerHTML = `<p class="loading">No images found for this date range.</p>`;
      return;
    }

    renderGallery(results.slice(0, 9));
    showFact();

  } catch (err) {
    console.error(err);
    gallery.innerHTML = `<p class="loading">Failed to load space images.</p>`;
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