import httpStatus from 'http-status';
import { APIError } from '../../config/error';
import VotesTable from '../../interface/votes';
import { sql } from '../../stores/database';

/**
 * A controller Fn to add votes
 * @param optionId The ID of the chosen option
 * @param userId The ID of the voter
 */
async function vote(payload: VoteCreateType) {
  try {
    const [checkVote] = await sql<
      VotesTable
    >`SELECT * FROM votes WHERE question_id = ${payload.question_id} AND voter_id = ${payload.voter_id} RETURNING *`;
    if (checkVote) {
      throw new APIError({
        status: httpStatus.BAD_REQUEST,
        errors: 'User has voted already',
        message: 'User has voted already',
      });
    }
    const voted_at = new Date();
    const newPayload = { ...payload, voted_at };
    const [addedVote] = await sql<VotesTable>`INSERT INTO votes ${sql(
      newPayload,
      'question_id',
      'option_id',
      'voter_id',
      'voted_at',
    )} RETURNING *`;

    return addedVote;
  } catch (error) {
    throw new APIError({
      errors: error,
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message || error,
    });
  }
}

export default {
  vote,
};
