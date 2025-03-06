import { SimpleForm, TextInput } from "react-admin";

export const CategoryForm = () => {
  return (
    <SimpleForm>
      <TextInput source="name" />
      <TextInput source="slug" />
      <TextInput source="description" />
    </SimpleForm>
  );
};
