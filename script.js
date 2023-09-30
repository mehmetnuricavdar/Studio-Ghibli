const mainElement = document.querySelector("main");

let filmData;

async function getFilms() {
  const getData = await fetch("https://ghibliapi.vercel.app/films");
  const data = await getData.json();
  setSort(data);
  addCards(data);
  filmData = data;
  document.getElementById("sortorder").removeAttribute("disabled");
}

getFilms();

document.getElementById("sortorder").addEventListener("change", () => {
  mainElement.innerHTML = "";
  setSort(filmData);
  addCards(filmData);
});

const setSort = (array) => {
  const sortOrder = document.getElementById("sortorder").value;
  switch (sortOrder) {
    case "title":
      array.sort((a, b) => (a.title > b.title ? 1 : -1));
      break;
    case "release_date":
      array.sort((a, b) => (a.release_date > b.release_date ? 1 : -1));
      break;
    case "rt_score":
      array.sort((a, b) =>
        parseInt(a.rt_score) > parseInt(b.rt_score) ? -1 : 1
      );
      break;
  }
};

const addCards = (array) => {
  array.forEach((element) => {
    createCard(element);
  });
};

const createCard = (data) => {
  const card = document.createElement("article");
  card.innerHTML = cardContent(data);
  mainElement.appendChild(card);
};

const cardContent = (data) => {
  let html = `<h2>${data.title}</h2>`;
  html += `<p><strong>Director: </strong>${data.director}</p>`;
  html += `<p><strong>Released: </strong>${data.release_date}</p>`;
  html += `<p>${data.description}</p>`;
  html += `<p><strong>Rotten Tomatoes Score: </strong>${data.rt_score}</p>`;
  html += `<img src="${data.image}" width=480px height=640px>`;

  return html;
};

const peopleCardContent = async (data) => {
  const species = await indivItem(data.species, "name");
  let html = `<h2>${data.name}</h2>`;
  html += `<p><strong>Details:</strong>gender ${data.gender}, age ${data.age}, eye color ${data.eye_color}, hair ${data.hair_color}</p>`;
  html += `<p><strong>Species:</strong>${species}</p>`;
  return html;
};

const indivItem = async (url, item) => {
  const itemPromise = await fetch(url);
  const data = await itemPromise.json();
  return data[item];
};
