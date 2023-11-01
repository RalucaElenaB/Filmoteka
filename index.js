document.querySelector(".header__svg").style.fill = "red";
//variabile de verificare
const moviesSearch = document.getElementById("movies-search"); //button Click for movies

const movieGallery = document.getElementById("movie-gallery"); //ul

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const closeButton = document.getElementById("close-button");

const form = document.querySelector(".search-form");
const userInput = document.querySelector("input#search-query");
const searchButton = document.querySelector("button#search-btn");

let isMoviesLoaded = false;

const url =
  "https://api.themoviedb.org/3/trending/movie/day?api_key=f69b218f7039aed7eae0062e90da9fdc";

form.addEventListener("submit", searchMoviesFunction); //adaugam evenimentul

function searchMoviesFunction(e) {
  e.preventDefault();
  clearHTML(movieGallery);
  const input = e.target.elements.searchQuery.value.trim().toLowerCase();
  // pageNum = 1;
  const url = `https://api.themoviedb.org/3/search/movie?api_key=f69b218f7039aed7eae0062e90da9fdc&query=${input}&page=1&language=en-US`;
  createMovieGallery(url);
}

function createMovieGallery(url) {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const movies = data.results;
      displayMovies(movies);
      previousPageNumber = data.page;
      handlePagination(data.page, data.total_pages);
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  // Adaugă eveniment pentru a închide lightbox-ul
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      lightbox.style.display = "none";
    }
  });
}
const clearHTML = (element) => (element.innerHTML = "");
function displayMovies(movies) {
  movies.forEach((movie) => {
    const movieItem = document.createElement("li");
    const movieLink = document.createElement("a");
    movieLink.href = `https://www.themoviedb.org/movie/${movie.id}`;
    movieLink.target = "_blank";
    const movieImage = document.createElement("img");
    movieImage.src = movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : "https://ik.imagekit.io/tc8jxffbcvf/default-movie-portrait_EmJUj9Tda5wa.jpg?tr=fo-auto,di-";
    movieImage.alt = movie.title;
    movieImage.dataset.src = `https://image.tmdb.org/t/p/original${movie.poster_path}`;
    const movieTitle = document.createElement("h2");
    movieTitle.textContent = movie.title;

    const genreIds = movie.genre_ids;
    const movieGenresAsString = getGenres(genreList, genreIds);
    const movieGenre = document.createElement("p");
    movieGenre.textContent = `${movieGenresAsString} | ${
      movie.release_date.split("-")[0]
    }`;

    movieLink.appendChild(movieImage);
    movieItem.appendChild(movieLink);
    movieLink.appendChild(movieTitle);
    movieItem.appendChild(movieGenre);
    movieGallery.appendChild(movieItem);

    // Adaugă eveniment pentru a deschide lightbox-ul
    movieImage.addEventListener("click", (event) => {
      event.preventDefault();
      lightboxImage.src = event.target.dataset.src;
      lightbox.style.display = "block";
    });
    closeButton.addEventListener("click", () => {
      lightbox.style.display = "none";
    });
  });
}

createMovieGallery(url);

function getGenres(genreList, genreIds) {
  const arrOfGenresName = genreIds.map((currentId) => {
    const genre = genreList.find((elem) => elem.id === currentId);

    return genre.name;
  });

  const str = arrOfGenresName.reduce((acc, genre, index, arr) => {
    if (arr.length > 2) {
      acc = `${arr[0]}, ${arr[1]}, Other`;
    } else {
      acc = arr.join(", ");
    }

    return acc;
  }, "");

  return str;
}

const genreList = [
  {
    id: 28,
    name: "Action",
  },
  {
    id: 12,
    name: "Adventure",
  },
  {
    id: 16,
    name: "Animation",
  },
  {
    id: 35,
    name: "Comedy",
  },
  {
    id: 80,
    name: "Crime",
  },
  {
    id: 99,
    name: "Documentary",
  },
  {
    id: 18,
    name: "Drama",
  },
  {
    id: 10751,
    name: "Family",
  },
  {
    id: 14,
    name: "Fantasy",
  },
  {
    id: 36,
    name: "History",
  },
  {
    id: 27,
    name: "Horror",
  },
  {
    id: 10402,
    name: "Music",
  },
  {
    id: 9648,
    name: "Mystery",
  },
  {
    id: 10749,
    name: "Romance",
  },
  {
    id: 878,
    name: "Science Fiction",
  },
  {
    id: 10770,
    name: "TV Movie",
  },
  {
    id: 53,
    name: "Thriller",
  },
  {
    id: 10752,
    name: "War",
  },
  {
    id: 37,
    name: "Western",
  },
];

//paginare
let previousPageNumber = 1;
const paginationList = document.getElementById("pagination-home");

function handlePagination(currentPage, total_pages) {
  clearHTML(paginationList);
  const pages = getPagesArray(currentPage, total_pages);
  for (let index = 0; index < pages.length; index++) {
    const pageItem = document.createElement("li");
    pageItem.classList.add("pagination__item", "pagination__on");
    if (currentPage === pages[index]) {
      pageItem.classList.add("pagination__item--current");
    }
    if (pages[index] === -1 || pages[index] === -2) {
      pageItem.setAttribute("id", pages[index].toString());
      pageItem.textContent = "...";
    } else {
      pageItem.setAttribute("id", pages[index].toString());
      pageItem.textContent = pages[index];
    }
    pageItem.addEventListener("click", getCurrentPage);
    paginationList.appendChild(pageItem);
  }
}

function getPagesArray(currentPage, total_pages) {
  let pages = [];
  //7 or less total_pages
  if (total_pages <= 7) {
    for (let index = 1; index < total_pages; index++) {
      pages.push(index);
    }
    return pages;
  }
  //first 4 pages
  if (currentPage >= 1 && currentPage <= 4) {
    pages = [1, 2, 3, 4, 5, -2, total_pages];
    return pages;
  }
  //middle pages
  if (currentPage > 4 && currentPage < total_pages - 3) {
    pages = [
      1,
      -1,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      -2,
      total_pages,
    ];
    return pages;
  }
  //last 4 pages
  if (currentPage >= total_pages - 3 && currentPage <= total_pages) {
    pages = [
      1,
      -1,
      total_pages - 4,
      total_pages - 3,
      total_pages - 2,
      total_pages - 1,
      total_pages,
    ];
    return pages;
  }
  return pages;
}

function getCurrentPage(event) {
  event.preventDefault();
  let pageNumber = Number(event.target.id);
  console.log(pageNumber);
  if (previousPageNumber === pageNumber) {
    return; //pt a nu face request la server pt aceleasi date
  }
  if (pageNumber === -1) {
    pageNumber = previousPageNumber - 1;
  }
  if (pageNumber === -2) {
    pageNumber = previousPageNumber + 1;
  }
  clearHTML(movieGallery);

  const url = `https://api.themoviedb.org/3/trending/movie/day?api_key=f69b218f7039aed7eae0062e90da9fdc&page=${pageNumber}&language=en-US`;
  createMovieGallery(url);
}
