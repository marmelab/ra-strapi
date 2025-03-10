# Strapi Data Provider For React-Admin

This package provides a Data Provider and an Auth Provider to integrate [Strapi](https:/strapi.io/) with [react-admin](https://marmelab.com/react-admin).

## Repository Structure

This GitHub repository contains:

-   The actual `ra-strapi` package ([documentation](./packages/ra-strapi/README.md))
-   A simple demo app you can run locally to try out `ra-strapi`

It is mainly inspired by https://github.com/garridorafa/ra-strapi-v4-rest

## Simple Demo

This demo helps developers of the ra-strapi package to test their changes in a real-world scenario.

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

### Setup Strapi

Strapi should be up and running on http://localhost:1337 and should ask you to create an admin user, go for it.

You now need to tune some permissions to allow a user to access, edit and delete `Articles`, `Authors`, and `Categories`.
Change the "Authenticated" role (http://localhost:1337/admin/settings/users-permissions/roles/1) and check all the rights for those resources.

Finally, add a user and set its role to the "Authenticated" one : http://localhost:1337/admin/content-manager/collection-types/plugin::users-permissions.user/create.

### Using the Simple Demo

Then go to http://localhost:8080 to use your React-admin app, you can connect to the app with the user you previously created.

Feel free to play around with this demo, to better understand its internals.

## Improvements ideas

Here is a list of some ideas to improve this data and auth provider.

- Use [@strapi/client](https://docs.strapi.io/dev-docs/api/client) instead of using `fetch`
- Get the permissions list from the api to implement the `getPermissions` of the authProvider (don't know how to...)
- Find a way to update images.
- Use prefetch and embeddings : https://docs.strapi.io/dev-docs/api/rest/guides/understanding-populate#populate-several-levels-deep-for-specific-relations 

## License

This repository and the code it contains are licensed under the MIT License and sponsored by [marmelab](https://marmelab.com).
