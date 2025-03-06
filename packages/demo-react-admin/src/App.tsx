import { strapiAuthProvider, strapiDataProvider } from "ra-strapi";
import {
  Admin,
  EditGuesser,
  LoginWithEmail,
  Resource,
  ShowGuesser
} from "react-admin";
import { Layout } from "./Layout";
import { ArticleEdit } from "./articles/ArticleEdit";
import { ArticleList } from "./articles/ArticleList";
import { ArticleShow } from "./articles/ArticleShow";
import authors from "./authors";
import categories from "./categories";

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
      list={ArticleList}
      edit={ArticleEdit}
      show={ArticleShow}
      recordRepresentation={"title"}
    />
    <Resource
      name="categories"
      list={categories.List}
      edit={EditGuesser}
      show={ShowGuesser}
      recordRepresentation={"name"}
    />
    <Resource
      name="authors"
      list={authors.List}
      create={authors.Create}
      edit={EditGuesser}
      show={authors.Show}
      recordRepresentation={"name"}
    />
  </Admin>
);
