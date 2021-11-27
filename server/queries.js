const Pool = require('pg').Pool
const pool = new Pool({
  user: 'me',
  host: 'localhost',
  database: 'qa',
  password: 'password',
  port: 5432,
})

module.exports = {
  getQuestions: (product_id, page = 1, count = 5, callback) => {
    pool.query(`SELECT question_id, question_body, TO_CHAR(date(to_timestamp(question_date / 1000)), 'YYYY-MM-DD"T"HH24:MI:SS"Z"') question_date, asker_name, question_helpfulness, reported FROM questions WHERE product_id = ${product_id} and reported = false LIMIT ${count} OFFSET ${(page - 1) * count}`,
      (err, results) => {
        callback(err,
          {
            product_id,
            results: results.rows
          }
        )
      });
  },

  getAnswers: (question_id, page = 1, count = 5, callback) => {
    pool.query(`select answer_id, body, TO_CHAR(date(to_timestamp(date / 1000)), 'YYYY-MM-DD"T"HH24:MI:SS"Z"') date, answerer_name, helpfulness FROM answers WHERE question_id = ${question_id} and reported = false LIMIT ${count} offset ${(page - 1) * count}`,
    (err, results) => {
      callback(err, results.rows);
    })
  },

  addQuestion: (body, name, email, product_id, callback) => {
    pool.query(`INSERT INTO questions (question_body, asker_name, asker_email, product_id) VALUES ('${body}', '${name}', '${email}', ${product_id})`,
    (err, results) => {
      callback(err, results.rows);
    })
  }
}