import React from 'react';
import { List, Datagrid, TextField, NumberField } from 'react-admin';

export const UserList = () => (
    <List>
        <Datagrid>
            <TextField source="id" />
            <TextField source="name" />
            <NumberField source="points" />
        </Datagrid>
    </List>
);
