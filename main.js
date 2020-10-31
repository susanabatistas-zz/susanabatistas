const request = require('request')
const cheerio = require('cheerio')
const fs = require('fs')

const goodreadsUrl = 'https://www.goodreads.com'
const goodreadsProfileUrl = '/user/show/30739526-susana-batista'
const goodreadsProfile = goodreadsUrl + goodreadsProfileUrl;
const readmeFile = 'README.md';

function updateReadme(bookInfo) {
  const readme = fs.readFileSync(readmeFile, 'utf-8')

  if (readme.indexOf(bookInfo) >= 0) return

  const newContent = readme.replace(/(?<=Reading ).+/, bookInfo)
  fs.writeFileSync(readmeFile, newContent, 'utf-8')
}

request(goodreadsProfile, (err, res, body) => {
  if (res && body) {
    const $ = cheerio.load(body)
    let bookTitle = $('#currentlyReadingReviews .bookTitle').text()
    let bookUrl = goodreadsUrl + $('#currentlyReadingReviews .bookTitle').attr('href')
    let bookAuthor = $('#currentlyReadingReviews .authorName').text()
    let bookInfo = '[' + bookTitle + '](' + bookUrl + ') by ' + bookAuthor + '.'
    
    updateReadme(bookInfo)
  }
})