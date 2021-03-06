import httpStatus from 'http-status';
import { APIError } from '../../config/error';
import PollTable from '../../interface/poll';
import QuestionTable from '../../interface/questions';
import { sql } from '../../stores/database';

/**
 * Controller Fn to add a Poll
 * @param {PollType} PollObject
 */
async function addPoll({ title, description = '', author_id }: PollType) {
  try {
    const pollData = { title, description, author_id };

    const [addedPoll] = await sql<PollTable>`INSERT INTO polls ${sql(
      pollData,
      'title',
      'description',
      'author_id',
    )} RETURNING *`;

    return addedPoll;
  } catch (error) {
    throw new APIError({
      errors: error,
      message: error.message || error,
      status: 500,
    });
  }
}

/**
 * A Controller Fn to publish a poll
 * @param pollId The ID of the poll to publish
 */
async function publishPoll(pollId: string) {
  try {
    const [publishedPoll] = await sql<
      PollTable
    >`UPDATE polls SET published = ${true} WHERE id = ${pollId} RETURNING *`;

    if (!publishPoll) {
      throw new APIError({
        status: 404,
        message: 'Poll to publish not found',
        errors: 'Poll to publish not found',
      });
    }

    return publishedPoll;
  } catch (error) {
    throw new APIError({
      errors: error,
      message: error.message || error,
      status: 500,
    });
  }
}

async function getPollQuestions(pollId: string) {
  try {
    const [pollQuestions] = await sql<
      [QuestionTable[]]
    >`SELECT * FROM questions WHERE poll_id = ${pollId}`;

    if (!pollQuestions) {
      throw new APIError({
        status: httpStatus.NOT_FOUND,
        message: 'No questions found',
        errors: 'Questions not found',
      });
    }
    return pollQuestions;
  } catch (error) {
    throw new APIError({
      errors: error,
      message: error.message || error,
      status: 500,
    });
  }
}

async function getPoll(pollId: string) {
  try {
    const [poll] = await sql<
      PollTable
    >`SELECT * FROM polls WHERE id = ${pollId}`;

    if (!poll) {
      throw new APIError({
        status: httpStatus.NOT_FOUND,
        message: 'No poll found',
        errors: 'Poll not found',
      });
    }

    return poll;
  } catch (error) {
    throw new APIError({
      errors: error,
      message: error.message || error,
      status: 500,
    });
  }
}

async function getPollWithQuestions(pollId: string) {
  try {
    const pollPromise = getPoll(pollId);
    const questionsPromise = getPollQuestions(pollId);
    const [poll, questions] = await Promise.all([
      pollPromise,
      questionsPromise,
    ]);

    return { poll, questions };
  } catch (error) {
    throw new APIError({
      errors: error,
      message: error.message || error,
      status: 500,
    });
  }
}

export default {
  addPoll,
  publishPoll,
  getPollQuestions,
  getPollWithQuestions,
  getPoll,
};
