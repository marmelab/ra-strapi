# ra-strapi

This package provides a Data Provider and an Auth Provider to integrate [Strapi](https://strapi.io/) with [react-admin](https://marmelab.com/react-admin).

This package supports:

- CRUD on Documents
- Authentication with email and password

## Installation

```sh
yarn add ra-strapi
# or
npm install ra-strapi
```

## Usage

### Using the public API

Create a new dataprovider giving the baseURL of your Strapi instance, pass the dataprovider to the `Admin` component.

```tsx
import { strapiDataProvider } from "ra-strapi";
import { Admin, ListGuesser, Resource } from "react-admin";
import { Layout } from "./Layout";

const dataProvider = strapiDataProvider({ baseURL: "http://localhost:1337" });

export const App = () => (
  <Admin layout={Layout} dataProvider={dataProvider}>
    <Resource name="articles" list={ListGuesser} />
  </Admin>
);
```

**note:** you may need to tune the permissions of the public role ( [see Strapi doc](https://docs.strapi.io/user-docs/users-roles-permissions/configuring-end-users-roles) ).

### Using the authenticated API

Create an authProvider giving the baseURL of your Strapi instance, it will handle for you the jwt token.
Create an httpClient with `strapiHttpClient`, it will handle the authorization headers for you.
Create a dataProvider giving the baseURL of your Stapi instance, and the httpClient you created.
Pass those dataProvider and authProvider to you `Admin` component.
As you will need to authenticate with email/password, pass the react-admin `LoginWithEmail` to the `loginPage` prop, or a custom login page.

```tsx
import {
  strapiDataProvider,
  strapiAuthProvider,
  strapiHttpClient,
} from "ra-strapi";
import { Admin, ListGuesser, LoginWithEmail, Resource } from "react-admin";
import { Layout } from "./Layout";

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;
const authProvider = strapiAuthProvider({ baseURL: STRAPI_URL });
const httpClient = strapiHttpClient();
const dataProvider = strapiDataProvider({ baseURL: STRAPI_URL, httpClient });
export const App = () => (
  <Admin
    layout={Layout}
    dataProvider={dataProvider}
    authProvider={authProvider}
    loginPage={LoginWithEmail}
  >
    <Resource name="articles" list={ListGuesser} />
  </Admin>
);
```

### Using an API key

Create an httpClient with `strapiHttpClient`, specifying the authType to `apiKey` and the key.
Create a dataProvider giving the baseURL of your Stapi instance, and the httpClient you created.

```tsx
import { strapiDataProvider, strapiHttpClient } from "ra-strapi";
import { Admin, ListGuesser, LoginWithEmail, Resource } from "react-admin";
import { Layout } from "./Layout";

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;
const STRAPI_API_KEY = import.meta.env.VITE_STRAPI_API_KEY;
const httpClient = strapiHttpClient({ authType: "apiKey", apiKey:  STRAPI_API_KEY});
const dataProvider = strapiDataProvider({ baseURL: STRAPI_URL, httpClient });
export const App = () => (
  <Admin layout={Layout} dataProvider={dataProvider} loginPage={LoginWithEmail}>
    <Resource name="articles" list={ListGuesser} />
  </Admin>
);
```
**note:** you may need to create an api key in the Strapi admin panel ( [see Strapi doc](https://docs.strapi.io/user-docs/settings/API-tokens) ).


### Filtering

To learn how filter works with react-admin refer to the documentation [here](https://marmelab.com/react-admin/FilteringTutorial.html).
The availables filters operators are :
| Operator   | Description                  |
| ---------- | ---------------------------- |
| eq         | equal                        |
| eqi        | equal (case insensitive)     |
| ne         | not equal                    |
| nei        | not equal (case insensitive) |
| gt         | greater than                 |
| gte        | greater than or equal        |
| lt         | less than                    |
| lte        | less than or equal           |
| contains   | contains                     |
| ncontains  | not contains                 |
| containsi  | contains (case insensitive)  |
| ncontainsi | not contains (case insensitive) |
| between    | between two values           |
| in         | in an array                  |
| nin        | not in an array              |
| isnull     | is null                      |
| isnotnull  | is not null                  |
| startswith | starts with                  |
| startswithi| starts with (case insensitive) |
| endswith   | ends with                    |
| endswithi  | ends with (case insensitive) |

```tsx
import {
  Datagrid,
  ImageField,
  List,
  ReferenceField,
  TextField,
  TextInput
} from "react-admin";

const articleFilters = [
  <TextInput source="title_contains" label="Title"/> // will filter articles with title containing the value
]

export const ArticleList = () => (
  <List filters={articleFilters}>
    <Datagrid>
      <ImageField source="cover.formats.thumbnail.url" label="Cover" />
      <TextField source="title" />
      <TextField source="description" />
      <ReferenceField reference="authors" source="author" link="show" />
      <ReferenceField reference="categories" source="category" link="show" />
    </Datagrid>
  </List>
);
```

## License

MIT
