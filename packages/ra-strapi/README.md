# ra-appwrite

This package provides a Data Provider and an Auth Provider to integrate [Appwrite](https://appwrite.io/) with [react-admin](https://marmelab.com/react-admin).

This package supports:

- CRUD on Documents
- Authentication with email and password

## Installation

```sh
yarn add ra-appwrite
# or
npm install ra-appwrite
```

## Usage

In the [Appwrite console](https://cloud.appwrite.io/console/organization-67af6d36000169d2c8a9), in the Auth menu, create a new user by entering an email and a password.

Still in the AppWrite console, create a new project and a new database in this project. Then, create collections in the database (e.g. 'contacts', 'companies', etc). For each collection, in the "Settings" tab, add a Permission for the user that you've created.

You will need the project ID, database ID, and collection IDs to initialize your admin. And since the default react-admin login page uses a username and password, you will need to override it with a login page using email and password.

```jsx
import React from "react";
import { Client } from 'appwrite';
import {
  appWriteDataProvider,
  appWriteAuthProvider,
  LoginForm
} from 'ra-appwrite';
import {
  Admin,
  EditGuesser,
  ListGuesser,
  Resource,
  ShowGuesser,
} from "react-admin";

const client = new Client();
client
    .setEndpoint(APPWRITE_ENDPOINT) // often https://cloud.appwrite.io/v1
    .setProject(APPWRITE_PROJECTID);
const dataProvider = appWriteDataProvider({
    client,
    databaseId: APPWRITE_DATABASEID,
    collectionIds: {
        contacts: APPWRITE_COLLECTIONID_CONTACTS,
        companies: APPWRITE_COLLECTIONID_COMPANIES,
    },
});
const authProvider = appWriteAuthProvider(client);
// custom login page with email and password instead of username and password
const LoginPage = () => (
    <Login>
         <LoginForm />
    </Login>
);

const App = () => (
    <Admin
        dataProvider={dataProvider}
        authProvider={authProvider}
        loginPage={LoginPage}
    >
        {/* the resource names must match the collection IDs */}
        <Resource name="contacts" list={ListGuesser} edit={EditGuesser} />
        <Resource name="companies" list={ListGuesser} edit={EditGuesser} />
  </Admin>
);

export default App;
```

## License

MIT
