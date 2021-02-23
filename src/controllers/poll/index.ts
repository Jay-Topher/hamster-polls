import { APIError } from '../../config/error';
import PollTable from '../../interface/poll';
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
    )}) RETURNING *`;

    return addedPoll;
  } catch (error) {
    throw new APIError({
      errors: error,
      message: error.message || error,
      status: 500,
    });
  }
}

