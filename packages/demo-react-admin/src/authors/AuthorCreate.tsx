import {
    Create,
    SimpleForm,
    TextInput
} from "react-admin";
export const AuthorCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="name" />
      <TextInput source="email" />
    </SimpleForm>
  </Create>
);
