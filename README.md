# witches

> My groundbreaking Nuxt.js project

## Build Setup

``` bash
# install dependencies
$ npm run install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).
# nuxt-witches

# UOE steps to push to production

1. Generate a static version of the site using: npm run generate

2. Test that the site works locally: npm run start

2. FTP the contents of the dist folder in the project root to the servers document root (e.g. public_html)