# Witches

Witches is a website from the University of Edinburgh that uses data from the 
[Survey of Scottish Witchcraft](http://www.shca.ed.ac.uk/Research/witches) to provide various maps about witches, their 
trials, and associated persons.

## Backend and running the site locally
The witches project now includes a PHP backend, which can be found at:  [https://github.com/uoe-dlam/witches-php](https://github.com/uoe-dlam/witches-php)

To test locally, you should clone the backend:

```
git clone git@github.com:uoe-dlam/witches-php.git
```

And you can start the backend server by running the following command (You should run it on port 8181):

```
cd <install-directory>/witches-php
```
```
composer install (you only need to do this once)
```
```
php -S localhost:8181
```

And then test that everything is working run this project:
```
npm i (you only need to do this once)
```
```
npm run dev
```
## Support

For technical support, please email ltw-apps-dev@ed.ac.uk. For questions or comments regarding the content of this site,
please email ewan.mcandrew@ed.ac.uk

## Contributing

We would welcome pull requests to this site. If you have an improvement idea and would like to contribute to this site, 
please email use or open a pull request and we will aim to review it as quickly as possible.

## Authors and Acknowledgements

Geographical data located and ArcGIS Online maps produced by Emma Carroll.

Wikidata upload from the Survey of Scottish Witchcraft by Emma Carroll and Ewan McAndrew.

Website and Leaflet map produced by Richard Lawson

Further place-name advice provided by – the Scottish Place-Name Society, Louise Yeoman, Julian Goodare, Simon Taylor, Bruce Gittings, Chris Fleet, Gilbert Márkus and Dòmhnall Uilleam Stiùbhart.

Wikimedia support – Ewan McAndrew, Navino Evans, Martin Poulter and Simon Cobb.

Map icons designed by Stewart Cromar

Query Service linked map produced by Martin Poulter

Isobel Young story map produced by Ewan McAndrew

## License

Code licensed under the [MIT license](https://mit-license.org/)
The map icons are licensed under the [CC BY 4.0 license](https://creativecommons.org/licenses/by/4.0/)

## Project Status

This project is actively maintained by the University of Edinburgh's Digital Learning Applications and Media Team.

## Deploying the site
This site is built using the [Nuxt.js](https://nuxtjs.org) framework. If you would like to get this site ready to deploy, 
simply run the following commands in the project's root directory. Please note, you must have node
and node package manager installed locally to issue these commands:

```
npm i
npm run generate
npm run start
```

The commands will:

- Install all required node packages
- Generate the static web files used to serve the site
- npm run start will show you what the site looks like when in production mode

 You should deploy the content of the dist folder to your server's root directory. 
 You should also push the content of the witches-php project to the root directory too.
 This includes the vendor folder and main.php