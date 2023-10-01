const mainElement = document.querySelector("main");
const navLinks = document.querySelectorAll("#mainnav ul li a");

let filmData;
let dataSet = "films";
let url = "https://ghibliapi.vercel.app/films";

async function getData() {
  const response = await fetch(url);
  const data = await response.json();

  if (dataSet === "films") {
    mainElement.innerHTML = "";
    setSort(data);
    addCards(data);
    filmData = data;
    document.querySelector("nav form").style.visibility = "visible";

    document.getElementById("sortorder").removeAttribute("disabled");
  } else {
    mainElement.innerHTML = "";
    document.querySelector("nav form").style.visibility = "hidden";
    addCards(data);
  }
}

getData();

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

const createCard = async (data) => {
  const card = document.createElement("article");
  switch (dataSet) {
    case "films":
      card.innerHTML = filmCardContents(data);
      break;
    case "people":
      card.innerHTML = await peopleCardContents(data);
      break;
    case "locations":
      card.innerHTML = await locationCardContents(data);
      break;
    case "vehicles":
      card.innerHTML = await vehiclesCardContents(data);
      break;
    case "species":
      card.innerHTML = await speciesCardContents(data);
      break;
  }
  mainElement.appendChild(card);
};

const filmCardContents = (data) => {
  let html = `<h2>${data.title}</h2>`;
  html += `<p><strong>Director: </strong>${data.director}</p>`;
  html += `<p><strong>Released: </strong>${data.release_date}</p>`;
  html += `<p>${data.description}</p>`;
  html += `<p><strong>Rotten Tomatoes Score: </strong>${data.rt_score}</p>`;
  html += `<img src="${data.image}" width=480px height=640px>`;
  return html;
};

const peopleCardContents = async (data) => {
  const theFilms = data.films;
  let filmTitles = [];
  for (eachFilm of theFilms) {
    const filmTitle = await indivItem(eachFilm, "title");
    filmTitles.push(filmTitle);
  }
  const species = await indivItem(data.species, "name");
  let html = `<h2>${data.name}</h2>`;
  html += `<p><strong>Details:</strong>Gender: ${data.gender}, Age: ${data.age}, Eye color: ${data.eye_color}, Hair: ${data.hair_color}</p>`;
  html += `<p><strong>Films:</strong>${filmTitles.join(", ")}</p>`;
  html += `<p><strong>Species:</strong>${species}</p>`;
  return html;
};

const locationCardContents = async (data) => {
  const regex = "https?://";
  const theResidents = data.residents;
  let residentNames = [];
  for (eachResident of theResidents) {
    if (eachResident.match(regex)) {
      const resName = await indivItem(eachResident, "name");
      residentNames.push(resName);
    } else {
      residentNames[0] = "no data available";
    }
  }

  const theFilms = data.films;
  let filmTitles = [];
  for (eachFilm of theFilms) {
    const filmTitle = await indivItem(eachFilm, "title");
    filmTitles.push(filmTitle);
  }

  let html = `<h2>${data.name}</h2>`;
  html += `<p><strong>Details:</strong>Climate ${data}, Terrain ${data.terrain}, Surface water ${data.surface_water}%</p>`;
  html += `<p><strong>Residents:</strong>${residentNames.join(", ")}</p>`;
  html += `<p<<strong>Films:</strong>${filmTitles.join(", ")}</p>`;
  return html;
};

const speciesCardContents = async (data) => {
  const people = data.people;
  let peopleNames = [];
  for (eachPerson of people) {
    const personName = await indivItem(eachPerson, "name");
    peopleNames.push(personName);
  }

  const theFilms = data.films;
  let filmTitles = [];
  for (eachFilm of theFilms) {
    const filmTitle = await indivItem(eachFilm, "title");
    filmTitles.push(filmTitle);
  }

  let html = `<h2>${data.name}</h2>`;
  html += `<p><strong>Classification:</strong>${data.classification}</p>`;
  html += `<p><strong>Eye Colors:</strong>${data.eye_colors}</p>`;
  html += `<p><strong>Hair Colors:</strong>${data.hair_colors}</p>`;
  html += `<p><strong>People:</strong>${peopleNames.join(", ")}</p>`;
  html += `<p><strong>Films:</strong>${filmTitles.join(", ")}</p>`;

  return html;
};

const vehiclesCardContents = async (data) => {
  let html = `<h2>${data.name}</h2>`;
  html += `<p><strong>Description:</strong>${data.description}</p>`;
  html += `<p><strong>Details:</strong>Vehichle class: ${data.vehicle_class}, Length ${data.length},`;
  html += `<p><strong>Pilot:</strong>${await indivItem(
    data.pilot,
    "name"
  )}</p>`;
  html += `<p><strong>Films:</strong>${await indivItem(
    data.films,
    "title"
  )}</p>`;
  return html;
};

const indivItem = async (url, item) => {
  let theItem;
  try {
    const itemPromise = await fetch(url);
    const data = await itemPromise.json();
    theItem = data[item];
  } catch (err) {
    theItem = "no data available";
  } finally {
    return theItem;
  }
};

navLinks.forEach((eachLink) => {
  eachLink.addEventListener("click", (e) => {
    e.preventDefault();
    const thisLink = e.target.getAttribute("href").substring(1);
    url = "https://ghibliapi.vercel.app/" + thisLink;
    dataSet = thisLink;
    getData(url);
  });
});
