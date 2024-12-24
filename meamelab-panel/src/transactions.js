import React from 'react';
import {
    Datagrid,
    List,
    NumberField,
    FunctionField,
    TextInput,
    Filter,
} from 'react-admin';
import moment from 'moment';
import { Typography } from '@mui/material';

// Filter Component for Search
const TransactionFilter = (props) => (
    <Filter {...props}>
        <TextInput label="Search" source="q" alwaysOn />
    </Filter>
);

const formatDateTime = (date) => moment(date).format('MMM D, YYYY, h:mm A');

const renderTypeField = (type) => {
    const isRecharge = type === 'recharge';
    return (
        <Typography
            variant="body2"
            sx={{
                color: isRecharge ? 'green' : 'red',
                fontWeight: 'bold',
            }}
        >
            {isRecharge ? '+ Recharge' : '- Redeem'}
        </Typography>
    );
};

export const TransactionList = (props) => (
    <List {...props} title="Transactions" filters={<TransactionFilter />}>
        <Datagrid>
            <FunctionField
                source="id"
                label="Transaction ID"
                render={(record) => record.id}
            />
            <FunctionField
                source="type"
                label="Type"
                render={(record) => renderTypeField(record.type)}
            />
            <NumberField source="amount" label="Amount" />
            <FunctionField
                source="date"
                label="Date"
                render={(record) => formatDateTime(record.date)}
            />
        </Datagrid>
    </List>
);
