const fetch = require("node-fetch")
const fs = require('fs')
const URL_GOODREADS = 'https://currently-reads.now.sh/reading/30739526/json'
const README_FILE = 'README.md';

function fetchGoodreads(callback) {
  fetch(URL_GOODREADS)
    .then(response => response.json())
    .then(data => callback(null, data))
    .catch(error => callback(error, null))
}

function returnBookInfo(content) {
  let bookInfo = '[' + content.title + ']'
  bookInfo += '(' + content.link + ')'
  bookInfo += ' by ' + content.authors[0].author[0].name + '.'
  return bookInfo
}

function updateReadme(book) {
  const readme = fs.readFileSync(README_FILE, 'utf-8')
  const readingInfo = returnBookInfo(book)

  if (readme.indexOf(readingInfo) >= 0) return

  const newContent = readme.replace(/(?<=Reading ).+/, readingInfo)
  fs.writeFileSync(README_FILE, newContent, 'utf-8')
}

fetchGoodreads((error, data) => {
  if (data) {
    const book = data[0].book[0]
    updateReadme(book)
  }
})