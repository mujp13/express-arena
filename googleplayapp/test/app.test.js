const supertest = require('supertest');
const app = require('../app');
const { expect } = require('chai');


describe('GET /apps', () => {
  it('should return an array of app items', () => {
    return supertest(app)
      .get('/apps')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.lengthOf.at.least(1);
        const item = res.body[0];
        expect(item).to.include.all.keys(
          'App', 'Rating', 'Genres'
        );
    });
  });

  it('should be 400 if sort is incorrect', () => {
    return supertest(app)
      .get('/apps')
      .query({ sort: 'MISTAKE' })
      .expect(400, 'Sort must be one of app or rating');
  });

  it('should sort by title', () => {
    return supertest(app)
      .get('/apps')
      .query({ sort: 'App' })
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array');
        let sorted = true;

        let i = 0;
        // iterate once less than the length of the array
        // because we're comparing 2 items in the array at a time
        while (i < res.body.length - 1) {
          // compare book at `i` with next book at `i + 1`
          const bookAtI = res.body[i];
          const bookAtIPlus1 = res.body[i + 1];
          // if the next book is less than the book at i,
          if (bookAtIPlus1.App < bookAtI.App) {
            // the books were not sorted correctly
            sorted = false;
            break; // exit the loop
          }
          i++;
        }
        expect(sorted).to.be.true;
      });
  });
});