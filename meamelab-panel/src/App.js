import React from 'react';
import { Admin, Resource } from 'react-admin';
import customDataProvider from './dataProvider';
import { TransactionList } from './transactions';
import Dashboard from './Dashboard';
import authProvider from './authProvider';

const App = () => (
    <Admin dashboard={Dashboard} authProvider={authProvider} dataProvider={customDataProvider}>
        <Resource name="transactions" list={TransactionList} />
    </Admin>
);

export default App;
