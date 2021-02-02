import argon2 from 'argon2';
import { APIError } from '../../config/error';
import UserTable from '../../interface/users';
import { sql } from '../../stores/database';
import { signToken } from '../../utils';

/**
 * Controller function to add a new user to the DB
 * @param user
 */
async function registerUser(user: UserType) {
  try {
    const { email, username, password } = user;
    const [existingUser] = await sql<
      UserTable
    >`SELECT * FROM users WHERE email = ${email} OR username = ${username}`;

    if (existingUser) {
      throw new APIError({
        status: 400,
        message: 'This user already exists',
        errors: 'This user already exists',
      });
    }

    const hashedPassword = await argon2.hash(password);
    const userToSave = { ...user, password: hashedPassword };

    const [savedUser] = await sql<UserTable>`INSERT INTO users ${sql(
      userToSave,
      'first_name',
      'last_name',
      'password',
      'email',
      'username',
    )}`;

    return signToken({
      id: savedUser.id,
      email: savedUser.email,
      username: savedUser.username,
    });
  } catch (error) {
    console.error(error);
    throw new APIError({
      status: 500,
      errors: error,
      message: error.message || error,
    });
  }
}

export default {
  registerUser,
};