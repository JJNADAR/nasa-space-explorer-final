const API_KEY = "DEMO_KEY";

const gallery = document.getElementById("gallery");
const startDateInput = document.getElementById("startDate");
const endDateInput = document.getElementById("endDate");
const button = document.querySelector("button");

// loading state
function showLoading() {
  gallery.innerHTML = `
    <div class="placeholder">
      <p>🔄 Loading space photos...</p>
    </div>
  `;
}

// random fact (LevelUp)
function showFact() {
  const facts = [
    "One day on Venus is longer than one year on Venus.",
    "Neutron stars can spin 600 times per second.",
    "There are more stars in the universe than grains of sand on Earth.",
    "A spoonful of a neutron star would weigh billions of tons."
  ];

  const fact = facts[Math.floor(Math.random() * facts.length)];

  const box = document.createElement("div");
  box.className = "gallery-item";
  box.innerHTML = `
    <p><strong>Did You Know?</strong></p>
    <p>${fact}</p>
  `;

  gallery.prepend(box);
}

// fetch NASA data
async function fetchNASA(start, end) {
  try {
    showLoading();

    const url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&start_date=${start}&end_date=${end}`;
    const res = await fetch(url);
    const data = await res.json();

    const items = Array.isArray(data) ? data : [data];

    renderGallery(items.slice(0, 9));
    showFact();

  } catch (err) {
    console.error(err);
    gallery.innerHTML = `<p>Failed to load NASA data.</p>`;
  }
}

// render gallery
function renderGallery(items) {
  gallery.innerHTML = "";

  items.forEach((item) => {
    if (item.media_type !== "image") return;

    const div = document.createElement("div");
    div.className = "gallery-item";

    div.innerHTML = `
      <img src="${item.url}" alt="${item.title}" />
      <p><strong>${item.title}</strong></p>
      <p>${item.date}</p>
    `;

    div.addEventListener("click", () => openModal(item));

    gallery.appendChild(div);
  });
}

// modal
function openModal(item) {
  const modal = document.createElement("div");
  modal.className = "modal";

  modal.innerHTML = `
    <div class="modal-content">
      <span class="close">&times;</span>
      <h2>${item.title}</h2>
      <p>${item.date}</p>
      <img src="${item.url}" style="max-width:100%; margin-top:10px;" />
      <p style="margin-top:10px;">${item.explanation}</p>
    </div>
  `;

  document.body.appendChild(modal);

  modal.querySelector(".close").onclick = () => modal.remove();
}

// button click
button.addEventListener("click", () => {
  const start = startDateInput.value;
  const end = endDateInput.value;

  if (!start || !end) {
    alert("Please select both dates");
    return;
  }

  fetchNASA(start, end);
});