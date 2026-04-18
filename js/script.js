const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');
const button = document.querySelector('button');
const gallery = document.getElementById('gallery');

const API_KEY = "DEMO_KEY"; // i wanna use the demo key for easing testingggg

// keep the starteer
setupDateInputs(startInput, endInput);

// loads UI
function showLoading() {
  gallery.innerHTML = `<p class="loading">Loading space images...</p>`;
}

// get nasa data 
async function fetchNASA(start, end) {
  showLoading();

  try {
    const url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&start_date=${start}&end_date=${end}`;

    const res = await fetch(url);
    const data = await res.json();

    // ensure array + limit 9 (rubric requirement)
    const items = Array.isArray(data) ? data.slice(0, 9) : [];

    renderGallery(items);
    showFact();

  } catch (error) {
    gallery.innerHTML = `<p class="loading">Failed to load data. Try again.</p>`;
    console.error(error);
  }
}

// rednders gallery
function renderGallery(items) {
  gallery.innerHTML = "";

  if (!items.length) {
    gallery.innerHTML = `<p class="loading">No images found.</p>`;
    return;
  }

  items.forEach(item => {
    const div = document.createElement("div");
    div.className = "gallery-item";

    // handle the media for my levelip
    let mediaHTML = "";

    if (item.media_type === "video") {
      mediaHTML = `
        <iframe width="100%" height="200"
          src="${item.url}"
          frameborder="0"
          allow="autoplay; encrypted-media"
          allowfullscreen>
        </iframe>
      `;
    } else {
      mediaHTML = `
        <img src="${item.url}" alt="${item.title}"
        onclick='openModal(${JSON.stringify(item).replace(/'/g, "\\'")})'>
      `;
    }

    div.innerHTML = `
      ${mediaHTML}
      <h3>${item.title}</h3>
      <p>${item.date}</p>
    `;

    gallery.appendChild(div);
  });
}

// model
function openModal(item) {
  const modal = document.createElement("div");
  modal.className = "modal";

  modal.innerHTML = `
    <div class="modal-content">
      <span class="close" onclick="this.parentElement.parentElement.remove()">×</span>
      <h2>${item.title}</h2>
      <p>${item.date}</p>

      ${
        item.media_type === "video"
          ? `<iframe width="100%" height="400" src="${item.url}" frameborder="0" allowfullscreen></iframe>`
          : `<img src="${item.url}" />`
      }

      <p>${item.explanation}</p>
    </div>
  `;

  document.body.appendChild(modal);
}

// a random space fact from google
function showFact() {
  const facts = [
    "A day on Venus is longer than a year on Venus.",
    "There are more stars in space than grains of sand on Earth.",
    "Neutron stars spin up to 600 times per second.",
    "The Sun contains 99.8% of the mass in our solar system."
  ];

  const fact = facts[Math.floor(Math.random() * facts.length)];

  const box = document.createElement("div");
  box.className = "fact-box";
  box.innerHTML = `<strong>Did You Know?</strong><p>${fact}</p>`;

  gallery.prepend(box);
}

// button clockssss
button.addEventListener("click", () => {
  const start = startInput.value;
  const end = endInput.value;

  if (!start || !end) {
    alert("Please select a start and end date.");
    return;
  }

  fetchNASA(start, end);
});