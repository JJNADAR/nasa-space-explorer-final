const API_KEY = "DEMO_KEY";

const gallery = document.getElementById("gallery");
const startDateInput = document.getElementById("startDate");
const endDateInput = document.getElementById("endDate");
const button = document.querySelector("button");

/* Loading */
function showLoading() {
  gallery.innerHTML = `<p class="loading">Loading space images...</p>`;
}

/* Fact */
function showFact() {
  const facts = [
    "One day on Venus is longer than one year on Venus.",
    "Neutron stars can spin 600 times per second.",
    "There are more stars in the universe than grains of sand on Earth.",
    "A spoonful of a neutron star would weigh billions of tons."
  ];

  const fact = facts[Math.floor(Math.random() * facts.length)];

  const factBox = document.createElement("div");
  factBox.className = "fact-box";
  factBox.innerHTML = `
    <strong>Did You Know?</strong>
    <p>${fact}</p>
  `;

  gallery.prepend(factBox);
}

/* Fetch NASA */
async function fetchNASA(start, end) {
  try {
    showLoading();

    const url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&start_date=${start}&end_date=${end}`;

    const res = await fetch(url);
    const data = await res.json();

    console.log("NASA DATA:", data);

    const items = Array.isArray(data) ? data : [data];

    renderGallery(items);
    showFact();

  } catch (err) {
    console.error(err);
    gallery.innerHTML = `<p class="loading">Failed to load space images.</p>`;
  }
}

/* Render gallery */
function renderGallery(items) {
  gallery.innerHTML = "";

  items.forEach((item) => {
    const div = document.createElement("div");
    div.className = "card";

    const media =
      item.media_type === "video"
        ? `<iframe src="${item.url}"></iframe>`
        : `<img src="${item.url}" alt="${item.title}">`;

    div.innerHTML = `
      ${media}
      <h3>${item.title}</h3>
      <p>${item.date}</p>
    `;

    gallery.appendChild(div);
  });
}

/* Button click */
button.addEventListener("click", () => {
  const start = startDateInput.value;
  const end = endDateInput.value;

  if (!start || !end) {
    alert("Please select both dates");
    return;
  }

  fetchNASA(start, end);
});