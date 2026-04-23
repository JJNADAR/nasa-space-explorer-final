const API_KEY = "DEMO_KEY";

const gallery = document.getElementById("gallery");
const startDateInput = document.getElementById("startDate");
const endDateInput = document.getElementById("endDate");
const button = document.querySelector("button");

// ---------------- LOADING ----------------
function showLoading() {
  gallery.innerHTML = `<p class="loading">Loading space images...</p>`;
}

// ---------------- SPACE FACT ----------------
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
  factBox.innerHTML = `<strong>Did You Know?</strong><p>${fact}</p>`;

  gallery.prepend(factBox);
}

// ---------------- FALLBACK DATA (GUARANTEED WORKING) ----------------
const fallbackImages = [
  {
    title: "Orion Nebula",
    date: "2024-01-01",
    url: "https://apod.nasa.gov/apod/image/2401/OrionNebula_Hubble_960.jpg",
    explanation: "A beautiful nebula where new stars are forming."
  },
  {
    title: "Milky Way Galaxy",
    date: "2024-01-02",
    url: "https://apod.nasa.gov/apod/image/2401/MilkyWay_Winter_960.jpg",
    explanation: "Our home galaxy seen from Earth."
  },
  {
    title: "Earth from Space",
    date: "2024-01-03",
    url: "https://apod.nasa.gov/apod/image/2401/EarthBlueMarble_960.jpg",
    explanation: "The Blue Marble — Earth from space."
  }
];

// ---------------- FETCH NASA (WITH GUARANTEED FALLBACK) ----------------
async function fetchNASA(start, end) {
  try {
    showLoading();

    const url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&start_date=${start}&end_date=${end}`;

    const res = await fetch(url);
    const data = await res.json();

    console.log("NASA RESPONSE:", data);

    // if API fails → use fallback
    if (!Array.isArray(data)) {
      renderGallery(fallbackImages);
      showFact();
      return;
    }

    const images = data.filter(item => item.media_type === "image" && item.url);

    if (images.length === 0) {
      renderGallery(fallbackImages);
      showFact();
      return;
    }

    renderGallery(images.slice(0, 9));
    showFact();

  } catch (err) {
    console.error(err);
    renderGallery(fallbackImages);
    showFact();
  }
}

// ---------------- RENDER GALLERY ----------------
function renderGallery(items) {
  gallery.innerHTML = "";

  items.forEach(item => {
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

// ---------------- MODAL ----------------
function openModal(item) {
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.style.display = "flex";

  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-modal">&times;</span>
      <h2>${item.title}</h2>
      <p>${item.date}</p>
      <img src="${item.url}">
      <p>${item.explanation}</p>
    </div>
  `;

  modal.querySelector(".close-modal").onclick = () => modal.remove();

  document.body.appendChild(modal);
}

// ---------------- BUTTON CLICK ----------------
button.addEventListener("click", () => {
  const start = startDateInput.value;
  const end = endDateInput.value;

  if (!start || !end) {
    alert("Please select both dates");
    return;
  }

  fetchNASA(start, end);
});