import {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLBoolean,
  GraphQLList,
} from 'graphql';
import PollController from '../controllers/poll';
import QuestionController from '../controllers/questions';
import UserController from '../controllers/User';
import VotesTable from '../interface/votes';

const UserType = new GraphQLObjectType({
  name: 'User',
  description: 'Any user in the app',
  fields: () => ({
    id: {
      type: GraphQLNonNull(GraphQLID),
      description: "The user's ID",
    },
    first_name: { type: GraphQLNonNull(GraphQLString) },
    last_name: { type: GraphQLNonNull(GraphQLString) },
    email: { type: GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLNonNull(GraphQLString) },
    created_at: { type: GraphQLNonNull(GraphQLString) },
  }),
});

const OptionType: GraphQLObjectType = new GraphQLObjectType({
  name: 'Option',
  description: 'Options to questions',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLID) },
    option: { type: GraphQLNonNull(GraphQLString) },
    question_id: { type: GraphQLNonNull(GraphQLID) },
    created_at: { type: GraphQLNonNull(GraphQLString) },
    updated_at: { type: GraphQLNonNull(GraphQLString) },
    question: {
      type: QuestionType,
      description: 'The question the option belongs to',
      resolve: async (parent) =>
        await QuestionController.getQuestionById(parent.question_id),
    },
  }),
});

const QuestionType = new GraphQLObjectType({
  name: 'Question',
  description: 'Questions from polls',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLID) },
    question: { type: GraphQLNonNull(GraphQLString) },
    poll_id: { type: GraphQLNonNull(GraphQLID) },
    created_at: { type: GraphQLNonNull(GraphQLString) },
    updated_at: { type: GraphQLNonNull(GraphQLString) },
    options: {
      type: GraphQLList(OptionType),
      description: 'list of options to a question',
      resolve: async (parent) =>
        await QuestionController.getQuestionOptions(parent.id),
    },
  }),
});

const PollType = new GraphQLObjectType({
  name: 'Poll',
  description: 'Poll(House for all questions)',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLID) },
    title: { type: GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString },
    author_id: { type: GraphQLNonNull(GraphQLID) },
    published: { type: GraphQLNonNull(GraphQLBoolean) },
    created_at: { type: GraphQLNonNull(GraphQLString) },
    updated_at: { type: GraphQLNonNull(GraphQLString) },
    questions: {
      type: GraphQLList(QuestionType),
      resolve: async (parent) => {
        return await PollController.getPollQuestions(parent.id);
      },
    },
    author: {
      type: UserType,
      resolve: async (parent) => {
        return await UserController.getUserById(parent.author_id);
      },
    },
  }),
});

const VoteType = new GraphQLObjectType({
  name: 'Vote',
  description: 'Votes on poll questions',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLID) },
    question_id: { type: GraphQLNonNull(GraphQLID) },
    option_id: { type: GraphQLNonNull(GraphQLID) },
    voter_id: { type: GraphQLNonNull(GraphQLID) },
    voted_at: { type: GraphQLNonNull(GraphQLID) },
    voter: {
      type: UserType,
      description: 'The user that voted',
      resolve: async (parent: VotesTable) => {
        return await UserController.getUserById(parent.voter_id);
      },
    },
  }),
});

export const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'Root Query',
  fields: () => ({
    user: {
      type: UserType,
      description: 'An app user',
      args: {
        id: { type: GraphQLNonNull(GraphQLID), description: 'ID of the user' },
      },
      resolve: async (_, args) => {
        return await UserController.getUserById(args.id);
      },
    },
    poll: {
      type: PollType,
      description: 'Poll of questions',
      args: {
        id: {
          type: GraphQLNonNull(GraphQLID),
          description: 'ID of the poll to get',
        },
      },
      resolve: async (_, args) => {
        return await PollController.getPoll(args.id);
      },
    },
    question: {
      type: QuestionType,
      description: 'Question in a poll',
      args: {
        id: {
          type: GraphQLNonNull(GraphQLID),
          description: 'ID of the question',
        },
      },
      resolve: async (_, args) => {
        return await QuestionController.getQuestionById(args.id);
      },
    },
  }),
});
