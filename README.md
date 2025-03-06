# ra-strapi


## Content

This repository contains:

-   The actual `ra-strapi` package
-   A simple demo app you can run locally to try out `ra-strapi`

It is mainly inspired by https://github.com/garridorafa/ra-strapi-v4-rest

## Simple Demo

### Prerequesites

This demo requires:

- node >= 18
- yarn

### Initial setup

First, clone this project.

```sh
git clone https://github.com/marmelab/ra-strapi.git
cd ra-strapi
```

### Running The Demo App

Install the dependencies and start the Demo App with the following command:

```sh
make install start
```

### Using the Simple Demo

Now that all is configured and running, you can browse to http://localhost:1337 to create a strapi user, and to publish some data.

Then go to http://localhost:8080 to use your React-admin app.

Feel free to play around with this demo, to better understand its internals.

## Improvements ideas

Here is a list of some ideas to improve this data and auth provider.

- Use [@strapi/client](https://docs.strapi.io/dev-docs/api/client) instead of using `fetch`
- Get the permissions list from the api to implement the `getPermissions` of the authProvider (don't know how to...)
- Find a way to update images.

## License

This repository and the code it contains are licensed under the MIT License and sponsored by [marmelab](https://marmelab.com).
