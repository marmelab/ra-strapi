import { Datagrid, DateField, EmailField, List, NumberField, ReferenceManyField, SingleFieldList, TextField } from 'react-admin';

export const AuthorList = () => (
  <List>
    <Datagrid>
      <NumberField source="ref" />
      <TextField source="name" />
      <EmailField source="email" />
      <DateField source="createdAt" />
      <DateField source="updatedAt" />
      <DateField source="publishedAt" />
      <TextField source="avatar.id" />
      <ReferenceManyField reference="articles" target="author.documentId">
        <SingleFieldList />
      </ReferenceManyField>
    </Datagrid>
  </List>
);