import {
    ChipField,
  Datagrid,
  DateField,
  List,
  NumberField,
  ReferenceManyField,
  SingleFieldList,
  TextField,
} from "react-admin";

export const CategoryList = () => (
  <List>
    <Datagrid>
      <TextField source="name" />
      <TextField source="slug" />
      <TextField source="description" />
      <ReferenceManyField target="category" reference="articles">
        <SingleFieldList>
          <ChipField source="title" />
        </SingleFieldList>
      </ReferenceManyField>
    </Datagrid>
  </List>
);
