import { ChipField, Datagrid, DateField, EmailField, List, NumberField, ReferenceArrayField, SingleFieldList, TextField } from 'react-admin';

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
            <ReferenceArrayField source="articles" reference="articles">
                <SingleFieldList/>
            </ReferenceArrayField>
        </Datagrid>
    </List>
);