import {
  EmailField,
  Show,
  SimpleShowLayout,
  TextField
} from "react-admin";


export const AuthorShow = () => {
    return (
      <Show>
        <SimpleShowLayout>
          <TextField source="name" />
          <EmailField source="email" />
          <TextField source="articles" />
        </SimpleShowLayout>
      </Show>
    );
};
