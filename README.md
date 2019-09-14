# Timotillydo-NC-NEWS

A RESTful API, with PSQL database, built for an online news outlet: Northcoders-News. 

The entire API has been built with Test-Driven Development practices.

## Table Of Contents

* [Hosted Version](#Hosted-Version)
* [Prerequisites](#Prerequisites)
  * [Dependencies & Minimum Versions](#Dependencies-&-Minimum-Versions)
* [Getting Started](#Getting-Started)
  * [Setting Up The API Locally](#Setting-Up-The-API-Locally)
  * [Installing Dependencies](#Installing-Dependencies)
  * [Installing PSQL](#Installing-PSQL)

Setting Up A Local Knex File

## Hosted Version

To visit the hosted version please follow [this link.](https://timotillydo-nc-news.herokuapp.com/api) 

_For all endpoints see [Endpoints](#Endpoints) below in this README_

## Prerequisties

This project has been built on [Ubuntu](https://ubuntu.com) (18.04.3 LTS) but is not a mandatory operating system.

### Dependencies & Minimum Versions

**Dependencies:**
  * [Express:](https://expressjs.com/) 4.17.1
  * [Knex:](https://knexjs.org/) 0.19.2
  * [Node-postgres:](https://www.npmjs.com/package/pg) 7.12.1

**Developer Dependencies:**

* [Chai:](https://www.chaijs.com/) 4.2.0
* [Chai-sorted:](https://www.chaijs.com/plugins/chai-sorted/) 0.2.0
* [Mocha:](https://mochajs.org/) 6.2.0
* [Nodemon:](https://www.npmjs.com/package/nodemon) 1.19.1
* [Supertest:](https://www.npmjs.com/package/supertest) 4.0.2

## Getting Started

### Cloning The Repository

_See 'Deployment' for notes on how to deploy the project on a live system._

Firstly, copy this repo to your local machine: 

 Either: 

* Copy the url from the 'Clone or download' button usually on the right hand side of the screen above this README.

* Then, create (or change to) a directory that you wish the repository to be located.

* Then, in your terminal, use the command:

```js
git clone https://github.com/timotillydo/be-nc-news.git
```
* Press Enter to download to your local machine.

Or:

2) Download the .zip file to you local machine and extract the contents into a directory of you choosing.

For further information on cloning a repository visit:

* [Github - Cloning A Repository](https://help.github.com/en/articles/cloning-a-repository)

### Installing Dependencies

All dependencies can be installed from the working directory where you have cloned the repository. 

* Running the following command in your terminal will install all dependencies listed within package.json: 

```
npm install
```
_Check [Dependencies](#Dependencies-&-Minimum-Versions) for versions of packages installed_

### Installing PSQL

For Ubuntu: 

* Run these commands in your terminal:

```
sudo apt-get update

sudo apt-get install postgresql postgresql-contrib
```

* Then run the following commands to create a database user for Postgres: 

```
sudo -u postgres createuser --superuser $USER

sudo -u postgres createdb $USER
```

* To enter the terminal application run this in your terminal:
```
psql
```
* You can connect to the two 

## Setting Up The API Locally

* Then you should set your password from within pqsl. Make sure to wrap you password in 'quotation marks':
```
ALTER USER <your Ubuntu username here> WITH PASSWORD <type a password here>;
```

### Writing A Local Knex File

In order to run different environments you will require a **knexfile.js** to be stored in the root directory of the repository. 

**This file should be added to the .gitignore to keep you credentials private.**

* Your knexfile.js should have the following - don't forget to pass in you username and password:

```
const { DB_URL } = process.env;
const ENV = process.env.NODE_ENV || "development";

const baseConfig = {
  client: "pg",
  migrations: {
    directory: "./db/migrations"
  },
  seeds: {
    directory: "./db/seeds"
  }
};

const customConfig = {
  production: {
    connection: `${DB_URL}?ssl=true`
  },
  development: {
    connection: {
      database: "nc_news",
      username: <enter you psql username here>,
      password: <enter you psql password here>
    }
  },
  test: {
    connection: {
      database: "nc_news_test",
      username: <enter you psql username here>,
      password: <enter you psql password here>
    }
  }
};

module.exports = { ...customConfig[ENV], ...baseConfig };

```

### Seeding A Local Database

* To create your database locally in the psql application you will need to run the following command:

```
npm run setup-dbs
```

* To then seed you tables with test data you will then need to run:

```
npm run seed-test
```

* To seed with developer data: 

``` 
npm run seed-dev 
```

## Testing

### Testing Endpoints

* To test all the endpoints for the API you can run the following command in the terminal: 

```
npm test
```

* To test the utility functions, you can run:

```
npm run test-utils
```

### Testing the API with Insomnia

If you want to debug the API manually you could use software like Insomnia. You can install Insomnia from [this link.](https://insomnia.rest)

* To run the API locally for debuggging with Insomnia, run the following command in your terminal: 

```
npm run listen
```

This script will run [Nodemon](https://www.npmjs.com/package/nodemon) and allow you to send requests without having to manually restart the server every time you want to send a request.


## Endpoints

[This is a list of all the available endpoints](/Endpoints.md)  built for this API with the relevant request method and a brief explaination of any querys included.

## Hosting

[Go here](/Hosting.md) for hosting this API.

## Authors

* **Tim Doran** - [Timotillydo](https://github.com/timotillydo)

See also the list of [contributors](https://github.com/timotillydo/be-nc-news/graphs/contributors) who participated in this project.

<!-- ## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details -->

## Acknowledgments

Built whilst studying at [Northcoders Manchester](https://northcoders.com). 
* The brief for the project and endpoint design was given by Northcoders.
* The data provided for seeding the database was also provided by Northcoders.
* And the theme centers around NC-News, an online news outlet for Northcoders.