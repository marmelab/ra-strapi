import {
    Edit,
    ReferenceInput,
    SimpleForm,
    TextInput
} from "react-admin";
export const ArticleEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="title" /> 
      <TextInput source="description" />
      <TextInput source="slug" /> 
      <ReferenceInput source="author" reference="authors"/>
      <ReferenceInput source="category" reference="categories"/>
    </SimpleForm>
  </Edit>
);
