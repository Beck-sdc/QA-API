const express = require('express');
const bodyParser = require('body-parser');
const query = require('./queries.js')
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/questions', (req, res) => {
  query.getQuestions(req.query.product_id, req.query.page, req.query.count, (err, result) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      res.status(200).json(result);
    }
  });
});

app.get('/questions/:question_id/answers', (req, res) => {
  query.getAnswers(req.params.question_id, req.query.page, req.query.count, (err, result) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      res.status(200).json(result);
    }
  });
})

app.listen(port, () => { console.log(`App running on port ${port}.`) })