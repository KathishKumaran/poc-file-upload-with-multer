# File Upload With Multer

This has the javascript code which uses nestjs framework to serve frontend application.

### Node Version

> Use Node.js version 20.10.0

### Initial setup

```
 $ git clone https://github.com/KathishKumaran/poc-file-upload-with-multer.git

 $ cd poc-file-upload-with-multer

 $ npm install
```

#### Create .env file

> \$ touch .env

##### Set PORT for the application

> PORT=**PORT**

##### Set EMAIL to send email

> FROM_EMAIL=**Email**

##### Set JWT_SECRET_KEY for token generation

> JWT_SECRET_KEY=**JWT secret key**

##### Set DATABASE_URL for Database connection

- DATABASE_URL format (postgres://{username}:{password}@{hostname}:{port}/{database-name})

> DATABASE_URL=**Database URL**

##### Set NODE_ENV to production to run the application in production mode

> NODE_ENV=production

##### Set timezone

> TZ=**TIMEZONE**

### Install prisma cli to run migration and seed

> \$ npm install --save-dev prisma

### Generate prisma cilent

> \$ npx prisma init

### Run migration

> \$ npx prisma migrate dev

### Run seed

> \$ npx prisma db seed

### Run

> \$ npm run start:dev

### Build

> \$ npm run build

### Run in production mode

> \$ node dist/index.js
