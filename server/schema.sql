DROP TABLE IF EXISTS "answer_photos";
CREATE TABLE "answer_photos" (
  "id" serial PRIMARY KEY,
  "answer_id" int NOT NULL,
  "url" varchar NOT NULL
);

DROP TABLE IF EXISTS "answers";
CREATE TABLE "answers" (
  "id" serial PRIMARY KEY,
  "question_id" int NOT NULL,
  "body" varchar(1000) NOT NULL,
  "date_written" bigint NOT NULL,
  "answerer_name" varchar(60) NOT NULL,
  "answerer_email" varchar,
  "reported" boolean DEFAULT false,
  "helpful" int DEFAULT 0
);

DROP TABLE IF EXISTS "questions";
CREATE TABLE "questions" (
  "id" serial PRIMARY KEY,
  "product_id" int NOT NULL,
  "body" varchar(1000) NOT NULL,
  "date_written" bigint NOT NULL,
  "asker_name" varchar(60) NOT NULL,
  "email" varchar NOT NULL,
  "reported" boolean NOT NULL DEFAULT false,
  "helpful" int NOT NULL DEFAULT 0
);

COPY "questions" FROM '/home/edwin/hackreactor/assignments/SDC/QA-API/Raw Data/questions.csv' WITH delimiter ',' NULL AS 'null' csv header;
COPY "answers" FROM '/home/edwin/hackreactor/assignments/SDC/QA-API/Raw Data/answers.csv' WITH delimiter ',' NULL AS 'null' csv header;
COPY "answer_photos" FROM '/home/edwin/hackreactor/assignments/SDC/QA-API/Raw Data/answers_photos.csv' WITH delimiter ',' NULL AS 'null' csv header;

SELECT setval('questions_id_seq', (SELECT MAX("id") from "questions"));
SELECT setval('answers_id_seq', (SELECT MAX("id") from "answers"));
SELECT setval('answer_photos_id_seq', (SELECT MAX("id") from "answer_photos"));

ALTER TABLE "answers" ALTER COLUMN "date_written" TYPE DATE USING TO_TIMESTAMP("date_written" / 1000);
ALTER TABLE "questions" ALTER COLUMN "date_written" TYPE DATE USING TO_TIMESTAMP("date_written" / 1000);
ALTER TABLE "answers" ALTER COLUMN "date_written" SET DEFAULT NOW()::TIMESTAMP;
ALTER TABLE "questions" ALTER COLUMN "date_written" SET DEFAULT NOW()::TIMESTAMP;

ALTER TABLE "questions" RENAME COLUMN "id" TO "question_id";
ALTER TABLE "questions" RENAME COLUMN "body" TO "question_body";
ALTER TABLE "questions" RENAME COLUMN "date_written" TO "question_date";
ALTER TABLE "questions" RENAME COLUMN "email" TO "asker_email";
ALTER TABLE "questions" RENAME COLUMN "helpful" TO "question_helpfulness";

ALTER TABLE "answers" RENAME COLUMN "id" TO "answer_id";
ALTER TABLE "answers" RENAME COLUMN "date_written" TO "date";
ALTER TABLE "answers" RENAME COLUMN "helpful" TO "helpfulness";

ALTER TABLE "answers" ADD FOREIGN KEY ("question_id") REFERENCES "questions" ("question_id");
ALTER TABLE "answer_photos" ADD FOREIGN KEY ("answer_id") REFERENCES "answers" ("answer_id");

CREATE INDEX ON "questions" ("product_id", "question_helpfulness" desc) WHERE "reported" = false;
CREATE INDEX ON "answers" ("question_id", "helpfulness" desc) WHERE "reported" = false;
CREATE INDEX ON "answer_photos" ("answer_id");

-- select to_char(date(to_timestamp(1595884714409 / 1000)), 'YYYY-MM-DD"T"HH24:MI:SS"Z"');
-- DEFAULT (extract(epoch from now()) * 1000)