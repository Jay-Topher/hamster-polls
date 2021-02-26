import httpStatus from 'http-status';
import { APIError } from '../../config/error';
import PollHistoryTable from '../../interface/poll-history';
import { sql } from '../../stores/database';

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

export default {
  addHistory,
};
