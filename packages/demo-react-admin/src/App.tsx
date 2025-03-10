import {
  strapiAuthProvider,
  strapiDataProvider,
  strapiHttpClient,
} from "ra-strapi";
import { Admin, LoginWithEmail, Resource } from "react-admin";
import { Layout } from "./Layout";
import articles from "./articles";
import authors from "./authors";
import categories from "./categories";

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;
const authProvider = strapiAuthProvider({
  baseURL: STRAPI_URL,
});
const httpClient = strapiHttpClient();
const dataProvider = strapiDataProvider({
  baseURL: STRAPI_URL,
  httpClient,
});

export const App = () => (
  <Admin
    layout={Layout}
    authProvider={authProvider}
    dataProvider={dataProvider}
    loginPage={LoginWithEmail}
  >
    <Resource
      name="articles"
      list={articles.List}
      edit={articles.Edit}
      show={articles.Show}
      create={articles.Create}
      recordRepresentation={"title"}
    />
    <Resource
      name="categories"
      list={categories.List}
      edit={categories.Edit}
      show={categories.Show}
      create={categories.Create}
      recordRepresentation={"name"}
    />
    <Resource
      name="authors"
      list={authors.List}
      create={authors.Create}
      edit={authors.Edit}
      show={authors.Show}
      recordRepresentation={"name"}
    />
  </Admin>
);
