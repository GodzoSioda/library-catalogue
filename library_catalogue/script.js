const bookList = document.getElementById("book-list");
const form = document.getElementById("book-form");
const searchInput = document.getElementById("search");
const sortContainer = document.querySelector(".sort-controls");
const sortSelect = document.getElementById("sort-select");

// 1. Data Management: Load books from localStorage or use defaults
let books = JSON.parse(localStorage.getItem("books")) || [
    { title: "1984", author: "George Orwell", year: 1949, genre: "Dystopian" },
    { title: "The Hobbit", author: "J.R.R. Tolkien", year: 1937, genre: "Fantasy" }
];

// Save to localStorage
function saveBooks() {
    localStorage.setItem("books", JSON.stringify(books));
}

// 2. Rendering Logic (Securely handles user input)
function renderBooks(filter = "") {
    bookList.innerHTML = ""; // Clear existing rows

    const filteredBooks = books.filter(book => 
        book.title.toLowerCase().includes(filter.toLowerCase()) ||
        book.author.toLowerCase().includes(filter.toLowerCase())
    );

filteredBooks.forEach((book, index) => {
        const row = document.createElement("tr");

        // Create cells securely using textContent to prevent XSS
        const createCell = (text) => {
            const td = document.createElement("td");
            td.textContent = text;
            return td;
        };

        row.appendChild(createCell(book.title));
        row.appendChild(createCell(book.author));
        row.appendChild(createCell(book.year));
        row.appendChild(createCell(book.genre));

// Create Delete Button
        const actionCell = document.createElement("td");
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete-btn";
        deleteBtn.dataset.index = index; // Store index for deletion
        actionCell.appendChild(deleteBtn);
        row.appendChild(actionCell);

        bookList.appendChild(row);
    });
}

// 3. Operations: Sorting
function sortBooks(by) {
    if (!by) return;

    books.sort((a, b) => {
        if (by === "year") return a.year - b.year;
        // Handle string comparison for title, author, and genre
        const valA = String(a[by]).toLowerCase();
        const valB = String(b[by]).toLowerCase();
        return valA.localeCompare(valB);
    });

saveBooks();
    renderBooks(searchInput.value);
}

// 4. Event Listeners

// Add Book Form
form.addEventListener("submit", e => {
    e.preventDefault();

const newBook = {
        title: document.getElementById("title").value.trim(),
        author: document.getElementById("author").value.trim(),
        year: parseInt(document.getElementById("year").value, 10), // Store as Number
        genre: document.getElementById("genre").value.trim()
    };

    books.push(newBook);
    saveBooks();
    renderBooks(searchInput.value);
    form.reset();
});

// Delete Book (Event Delegation on the table body)
bookList.addEventListener("click", e => {
    if (e.target.classList.contains("delete-btn")) {
        const index = e.target.dataset.index;
        books.splice(index, 1);
        saveBooks();
        renderBooks(searchInput.value);
    }
});

// Search functionality
searchInput.addEventListener("input", e => {
    renderBooks(e.target.value);
});

// Sorting (Event Delegation for all buttons starting with "sort-")
sortContainer.addEventListener("click", e => {
    if (e.target.tagName === "BUTTON") {
        // Extract sort key from ID (e.g., "sort-title" -> "title")
        const sortKey = e.target.id.replace("sort-", "");
        sortBooks(sortKey);
    }
});

// Dropdown Sort
sortSelect.addEventListener("change", e => {
    sortBooks(e.target.value);
});

// 5. Initial Execution
renderBooks();