import {
  strapiDataProvider,
  useStrapiAuthProvider,
} from "ra-strapi";
import { Admin, LoginWithEmail, Resource } from "react-admin";
import { Layout } from "./Layout";
import articles from "./articles";
import authors from "./authors";
import categories from "./categories";

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;
const { strapiAuthProvider, httpClient } = useStrapiAuthProvider({
  baseURL: STRAPI_URL,
  authType: "jwt",
});
export const App = () => (
  <Admin
    layout={Layout}
    authProvider={strapiAuthProvider}
    dataProvider={strapiDataProvider({ baseURL: STRAPI_URL, httpClient })}
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
