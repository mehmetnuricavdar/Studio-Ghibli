const mainElement = document.querySelector("main");

async function getFilms() {
  const getData = await fetch("https://ghibliapi.vercel.app/films");
  const data = await getData.json();
  setSort(data);

  data.forEach((element) => {
    createCard(element);
  });
}

getFilms();

document.getElementById("sortorder").addEventListener("change", () => {
  mainElement.innerHTML = "";
  getFilms();
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

const createCard = (data) => {
  const card = document.createElement("article");
  const movieTitle = document.createElement("h2");
  const movieTitleTxt = document.createTextNode(data.title);
  movieTitle.appendChild(movieTitleTxt);

  const director = document.createElement("p");
  const directorTxt = document.createTextNode(`Director: ${data.director}`);
  director.appendChild(directorTxt);

  const year = document.createElement("p");
  const yearTxt = document.createTextNode(`Year: ${data.release_date}`);
  year.appendChild(yearTxt);

  const desc = document.createElement("p");
  const descTxt = document.createTextNode(`Description: ${data.description}`);
  desc.appendChild(descTxt);

  const rating = document.createElement("p");
  const ratingTxt = document.createTextNode(
    `Rotten Tomatoes Score: ${data.rt_score}`
  );
  rating.appendChild(ratingTxt);

  const filmImg = document.createElement("img");
  filmImg.setAttribute("src", data.image);
  filmImg.style.width = "20rem";
  filmImg.style.height = "17rem";

  card.appendChild(movieTitle);
  card.appendChild(director);
  card.appendChild(year);
  card.appendChild(desc);
  card.appendChild(rating);
  card.appendChild(filmImg);

  mainElement.appendChild(card);
};
