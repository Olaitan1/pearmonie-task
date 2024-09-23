Clone project on:
https://github.com/Olaitan1/pearmonie-task.git

 # Navigate into the project directory:
cd pearmonie


Install dependencies;
# RUN
yarn 
   or
   npm install


Create  .env file with the following items:

DB_CONNECTION_STRING = postgres://username:password@ep-noisy-water-85876.us-east-2.aws.neon.tech/db_name
appSecret= "your_app_secret"
FromAdminMail='your_email
userSubject='Welcome to PearMonie'
GMAIL_USER='your_email'
GMAIL_PASS='your_email_passkey'
BASE_URL='your_hosted_link'
API_URL=https://v6.exchangerate-api.com/v6
API_KEY='your_exchange_rate_api_key'



DATABASE SETUP

# Run db Migration
yarn sequelize db:migrate
or
npx sequelize db:migrate

SEED DATABASE
# To seed database (optional)
yarn sequelize db:seed:all


RUNNING THE APP
# RUN
yarn dev 
or npm run dev

# DOCKER
run: 
docker-compose up --build


RUNNING PROJECT TEST
# RUN
yarn test
or
npm run test
