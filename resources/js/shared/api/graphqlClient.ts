interface GraphQLResponse<TData> {
    data?: TData;
    errors?: Array<{ message: string }>;
}

export class GraphQLClientError extends Error {
    constructor(public readonly errors: Array<{ message: string }>) {
        super(errors.map((error) => error.message).join('\n'));
        this.name = 'GraphQLClientError';
    }
}

export async function graphqlRequest<TData, TVariables extends Record<string, unknown> = Record<string, never>>(
    query: string,
    variables?: TVariables,
): Promise<TData> {
    const response = await fetch('/graphql', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
        throw new Error(`GraphQL request failed with HTTP ${response.status}`);
    }

    const payload = (await response.json()) as GraphQLResponse<TData>;

    if (payload.errors?.length) {
        throw new GraphQLClientError(payload.errors);
    }

    if (!payload.data) {
        throw new Error('GraphQL response does not contain data.');
    }

    return payload.data;
}
