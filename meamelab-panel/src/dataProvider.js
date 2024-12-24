import jsonServerProvider from 'ra-data-json-server';

const customDataProvider = {
    ...jsonServerProvider('http://localhost:3000/api'),

    // Override the getList method for transactions
    getList: async (resource, params) => {
        if (resource === 'transactions') {
            try {
                const { pagination, filter } = params;
                const { page, perPage } = pagination;
                const { q, ...filters } = filter;

                // Construct query parameters
                const query = new URLSearchParams({
                    page,
                    perPage,
                    ...filters,
                    ...(q && { q }), // Include search query if provided
                });

                // Fetch transactions from API
                const response = await fetch(`http://localhost:3000/api/wallet/details-transactions?${query}`, {
                    headers: {
                        Authorization: `Bearer ${JSON.parse(localStorage.getItem('auth'))?.token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const json = await response.json();

                return {
                    data: json.transactions.map((transaction) => ({
                        id: transaction._id, // Map `_id` to `id`
                        ...transaction,
                    })),
                    total: json.total, // Total count for pagination
                };
            } catch (error) {
                console.error('Error fetching transactions:', error);
                throw new Error('Failed to fetch transactions.');
            }
        }

        // Fallback to default behavior for other resources
        return jsonServerProvider('http://localhost:3000/api').getList(resource, params);
    },
};

export default customDataProvider;
