const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'qa',
  password: 'password',
  port: 5432,
})

module.exports = {
  getQuestions: (product_id, page = 1, count = 5, callback) => {
    pool.query(
      `SELECT
        question_id,
        question_body,
        TO_CHAR(date(to_timestamp(question_date / 1000)), 'YYYY-MM-DD"T"HH24:MI:SS"Z"') question_date,
        asker_name,
        question_helpfulness,
        reported,
        (SELECT
          json_object_agg(
            answer_id,
            json_build_object(
              'id', answer_id,
              'body', body,
              'date', TO_CHAR(date(to_timestamp(question_date / 1000)), 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
              'answerer_name', answerer_name,
              'helpfulness', helpfulness,
              'photos', (SELECT
                COALESCE(
                  json_agg (
                    t.url
                  ), '[]'::json
                ) from (
                  SELECT answer_photos.url FROM answer_photos WHERE answer_photos.answer_id = answers.answer_id
                ) AS T
              )
            )
          ) AS answers FROM answers WHERE answers.question_id = questions.question_id AND reported = false
        )
      FROM questions WHERE product_id = $1 and reported = false LIMIT $2 OFFSET ($3 - 1) * $2`, [product_id, count, page],
      (err, results) => {
        err ? callback(err) : callback(err, { product_id, results: results.rows });
      });
  },

  getAnswers: (question_id, page = 1, count = 5, callback) => {
    pool.query(
      `SELECT
        answer_id,
        body,
        TO_CHAR(date(to_timestamp(date / 1000)), 'YYYY-MM-DD"T"HH24:MI:SS"Z"') date,
        answerer_name,
        helpfulness
      FROM answers WHERE question_id = $1 and reported = false LIMIT $2 offset ($3 - 1) * $2`,
      [question_id, count, page],
      (err, results) => {
        err ? callback(err) : callback(err,
          {
            question: question_id,
            page: page,
            count: count,
            results: results.rows
          });
      })
  },

  postQuestion: (body, name, email, product_id, callback) => {
    pool.query('INSERT INTO questions (question_body, asker_name, asker_email, product_id) VALUES ($1, $2, $3, $4)', [body, name, email, product_id],
      (err, results) => {
        err ? callback(err) : callback(err, results.rows);
      })
  },

  postAnswer: (body = '', name = '', email = '', photos = '', question_id = '', callback) => {
    pool.query('INSERT INTO answers (body, answerer_name, answerer_email, question_id) VALUES ($1, $2, $3, $4)', [body, name, email, question_id],
      (err, results) => {
        err ? callback(err) : callback(err, results.rows);
      })
  },

  markQuestionHelpful: (question_id, callback) => {
    pool.query(`update questions set question_helpfulness = question_helpfulness + 1 where question_id = ${question_id}`, callback);
  },

  markQuestionReport: (question_id, callback) => {
    pool.query(`update questions set reported = true where question_id = ${question_id}`, callback);
  },

  markAnswerHelpful: (answer_id, callback) => {
    pool.query(`update answers set helpfulness = helpfulness + 1 where answer_id = ${answer_id}`, callback);
  },

  markAnswerReport: (answer_id, callback) => {
    pool.query(`update answers set reported = true where answer_id = ${answer_id}`, callback);
  }
}

// `SELECT
//         answer_id,
//         body,
//         TO_CHAR(date(to_timestamp(date / 1000)), 'YYYY-MM-DD"T"HH24:MI:SS"Z"') date,
//         answerer_name,
//         helpfulness
//       FROM answers WHERE question_id = $1 and reported = false LIMIT $2 offset ($3 - 1) * $2`,
//       [question_id, count, page],

/*
select row_to_json(rowset,true) movies_list from (
  select
    film.film_id,
    title,
    description,
    release_year,
    language.name as language,
    rating,
    (select
      json_agg(
        row_to_json(
          cast_list.*,
          true
        )
      ) from (select
        actor.first_name,
        actor.last_name
      from film_actor join actor on actor.actor_id=film_actor.actor_id where film_actor.film_id=film.film_id
    ) cast_list
  ) as film_cast from film join language on film.language_id=language.language_id
) order by film.film_id) rowset;
*/