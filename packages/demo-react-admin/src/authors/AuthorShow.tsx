import {
  ChipField,
  EmailField,
  ReferenceManyField,
  Show,
  SimpleShowLayout,
  SingleFieldList,
  TextField,
} from "react-admin";

export const AuthorShow = () => {
  return (
    <Show>
      <SimpleShowLayout>
        <TextField source="name" />
        <EmailField source="email" />
        <ReferenceManyField reference="articles" target="author" label="Articles">
          <SingleFieldList linkType="show">
            <ChipField source="title" />
          </SingleFieldList>
        </ReferenceManyField>
      </SimpleShowLayout>
    </Show>
  );
};
