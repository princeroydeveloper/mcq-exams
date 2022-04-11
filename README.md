
# MCQ Exams

An app for teachers to conduct online mcq exams (with unlimited questions, time boundation as per teacher's wish) for students.


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`MONGO_URI  // Mongo connection url`

`JWT_SECRET // Your json_web_token secret key`

`JWT_EXPIRATION_TIME // Your issued token expiration time`

`SENDGRID_API_KEY // send_grid api key to send mails for forgot password request`

`APP_NAME // Your app name to be sent in emails`


## Run Locally

Clone the project

```bash
  git clone https://github.com/princeroydeveloper/mcq-exams.git
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies for client & server

```bash
  cd client
  npm install
  cd ../server
  npm install
```

To start the development server, run this command for both client (next.js) & server (express.js)

```bash
  npm run dev
```


## Live Demo

https://mcq-exams.vercel.app


## 🚀 My Other Apps
I have many more apps. Do try once at: https://prince.bengalroys.com

