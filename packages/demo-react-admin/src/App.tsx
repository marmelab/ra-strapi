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


export const App = () => (
  <Admin layout={Layout} authProvider={authProvider} dataProvider={strapiDataProvider({baseURL: 'http://localhost:1337/api', authToken:''})}>
    <Resource
      name="articles"
      list={ListGuesser}
      edit={EditGuesser}
      show={ShowGuesser}
    />
    <Resource
      name="categories"
      list={ListGuesser}
      edit={EditGuesser}
      show={ShowGuesser}
    />
    <Resource
      name="authors"
      list={ListGuesser}
      edit={EditGuesser}
      show={ShowGuesser}
    />
  </Admin>
);
