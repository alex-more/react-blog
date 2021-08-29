# developer-site.react

This app is a blogging react website with a simple UI that displays blog entries from a database. It also has a secured admin panel to facilitate adding/editing blog entries.

## Tech Stack

- PostgreSQL
- Express
- React
- Node.js

Libraries and other key features:
- jsonwebtoken (authentication)
- bcrypt (encryption)
- dotenv (storing sensitive user data locally)
- axios (make requests to backend server)
- react-router-dom (for routing to the pages)

## Installation and Setup guide

Clone or download the project, then run 'npm install' in root folder.
Then, go to folder called 'client' and run 'npm install' there as well.
You may need to run 'npm install concurrently' also if you don't have it before you can run the app.

Before running this as your website, you will need to change some variables in 2 files to suit your needs. In the root folder, you need to create a file called '.env' and put variables that match your credentials there. Here is an example that explains the variables you need :

```
PORT=4000   // Your server's desired port number

// Your PostgreSQL credentials.
PGUSER=postgres
PGHOST=localhost
PGPASSWORD=your_password
PGDATABASE=your_database
PGPORT=5432

// Your admin credentials for managing the blog, you choose these.
CUSER=your_username
CPASSWORD=your_password

// Secrets used to authenticate the user on login page.
// You can basically put any password you want here, ideally generate long sequences using bcrypt.
ACCESS_TOKEN_SECRET=your_secret_token
REFRESH_TOKEN_SECRET=your_other_secret_token
```

Then, in the client/src folder, you should edit the 'config.json' file to match your github username and the port that your backend server will run on.

To use the blogging feature of this app, you will need a local PostgreSQL server with a database that matches the name of the .env variable 'PGDATABASE'. The app itself will create the tables and the user needed for the blog management on startup. You also need to make sure that 'PGUSER' and 'PGPASSWORD' match an existing user for the Postgres server.

When you have the user setup and both environment variable files setup, you are ready to run the program. To run it, simply type 'npm run dev-start' in root of project folder.

## Admin Usage

To access the admin panel for managing your blog entries, just click the 'Admin Panel' link at the bottom of any page on the footer, or add '/login' at the end of the home URL. Then log in using your credentials and it should take you to '/admin/blog' where you can manage your blog.