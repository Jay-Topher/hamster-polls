import { GraphQLSchema } from 'graphql';
import { RootQueryType } from './types';

const schema = new GraphQLSchema({
  query: RootQueryType,
});

export default schema;
