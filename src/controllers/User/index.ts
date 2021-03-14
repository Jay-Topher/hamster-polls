import httpStatus from 'http-status';
import { APIError } from '../../config/error';
import UserTable from '../../interface/users';
import { sql } from '../../stores/database';

/**
 * A controller function to get a user given their ID
 * @param userId ID of user you want to get
 * @returns The queried user
 */
async function getUserById(userId: string) {
  try {
    const [user] = await sql<
      UserTable
    >`SELECT * FROM users WHERE id = ${userId}`;

    if (!user) {
      throw new APIError({
        message: 'User not found',
        status: httpStatus.NOT_FOUND,
        errors: 'User not found',
      });
    }
    return user;
  } catch (error) {
    throw new APIError({
      errors: error,
      message: error.message || error,
      status: 500,
    });
  }
}

export default {
  getUserById,
};
