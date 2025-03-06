import {
    Datagrid,
    ImageField,
    List,
    ReferenceField,
    TextField
} from "react-admin";

export const ArticleList = () => (
  <List>
    <Datagrid>
      <ImageField source="cover.formats.thumbnail.url" label="Cover"/>
      <TextField source="title" />
      <TextField source="description" />
      <ReferenceField reference="authors" source="author" link="show" />
      <ReferenceField reference="categories" source="category" link="show" />
    </Datagrid>
  </List>
);
