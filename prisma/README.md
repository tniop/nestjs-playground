## Description

- Nest.js - Prisma practice
- please install Node.js, Mysql before start project

## Installation

```bash
$ npm install
```

## Make .env

```Text
DATABASE_URL=mysql://{id}:{pw}@localhost/{database_name}
```

## Prisma set up

```bash
$ npx prisma
$ npx prisma migrate dev
$ npx prisma generate
```

## Running the app

```bash
$ npm run start
```

## Test

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

## License

Nest is [MIT licensed](LICENSE).
