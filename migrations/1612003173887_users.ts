/* eslint-disable @typescript-eslint/camelcase */
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('users', {
    id: {
      type: 'uuid',
      notNull: true,
      primaryKey: true,
      unique: true,
      default: pgm.func('uuid_generate_v4()'),
      comment: 'The unique id of the user',
    },
    first_name: {
      type: 'VARCHAR(250)',
      notNull: true,
      comment: "The User's first name",
    },
    last_name: {
      type: 'VARCHAR(250)',
      notNull: true,
      comment: "The User's last name",
    },
    username: {
      type: 'VARCHAR(250)',
      notNull: true,
      unique: true,
      comment: "The User's username",
    },
    email: {
      type: 'VARCHAR(100)',
      notNull: true,
      unique: true,
      comment: "The User's email",
    },
    password: {
      type: 'VARCHAR(250)',
      notNull: true,
      comment: 'The hashed password',
    },
    created_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('current_timestamp'),
      comment: 'When the user was signed up',
    },
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('users');
}
