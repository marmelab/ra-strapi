import { useEffect } from "react";
import {
    EmailField,
    Show,
    SimpleShowLayout,
    TextField,
    useRecordContext
} from "react-admin";

const AuthorFieldRecordContextObserver = () => {
    const record = useRecordContext();
    useEffect(()=>{
        console.log({record});
    }, [record]);
    return null;
}
export const AuthorShow = () => {
    return (
      <Show>
        <SimpleShowLayout>
          <AuthorFieldRecordContextObserver />
          <TextField source="name" />
          <EmailField source="email" />
          <TextField source="articles" />
        </SimpleShowLayout>
      </Show>
    );
};
