# demo-app

## Prerequisites

* [Node.js](https://nodejs.org/en/download) - JavaScript runtime built on Chrome's V8 JavaScript engine.
* [Yarn](https://classic.yarnpkg.com/en/docs/install) -  A package manager that doubles down as project manager.

```json
"engines": {
    "node": ">= 14.x.x",
    "yarn": ">= 1.22.x"
}
```

## Core libraries

* [Vue](https://vuejs.org/v2/guide/) - core
  * [Vuex](https://vuex.vuejs.org/en/) - states
  * [VeeValidate](http://vee-validate.logaretm.com) - validation
  * [Bootstrap Vue](https://bootstrap-vue.js.org/) - style
* [Vue CLI](https://cli.vuejs.org//) / [Webpack](https://webpack.js.org/) - build tool

## Project setup
```bash
# install dependencies
yarn

# serve with hot reload against mode="development" environment
yarn serve

# serve with hot reload against mode="development" environment
yarn dev

# serve with hot reload against mode="uat" environment
yarn uat

# build with minification
yarn build

# build with minification for prodacton
yarn build --mode production

# lint and fix all eslint warnings
yarn lint
```
## Overriding Existing settings of .env.[mode] files

```bash
.env.[mode]         # only loaded in specified mode
.env.[mode].local   # only loaded in specified mode & overrides env vars of existing file, ignored by git
```

## Example of running on development environment
modify env.development file with your backend URL's
```bash
VUE_APP_API_HOST=https://api.example.com
VUE_APP_SUBSCRIPTION_UPDATE_API=https://subscription.example.com
```


To run application use
```bash
yarn dev
```

Application will run mainly on
```bash
http://localhost:8080/
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
