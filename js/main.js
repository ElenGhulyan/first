/**
 * Let's implement Books Search and Collect app through Google Book API v1
 * Example App: https://ngrx.github.io/example-app/#/
 *
 *
 * 1. Integrate Google Books API via https://developers.google.com/books/docs/v1/reference/volumes/list
 * API_PATH = 'https://www.googleapis.com/books/v1/volumes?q={search terms}';
 *
 * 2. Create "Browse Books Page" where users can search for their favorite books, for example https://ngrx.github.io/example-app/#/book/find
 * 2.1 Implement search via input field, after every keyup you should send request to API_PATH
 * 2.2 After receiving books, you should render books on the page. The design and appearance of the book list could be decided by yourself.
 * 2.3 Every Book Item should have an "Add Book to Collection" button. When clicking on the button book should be added into localStorage
 *
 * 3. Create "My Collection Page" where users can see their collected books (receive from localStorage), for example https://ngrx.github.io/example-app/#/
 * 3.1 Every Book Item should have a "Remove Book from Collection" button. When clicking on the button book should be removed from localStorage, appropriately from the page too.
 *
 *
 * How to run application
 * 1. npm i
 * 2. npm run start
 * */
let content = document.querySelector('#content');

let search = document.querySelector('#search-book');
let latestTimeoutId;
search.addEventListener('keyup', keyupFunction);

function keyupFunction(event) {
  let searchTerm = event.target.value.trim();

  clearTimeout(latestTimeoutId);

  if (searchTerm) {

    latestTimeoutId = setTimeout(() => {
      fetch(`https://www.googleapis.com/books/v1/volumes?q=${searchTerm}`)
        .then((res) => {
          return res.json();

        }).then((data) => {
        console.log(data.items);
        let books_list = '';


        data.items.forEach((item) => {
          let book_card = createBookItem(item, 0)
          books_list += book_card;
        })
        content.innerHTML = books_list;

      })
    }, 400)
  }
}


let menu_button = document.querySelector('.menu-button');
menu_button.addEventListener('click', menuOpenFunction);

function menuOpenFunction(e) {
  let sidebar = document.querySelector('#sidebar');
  sidebar.className = 'open';
}


function createBookItem(book, isSinglePage) {
  let addCollectionBtn = '';
  let singlePageClassName = '';

  let book_img = '';
  let book_subtitle = '';
  let book_desc = '';
  let book_author = book.volumeInfo.authors ? book.volumeInfo.authors.join(',') : 'Author Unknown';
  if (book.volumeInfo.imageLinks) {
    book_img = book.volumeInfo.imageLinks.smallThumbnail;
  }
  if (book.volumeInfo.subtitle) {
    book_subtitle = book.volumeInfo.subtitle;
  }
  if (book.volumeInfo.description) {
    book_desc = book.volumeInfo.description;
  }
  if (isSinglePage === 1) {

    let myCollection = JSON.parse(window.localStorage.getItem('myCollection'));
    const bookFromCollection = myCollection.find(element => element.id === book.id);

    if (bookFromCollection) {
      addCollectionBtn = `<button type="button" id="${book.id}" data-type="remove" class="collection-btn">Remuve Book from Colection</button>`;
    } else {
      addCollectionBtn = `<button type="button" id="${book.id}" data-type="add" class="collection-btn">Add Book to Colection</button>`;
    }

    singlePageClassName = 'single-book-card';
  }


  return `<div class="book-card ${singlePageClassName}">
    <a id="${book.id}" onclick="openBookFunction(this)" class="book-link">


      <div class="card-header">
        <div class="book-title">
          <p>${book.volumeInfo.title}</p>
          <span>${book_subtitle}</span>
        </div>
        <div class="book-img">
          <img
            src="${book_img}"
            alt="">
        </div>
      </div>
      <div class="book-content">
        <p>${book_desc}</p>
      </div>
      <div class="book-footer">
        <span>Written By:</span>
        <p>${book_author}</p>

      </div>
    </a>

   ${addCollectionBtn}

  </div>`;

}

function openBookFunction(element) {
  let book_id = element.id;
  fetch(`https://www.googleapis.com/books/v1/volumes/${book_id}`)
    .then((item) => {
    return item.json()
  })
    .then((data) => {
    content.innerHTML = createBookItem(data, 1);
    let add_button = document.querySelector('.collection-btn');
    add_button.addEventListener('click', addToCollection);
  })
}


function addToCollection(event) {
  let id = event.target.id;
  let data_type = event.target.dataset.type;

  if (data_type === 'add') {
    fetch(`https://www.googleapis.com/books/v1/volumes/${id}`)
      .then((item) => {
        return item.json()
      })
      .then((data) =>  6{

        let myCollectionArr = [];

        if (window.localStorage.getItem('myCollection')) {
          myCollectionArr = JSON.parse(window.localStorage.getItem('myCollection'));
        }
        myCollectionArr.push(data)

        window.localStorage.setItem('myCollection', JSON.stringify(myCollectionArr));
      });

    event.target.innerHTML = 'Remove book from collection';
    event.target.dataset.type = 'remove';

  } else {
    let myCollectionArr = JSON.parse(window.localStorage.getItem('myCollection'));
    let filterCollection = myCollectionArr.filter((item) => item.id !== id);
    window.localStorage.setItem('myCollection', JSON.stringify(filterCollection))

    event.target.innerHTML = 'Add book to collection';
    event.target.dataset.type = 'add';
  }


}
