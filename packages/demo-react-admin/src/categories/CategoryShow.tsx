import {
    ChipField,
    ReferenceManyField,
    Show,
    SimpleShowLayout,
    SingleFieldList,
    TextField
} from "react-admin";
export const CategoryShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="name" /> 
      <TextField source="slug" />
      <TextField source="description" />
      <ReferenceManyField target="category" reference="articles">
        <SingleFieldList linkType='show'>
          <ChipField source="title"/>
        </SingleFieldList>
      </ReferenceManyField>
    </SimpleShowLayout>
  </Show>
);
