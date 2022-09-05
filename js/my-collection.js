let myCollection = [];

if(window.localStorage.getItem('myCollection')){
   myCollection = JSON.parse(window.localStorage.getItem('myCollection'));

}
let books_list = '';
myCollection.forEach((item) =>{
  let book_card = createBookItem(item, 0)
  books_list += book_card;
})
content.innerHTML = books_list;

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
    addCollectionBtn = `<button type="button" id="${book.id}" class="add-button">Add Book to Colection</button>`;
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
