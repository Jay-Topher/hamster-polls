import { GraphQLSchema } from 'graphql';
import { RootMutationType, RootQueryType } from './types';

const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType,
});

export default schema;
