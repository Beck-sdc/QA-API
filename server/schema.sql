CREATE TABLE "questions" (
  "id" serial PRIMARY KEY,
  "product_id" int NOT NULL,
  "body" varchar(1000) NOT NULL,
  "date_written" bigint,
  "asker_name" varchar(60) NOT NULL,
  "email" varchar NOT NULL,
  "reported" boolean DEFAULT false,
  "helpful" int DEFAULT 0
);

CREATE TABLE "answers" (
  "id" serial PRIMARY KEY,
  "question_id" int NOT NULL,
  "body" varchar(1000) NOT NULL,
  "date_written" bigint,
  "answerer_name" varchar(60) NOT NULL,
  "answerer_email" varchar NOT NULL,
  "reported" boolean DEFAULT false,
  "helpful" int DEFAULT 0
);

CREATE TABLE "answer_photos" (
  "id" serial PRIMARY KEY,
  "answer_id" int NOT NULL,
  "url" varchar NOT NULL
);

ALTER TABLE "answers" ADD FOREIGN KEY ("question_id") REFERENCES "questions" ("id");

ALTER TABLE "answer_photos" ADD FOREIGN KEY ("answer_id") REFERENCES "answers" ("id");

-- select to_char(date(to_timestamp(1595884714409 / 1000)), 'YYYY-MM-DD"T"HH24:MI:SS"Z"');