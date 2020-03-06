const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(morgan('dev'));


app.get('/', (req, res) => {
  res.send('Hello Express!');
});

app.listen(8000, () => {
  console.log('Express server is listening on port 8000!');
});

app.get('/burgers', (req, res) => {
  res.send('We have juicy cheese burgers!');
});

app.get('/pizza/pepperoni', (req, res) => {
  res.send('Your pizza is on the way!');
});

app.get('/pizza/pineapple', (req, res) => {
  res.send('We don\'t serve that here. Never call again!');
});

app.get('/echo', (req, res) => {
  const responseText = `Here are details of your request:
    Base URL: ${req.baseUrl}
    Host: ${req.hostname}
    Path: ${req.path}
  `;
  res.send(responseText);
});

app.get('/queryViewer', (req, res) => {
  console.log(req.query);
  res.end(); //do not send any data back to the client
});

app.get('/greetings', (req, res) => {
  //1. get values from the request
  const name = req.query.name;
  const race = req.query.race;

  //2. validate the values
  if(!name) {
    //3. name was not provided
    return res.status(400).send('Please provide a name');
  }

  if(!race) {
    //3. race was not provided
    return res.status(400).send('Please provide a race');
  }

  //4. and 5. both name and race are valid so do the processing.
  const greeting = `Greetings ${name} the ${race}, welcome to our kingdom.`;

  //6. send the response 
  res.send(greeting);
});

// Sum of a and b
app.get('/sum', (req, res) => {
  const { a, b } = req.query;

  const numA = parseInt(a, 10);
  const numB = parseInt(b, 10);

  if(!numA) {
    return a.status(400).send('Please provide a number');
  }

  if(!numB) {
    return b.status(400).send('Please provide a number');
  }

  const sum = numA + numB;
  const result = `The sum of ${numA} and ${numB} is ${sum}.`

  res.status(200).send(result);
})

// String cipher encryption
app.get('/cipher', (req, res) => {
  const { text, shift } = req.query;

  if(!text) {
    return res.status(400)
              .send('text is required');
  }

  if(!shift) {
    return res.status(400)
              .send('shift is required');
  }

  const numShift = parseInt(shift, 10);

  if(Number.isNaN(numShift)) {
    return res.status(400)
              .send('shift must be a number');
  }

  const base = 'A'.charCodeAt(0); //get char code

  const cipher = text
    .toUpperCase()
    .split('') // create an array of characters
    .map(char => { // map each original char to a converted char
      const code = char.charCodeAt(0); // get the char code

      // if it is not one of the 26 letters ignore it
      if(code < base || code > (base + 26)) {
        return char;
      }

      // otherwise conver it
      // get the distance from A
      let diff = code - base;
      diff = diff + numShift;
      
      // in case shift takes the value past Z, cycle back to the beginning
      diff = diff % 26;

      // convert back to a character
      const shiftedChar = String.fromCharCode(base + diff);
      return shiftedChar;
    })
    .join(''); // construct a String from the array
  
  // Return the response
  res
    .status(200)
    .send(cipher);

});

// Drill 3
app.get('/lotto', (req, res) => {
  const { numbers } = req.query;

  // validation: 
  // 1. the numbers array must exist
  // 2. must be an array
  // 3. must be 6 numbers
  // 4. numbers must be between 1 and 20

  if(!numbers) {
    return res.status(400).send('number is required');
  }
  if(!Array.isArray(numbers)) {
    return res.status(400).send('number must be an array');
  }

  const guesses = numbers
        .map(n => parseInt(n))
        .filter(n => !Number.isNaN(n) && (n >= 1 && n <= 20));
  
  if(guesses.length !=6) {
    return res.status(400).send('numbers must contain 6 integers between 1 and 20');
  }

  const stockNumbers = Array(20).fill(1).map((_, i) => i + 1);

  const winningNumbers = [];
  for(let i = 0; i < 6; i++) {
    const ran = Math.floor(Math.random() * stockNumbers.length);
    winningNumbers.push(stockNumbers[ran]);
    stockNumbers.splice(ran,1);
  }

  let diff = winningNumbers.filter(n => !guesses.includes(n));

  let responseText;

  switch(diff.length){
    case 0: 
      responseText = 'Wow! Unbelievable! You could have won the mega millions!';
      break;
    case 1:   
      responseText = 'Congratulations! You win $100!';
      break;
    case 2:
      responseText = 'Congratulations, you win a free ticket!';
      break;
    default:
      responseText = 'Sorry, you lose';  
  }

  res.send(responseText);
  
});


// Checkpoint 4
// app.get('/hello', (req, res) => {
//   res.status(200);
//   res.send('Hello, everything was ok!');
// });

// app.get('/hello', (req, res) => {
//   res.status(200).send('Hello, everything was ok!');
// });

// app.get('/hello', (req, res) => {
//   res
//     .status(500)
//     .send('Oops! I did it again.');
// });

// app.get('/hello', (req, res) => {
//   res
//     .status(204)
//     .send('Here is some information');
// });

// app.get('/hello', (req, res) => {
//   res
//     .status(204);
// });

// app.get('/hello', (req, res) => {
//   res
//     .status(204)
//     .end();
// });

// app.get('/video', (req, res) => {
//   const video = {
//     title: 'Cats falling over',
//     description: '15 minutes of hilarious fun as cats fall over',
//     length: '15.40'
//   }
//   res.json(video);
// });

// app.get('/colors', (req, res) => {
//   const colors = [
//     {
//       name: "red",
//       rgb: "FF0000"
//     },
//     {
//       name: "green",
//       rgb: "00FF00"
//     },
//     {
//       name: "blue",
//       rgb: "0000FF"
//     },
//   ];
//   res.json(colors);
// });

// app.get('/grade', (req, res) => {
//   // get the mark from the query
//   const { mark } = req.query;

//   // do some validation
//   if (!mark) {
//     // mark is required
//     return res
//       .status(400)
//       .send('Please provide a mark');
//   }

//   const numericMark = parseFloat(mark);
//   if (Number.isNaN(numericMark)) {
//     // mark must be a number
//     return res
//       .status(400)
//       .send('Mark must be a numeric value');
//   }

//   if (numericMark < 0 || numericMark > 100) {
//     // mark must be in range 0 to 100
//     return res
//       .status(400)
//       .send('Mark must be in range 0 to 100');
//   }

//   if (numericMark >= 90) {
//     return res.send('A');
//   }

//   if (numericMark >= 80) {
//     return res.send('B');
//   }

//   if (numericMark >= 70) {
//     return res.send('C');
//   }

//   res.send('F');
// });

