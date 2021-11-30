# SDC_QA_API
This is the api implementation for the fec question and answer section

Initialize postgres
Create qa database within postgres
create username me in postgres with password password
assign me to qa

once in qa database ensure that your csv data files are within the Raw Data directory
Find the path to the schema.sql file and run \i \path\TO\schema.sql

After the schema has been loaded and the database is up and running use npm install and npm start to start the database routing