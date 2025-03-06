import {
  ImageField,
  ReferenceField,
  Show,
  SimpleShowLayout,
  TextField,
} from "react-admin";
export const ArticleShow = () => (
  <Show>
    <SimpleShowLayout>
      <ImageField source="cover.formats.large.url" label="Cover"/>
      <TextField source="title" />
      <TextField source="description" />
      <ReferenceField reference="authors" source="author" link="show" />
      <ReferenceField reference="categories" source="category" link="show" />
    </SimpleShowLayout>
  </Show>
);
