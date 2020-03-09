const express = require('express');
const morgan = require('morgan');

const app = express();


app.use(morgan('common')); // let's see what 'common' format looks like

const items = require('./playstore.js');


app.get('/apps', (req, res) => {
  const { genres = "", sort } = req.query;

  if(genres) {
    if(!['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card'].includes(genres)) {
      return res
        .status(400)
        .send('search must be one of the followings: Action, Puzzle, Strategy, Casual, Arcade, Card');
    }
  }

  if (sort) {
    if (!['App', 'Rating'].includes(sort)) {
      return res
        .status(400)
        .send('Sort must be one of app or rating');
    }
  }

  
  let results = items && items.filter(item => item.Genres.toLowerCase().includes(genres.toLowerCase()));

  if (sort) {
    results
      .sort((a, b) => {
        return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0;
    });
  }

  res.json(results);
});

module.exports = app;