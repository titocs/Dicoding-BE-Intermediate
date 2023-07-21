## How to install and Run:
Pre-requisite:

 - Redis Server
 - RabbitMQ
 - Text editor (VSCode, Sublime, etc)
 - [Message Broker](https://github.com/titocs/Message-Broker-OpenMusicAPI)

**1.** Create database in PostgreSQL,
**2.** Create ***.env*** file in your project to store configuration,
**3.** Setup configuration in your ***.env*** file like this:


> HOST = localhost,
> PORT = 8000,
> PGUSER = (your postgres username),
> PGHOST = localhost,
> PGPASSWORD = (your db password),
> PGDATABASE = (your db name),
> RABBITMQ_SERVER=amqp://localhost,
> REDIS_SERVER=localhost

**4.** Generate random string using REPL Node

    require('crypto').randomBytes(64).toString('hex');
    
**5.** Store that random key to .env file named "ACCESS_TOKEN_KEY"

> ACCESS_TOKEN_KEY = (random string key)

**6.** Create random string again and store to "REFRESH_TOKEN_KEY"
**7.** Store limit time token (in second):

> ACCESS_TOKEN_AGE = 1800

**8.** Install all dependencies

    npm install
**9.** Start Redis Server & RabbitMQ
**10.** Run project

    npm run start-dev
    
