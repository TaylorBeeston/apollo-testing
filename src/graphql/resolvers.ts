export const myResolver = (
    _obj: any,
    { name }: { name: string },
    _context: any,
    _info: any
) => ({ greeting: `Hello ${name}!` });

export const resolvers = {
    Query: {
        myResolver,
        user: (_obj: any, { id }: { id: string }) => ({ id, name: "Bob" }),
    },
    Mutation: {
        createUser: (_obj: any, { name }: { name: string }) => ({ id: "3", name }),
    },
};
