# DiyTutorials

[![Build Status](https://travis-ci.com/gsuveti/diy-tutorials.svg?branch=master)](https://travis-ci.com/gsuveti/diy-tutorials)

This repo contains:
- wordpress gutenberg blocks to create a diy tutorial
- a frontend application
- a wordpress plugin to install the blocks and the app.


### diy-tutorials-backend
Wordpress gutenberg blocks that render the tutorial components. The components props are stored in data attributes.

### diy-tutorials-frontend
React application that makes the tutorial section dynamic after the wordpress page is loaded.


## Development

#### Do not use lodash!
Adding lodash in the plugin will break the gutenberg image block. 

## Deployment

https://travis-ci.com/gsuveti/diy-tutorials/
