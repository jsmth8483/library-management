let booksCreated = localStorage.getItem('booksCreated') || 1;

// const myLibrary = [
// 	new Book('The Hobbit', 'J.R.R. Tolkien', 291, 'images/the_hobbit.jpg', false),
// 	new Book('The Hobbit', 'J.R.R. Tolkien', 292, 'images/the_hobbit.jpg', false),
// 	new Book('The Hobbit', 'J.R.R. Tolkien', 293, 'images/the_hobbit.jpg', false),
// 	new Book('The Hobbit', 'J.R.R. Tolkien', 294, 'images/the_hobbit.jpg', false),
// 	new Book('The Hobbit', 'J.R.R. Tolkien', 295, 'images/the_hobbit.jpg', true),
// 	new Book('The Hobbit', 'J.R.R. Tolkien', 296, 'images/the_hobbit.jpg', false),
// ];

function Book(title, author, pages, image, isRead) {
	this.id = booksCreated;
	this.title = title;
	this.author = author;
	this.pages = pages;
	this.image = image;
	this.isRead = isRead;
	this.info = function () {
		return `${this.title} by ${this.author}, ${this.pages} pages, ${
			isRead ? 'has bean read' : 'not been read'
		}`;
	};
	booksCreated++;
}

function addBookToLibrary(book) {
	//myLibrary.push(book);
	updateLocalStorage(book);
	localStorage.setItem('booksCreated', booksCreated);
}

function removeBookFromLibrary(id) {
	// const indexToRemove = myLibrary.findIndex((book) => {
	// 	return book.id == id;
	// });
	//myLibrary.splice(indexToRemove, 1);
	removeFromLocalStorage(id);
}

function updateLocalStorage(book) {
	localStorage.setItem(book.id, JSON.stringify(book));
}

function removeFromLocalStorage(id) {
	localStorage.removeItem(id);
}

function getBooksFromLocalStorage() {
	const localStorageKeys = Object.keys(localStorage).filter(Number);
	let books = [];
	localStorageKeys.forEach((key) => {
		const book = JSON.parse(localStorage.getItem(key));
		books.push(book);
	});
	return books;
}

function displayBooks() {
	const container = document.querySelector('.container');
	//myLibrary.forEach((book) => displayBook(book, container));
	const books = getBooksFromLocalStorage();
	books.forEach((book) => {
		displayBook(book, container);
	});
}

function displayBook(book, container) {
	const card = document.createElement('div');
	card.classList.add('card');
	console.log(book.image);
	const img = createImageElement(book.image);
	card.appendChild(img);
	const bookDetails = createBookDetailsElement(book);
	card.appendChild(bookDetails);
	container.appendChild(card);
}

function createBookDetailsElement(book) {
	const bookDetails = document.createElement('div');
	bookDetails.classList.add('book-details');

	const bookTitle = createBookTitleElement(book.title);
	bookDetails.appendChild(bookTitle);

	const bookAuthor = createBookAuthorElement(book.author);
	bookDetails.appendChild(bookAuthor);

	const bookPages = createBookPagesElement(book.pages);
	bookDetails.appendChild(bookPages);

	const bookControls = createBookControlsElements(book);
	bookDetails.appendChild(bookControls);

	return bookDetails;
}

function createImageElement(image) {
	const img = document.createElement('img');
	img.src = image;
	return img;
}

function createBookTitleElement(title) {
	const bookTitleElement = document.createElement('h2');
	bookTitleElement.classList.add('book-title');
	bookTitleElement.textContent = title;
	return bookTitleElement;
}

function createBookAuthorElement(author) {
	const bookAuthor = document.createElement('h3');
	bookAuthor.classList.add('book-author');
	bookAuthor.textContent = 'By: ';

	const authorNameSpan = document.createElement('span');
	authorNameSpan.classList.add('book-author-value');
	authorNameSpan.textContent = author;

	bookAuthor.appendChild(authorNameSpan);
	return bookAuthor;
}

function createBookPagesElement(pages) {
	const bookPages = document.createElement('h3');
	bookPages.classList.add('book-pages');

	const bookPagesSpan = document.createElement('span');
	bookPagesSpan.classList.add('book-page-value');
	bookPages.textContent = pages;

	const pagesLabelSpan = document.createElement('span');
	pagesLabelSpan.textContent = ' Pages';

	bookPages.appendChild(bookPagesSpan);
	bookPages.appendChild(pagesLabelSpan);
	return bookPages;
}

function createBookControlsElements(book) {
	const bookControls = document.createElement('div');
	bookControls.classList.add('book-controls');

	//Add read button that toggles based on read status. Clicking will set the read status in the object and change styling of button
	const bookReadButton = createBookReadButton(book);
	bookControls.appendChild(bookReadButton);

	const bookRemoveBtn = createBookRemoveBtn(book);
	bookControls.appendChild(bookRemoveBtn);

	return bookControls;
}

function createBookRemoveBtn(book) {
	const removeBtn = document.createElement('div');
	removeBtn.classList.add('remove-book');
	removeBtn.textContent = 'Remove';
	removeBtn.setAttribute('data-id', book.id);
	removeBtn.addEventListener('click', (e) => {
		const id = parseInt(e.target.getAttribute('data-id'));
		removeBookFromLibrary(id);

		// Remove card from container
		e.target.parentNode.parentNode.parentNode.remove(
			e.target.parentNode.parentNode
		);
	});
	return removeBtn;
}

function createBookReadButton(book) {
	const readButton = document.createElement('div');
	readButton.classList.add('read-book');
	//readButton.textContent = 'Unread';
	readButton.setAttribute('data-id', book.id);
	setButtonReadStatus(readButton, book);
	readButton.addEventListener('click', (e) => {
		const id = e.target.getAttribute('data-id');
		const book = getBooksFromLocalStorage().find((book) => {
			return book.id == id;
		});
		book.isRead ? (book.isRead = false) : (book.isRead = true);
		setButtonReadStatus(e.target, book);
		updateLocalStorage(book);
	});
	return readButton;
}

function setButtonReadStatus(readButton, book) {
	if (!book.isRead) {
		readButton.classList.add('read');
		readButton.textContent = 'Read';
	} else {
		readButton.classList.remove('read');
		readButton.textContent = 'Unread';
	}
}

displayBooks();

const addBookFormToggle = document.querySelector('.add-book-form-toggle');
addBookFormToggle.addEventListener('click', (e) => {
	const formSlider = document.querySelector('.form-slider');
	if (formSlider.classList.contains('expanded')) {
		formSlider.classList.remove('expanded');
	} else {
		formSlider.classList.add('expanded');
	}
});

const addForm = document.querySelector('.add-book-form');
// console.log(submitFormButton);
addForm.addEventListener('submit', (e) => {
	e.preventDefault();
	const title = document.querySelector('#title');
	const author = document.querySelector('#author');
	const pages = document.querySelector('#pages');
	const isRead = document.querySelector('#read');
	const imageInput = document.querySelector('#image');
	const imageFile = imageInput.files[0];
	const book = new Book(
		title.value,
		author.value,
		pages.value,
		URL.createObjectURL(imageFile),
		isRead.checked
	);
	addBookToLibrary(book);
	const container = document.querySelector('.container');
	displayBook(book, container);
});
