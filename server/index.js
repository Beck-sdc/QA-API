const express = require('express');
const bodyParser = require('body-parser');
const query = require('./queries.js')
const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/qa/questions', (req, res) => {
  const { product_id, page, count } = req.query;
  query.getQuestions(product_id, page, count, (err, result) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      res.status(200).json(result);
    }
  });
});

app.get('/qa/questions/:question_id/answers', (req, res) => {
  const question_id = req.params.question_id;
  const { page, count } = req.query;
  query.getAnswers(question_id, page, count, (err, result) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      res.status(200).json(result);
    }
  });
});

app.post('/qa/questions', (req, res) => {
  const { body, name, email, product_id } = req.body;
  query.postQuestion(body, name, email, product_id, (err, result) => {
    if (err) {
      console.log(err);
      if (err.code === '23502') {
        res.status(400).send(`${err.column} cannot be null`)
      } else {
        res.sendStatus(500);
      }
    } else {
      res.sendStatus(201);
    }
  });
});

app.post('/qa/questions/:question_id/answers', (req, res) => {
  const question_id = req.params.question_id;
  const { body, name, email, photos } = req.body;
  query.postAnswer(body, name, email, photos, question_id, (err, result) => {
    if (err) {
      console.log(err);
      if (err.code === '23502') {
        res.status(400).send(`${err.column} cannot be null`)
      } else {
        res.sendStatus(500);
      }
    } else {
      res.sendStatus(201);
    }
  });
});

app.put('/qa/questions/:question_id/helpful', (req, res) => {
  query.markQuestionHelpful(req.params.question_id, (err) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      res.sendStatus(204);
    }
  })
});

app.put('/qa/questions/:question_id/report', (req, res) => {
  query.markQuestionReport(req.params.question_id, (err) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      res.sendStatus(204);
    }
  })
});

app.put('/qa/answers/:answer_id/helpful', (req, res) => {
  query.markAnswerHelpful(req.params.answer_id, (err) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      res.sendStatus(204);
    }
  })
});

app.put('/qa/answers/:answer_id/report', (req, res) => {
  query.markAnswerReport(req.params.answer_id, (err) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      res.sendStatus(204);
    }
  })
});

app.listen(port, () => { console.log(`App running on port ${port}.`) });