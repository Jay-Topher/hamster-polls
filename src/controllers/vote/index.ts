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
    >`SELECT * FROM votes WHERE question_id = ${payload.question_id} AND voter_id = ${payload.voter_id}`;
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

/**
 * A controller Fn to get all the vores for a question
 * @param questionId The ID of the question whose votes you need to get
 * @returns The options and their respective votes
 */
async function getVotes(questionId: string) {
  try {
    const [
      voteCount,
    ] = await sql`SELECT option_id, COUNT(option_id) as votes FROM votes WHERE question_id = ${questionId} GROUP BY option_id`;
    if (!voteCount) {
      throw new APIError({
        status: httpStatus.NOT_FOUND,
        errors: 'Votes not found',
        message: 'Votes not found',
      });
    }
    return voteCount;
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
  getVotes,
};
