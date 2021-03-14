import httpStatus from 'http-status';
import { APIError } from '../../config/error';
import PollHistoryTable from '../../interface/poll-history';
import { sql } from '../../stores/database';

/**
 * A controller function to add poll voting to history so you don't vote more than once
 * @param payload Poll History object
 */
async function addHistory(payload: PollHistoryCreateType) {
  try {
    await sql<PollHistoryTable>`INSERT INTO poll_history ${sql(
      payload,
      'voter_id',
      'poll_id',
    )}`;
    return;
  } catch (error) {
    throw new APIError({
      errors: error,
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message || error,
    });
  }
}

/**
 * A controller function to check if user has voted already
 * @param payload Poll History Object
 */
async function hasVoted(payload: PollHistoryCreateType) {
  try {
    const columns = ['voter_id', 'poll_id'];
    const [alreadyVoted] = await sql<PollHistoryCreateType>`SELECT ${sql(
      columns,
    )} FROM poll_history WHERE voter_id = ${payload.voter_id} AND poll_id = ${
      payload.poll_id
    }`;
    if (!alreadyVoted) {
      return false;
    }
    return true;
  } catch (error) {
    throw new APIError({
      errors: error,
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message || error,
    });
  }
}

export default {
  addHistory,
  hasVoted,
};
