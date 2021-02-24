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
    )} RETURNING *`;

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

/**
 * Fn to login a user
 * @param user user object
 */
async function loginUser(user: UserLoginType) {
  try {
    const { username, password } = user;
    const [existingUser] = await sql<
      LoggedInUserType
    >`SELECT id, username, email, password FROM users WHERE username = ${username}`;

    if (!existingUser)
      throw new APIError({
        status: 404,
        message: 'User does not exist',
        errors: 'User not found',
      });

    // check user password
    const rightPassword = await argon2.verify(existingUser.password, password);
    if (!rightPassword)
      throw new APIError({
        status: 400,
        message: 'Wrong Username or Password',
        errors: 'Wrong username/password',
      });

    return signToken({
      email: existingUser.email,
      username: existingUser.username,
      id: existingUser.id,
    });
  } catch (error) {
    console.error(error);
    throw new APIError({
      errors: error,
      status: 500,
      message: error.message || error,
    });
  }
}

export default {
  registerUser,
  loginUser,
};
