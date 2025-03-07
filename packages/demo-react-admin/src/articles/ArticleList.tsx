import {
  Datagrid,
  ImageField,
  List,
  ReferenceField,
  TextField,
  TextInput
} from "react-admin";

const articleFilters = [
  <TextInput source="title_contains" label="Title"/>
]

export const ArticleList = () => (
  <List filters={articleFilters}>
    <Datagrid>
      <ImageField source="cover.formats.thumbnail.url" label="Cover" />
      <TextField source="title" />
      <TextField source="description" />
      <ReferenceField reference="authors" source="author" link="show" />
      <ReferenceField reference="categories" source="category" link="show" />
    </Datagrid>
  </List>
);
