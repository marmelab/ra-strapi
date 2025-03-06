import {
  Datagrid,
  DateField,
  EmailField,
  ImageField,
  List,
  NumberField,
  ReferenceManyField,
  SingleFieldList,
  TextField,
  WrapperField,
} from "react-admin";
import { Avatar } from "./Avatar";

export const AuthorList = () => (
  <List>
    <Datagrid>
      <WrapperField label="Avatar">
        <Avatar source="avatar.formats.thumbnail" />
      </WrapperField>
      <NumberField source="ref" />
      <TextField source="name" />
      <EmailField source="email" />
      <DateField source="createdAt" />
      <DateField source="updatedAt" />
      <DateField source="publishedAt" />
      <ReferenceManyField reference="articles" target="author.documentId">
        <SingleFieldList />
      </ReferenceManyField>
    </Datagrid>
  </List>
);
