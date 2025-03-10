import { ReferenceInput, SimpleForm, TextInput } from "react-admin";

export const ArticleForm = () => (
  <SimpleForm>
    <TextInput source="title" />
    <TextInput source="description" />
    <TextInput source="slug" />
    <ReferenceInput source="author" reference="authors" />
    <ReferenceInput source="category" reference="categories" />
  </SimpleForm>
);
