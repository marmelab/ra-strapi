import { SimpleForm, TextInput } from "react-admin";

export const AuthorForm = () => (
  <SimpleForm>
    <TextInput source="name" />
    <TextInput source="email" />
  </SimpleForm>
);
