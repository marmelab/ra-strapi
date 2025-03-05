import {
  Admin,
  Resource,
  ListGuesser,
  EditGuesser,
  ShowGuesser,
} from "react-admin";
import { Layout } from "./Layout";
import { authProvider } from "./authProvider";
import { strapiDataProvider } from "ra-strapi";
import authors from "./authors";


export const App = () => (
  <Admin layout={Layout} authProvider={authProvider} dataProvider={strapiDataProvider({baseURL: 'http://localhost:1337', authToken:''})}>
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
      show={ShowGuesser}
    />
  </Admin>
);
