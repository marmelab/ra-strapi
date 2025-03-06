import { strapiDataProvider, strapiAuthProvider } from "ra-strapi";
import {
  Admin,
  EditGuesser,
  ListGuesser,
  LoginWithEmail,
  Resource,
  ShowGuesser,
} from "react-admin";
import { Layout } from "./Layout";
import { authProvider } from "./authProvider";
import { strapiDataProvider } from "ra-strapi";
import authors from "./authors";

const STRAPI_URL = "http://localhost:1337";

export const App = () => (
  <Admin
    layout={Layout}
    authProvider={strapiAuthProvider({ baseURL: STRAPI_URL })}
    dataProvider={strapiDataProvider({ baseURL: STRAPI_URL })}
    loginPage={LoginWithEmail}
  >
    <Resource
      name="articles"
      list={ListGuesser}
      edit={EditGuesser}
      show={ShowGuesser}
      recordRepresentation={"title"}
    />
    <Resource
      name="categories"
      list={ListGuesser}
      edit={EditGuesser}
      show={ShowGuesser}
    />
    <Resource
      name="authors"
      list={authors.List}
      create={authors.Create}
      edit={EditGuesser}
      show={authors.Show}
    />
  </Admin>
);
