// =====input setuo for date =====
const startInput = document.getElementById("startDate");
const endInput = document.getElementById("endDate");
const button = document.querySelector("button");
const gallery = document.getElementById("gallery");

setupDateInputs(startInput, endInput);

// ===== just gonna use demo key cause i dont have one =====
const API_KEY = "DEMO_KEY"; 

// ===== a random space fact here (leveluppp) =====
const facts = [
  "A day on Venus is longer than a year on Venus.",
  "Neutron stars can spin 600 times per second.",
  "There are more stars in the universe than grains of sand on Earth.",
  "Jupiter has the shortest day of all planets.",
  "Black holes can slow down time.",
  "The Milky Way is over 100,000 light-years wide."
];

function showRandomFact() {
  const fact = facts[Math.floor(Math.random() * facts.length)];

  const factBox = document.createElement("div");
  factBox.className = "space-fact";
  factBox.innerHTML = `🌌 <strong>Did You Know?</strong> ${fact}`;

  document.querySelector(".container").insertBefore(factBox, gallery);
}

showRandomFact();

// ===== get apod data =====
button.addEventListener("click", async () => {
  const startDate = startInput.value;
  const endDate = endInput.value;

  if (!startDate || !endDate) return;

  gallery.innerHTML = `<div class="loading">🔄 Loading space photos...</div>`;

  try {
    const res = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&start_date=${startDate}&end_date=${endDate}`
    );

    const data = await res.json();

    displayGallery(data.reverse()); // newest first
  } catch (err) {
    gallery.innerHTML = `<p>Error loading images.</p>`;
  }
});

// ===== gallleryyyy =====
function displayGallery(items) {
  gallery.innerHTML = "";

  items.forEach((item) => {
    const card = document.createElement("div");
    card.className = "gallery-item";

    // handle images vs videos (levleuppp)
    if (item.media_type === "image") {
      card.innerHTML = `
        <img src="${item.url}" alt="${item.title}">
        <p><strong>${item.title}</strong></p>
        <p>${item.date}</p>
      `;
    } else if (item.media_type === "video") {
      card.innerHTML = `
        <iframe src="${item.url}" allowfullscreen></iframe>
        <p><strong>${item.title}</strong></p>
        <p>${item.date}</p>
      `;
    }

    // model click
    card.addEventListener("click", () => openModal(item));

    gallery.appendChild(card);
  });
}

// ===== modal =====
const modal = document.createElement("div");
modal.className = "modal";
modal.innerHTML = `
  <div class="modal-content">
    <span class="close-modal">&times;</span>
    <div id="modalBody"></div>
  </div>
`;

document.body.appendChild(modal);

const modalBody = document.getElementById("modalBody");

function openModal(item) {
  modal.style.display = "flex";

  if (item.media_type === "image") {
    modalBody.innerHTML = `
      <h2>${item.title}</h2>
      <p>${item.date}</p>
      <img src="${item.hdurl || item.url}">
      <p>${item.explanation}</p>
    `;
  } else {
    modalBody.innerHTML = `
      <h2>${item.title}</h2>
      <p>${item.date}</p>
      <iframe src="${item.url}" allowfullscreen></iframe>
      <p>${item.explanation}</p>
    `;
  }
}

// close modal
document.querySelector(".close-modal").onclick = () => {
  modal.style.display = "none";
};

window.onclick = (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
};