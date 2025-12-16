const bookList = document.getElementById("book-list");
const form = document.getElementById("book-form");
const searchInput = document.getElementById("search");
const sortBtn = document.createElement("button");
sortBtn.textContent = "Sort by Genre";
document.querySelector(".catalogue").insertBefore(sortBtn, bookList.parentElement);

// Load books from localStorage or use defaults
let books = JSON.parse(localStorage.getItem("books")) || [
  { title: "1984", author: "George Orwell", year: 1949, genre: "Dystopian" },
  { title: "The Hobbit", author: "J.R.R. Tolkien", year: 1937, genre: "Fantasy" }
];

// Save to localStorage
function saveBooks() {
  localStorage.setItem("books", JSON.stringify(books));
}

// Render books
function renderBooks(filter = "") {
  bookList.innerHTML = "";
  books
    .filter(book => book.title.toLowerCase().includes(filter.toLowerCase()) ||
                    book.author.toLowerCase().includes(filter.toLowerCase()))
    .forEach((book, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.year}</td>
        <td>${book.genre}</td>
        <td><button class="delete-btn" data-index="${index}">Delete</button></td>
      `;
      bookList.appendChild(row);
    });
}

// Add book
form.addEventListener("submit", e => {
  e.preventDefault();
  const newBook = {
    title: document.getElementById("title").value,
    author: document.getElementById("author").value,
    year: document.getElementById("year").value,
    genre: document.getElementById("genre").value
  };
  books.push(newBook);
  saveBooks();
  renderBooks();
  form.reset();
});

// Delete book
bookList.addEventListener("click", e => {
  if (e.target.classList.contains("delete-btn")) {
    const index = e.target.dataset.index;
    books.splice(index, 1);
    saveBooks();
    renderBooks(searchInput.value);
  }
});

// Search books
searchInput.addEventListener("input", e => {
  renderBooks(e.target.value);
});

// Sorting function
function sortBooks(by) {
  books.sort((a, b) => {
    if (by === "year") return a.year - b.year;
    return a[by].toLowerCase().localeCompare(b[by].toLowerCase());
  });
  saveBooks();
  renderBooks(searchInput.value);
}

// Button events
document.getElementById("sort-title").addEventListener("click", () => sortBooks("title"));
document.getElementById("sort-author").addEventListener("click", () => sortBooks("author"));
document.getElementById("sort-year").addEventListener("click", () => sortBooks("year"));
document.getElementById("sort-genre").addEventListener("click", () => sortBooks("genre"));

// Dropdown event
document.getElementById("sort-select").addEventListener("change", e => {
  const value = e.target.value;
  if (value) sortBooks(value);
});

// Sort by genre
sortBtn.addEventListener("click", () => {
  books.sort((a, b) => a.genre.localeCompare(b.genre));
  saveBooks();
  renderBooks(searchInput.value);
});

// Initial render
renderBooks();