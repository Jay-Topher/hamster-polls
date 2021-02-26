/* eslint-disable @typescript-eslint/camelcase */
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('votes', {
    id: {
      type: 'uuid',
      notNull: true,
      primaryKey: true,
      unique: true,
      default: pgm.func('uuid_generate_v4()'),
      comment: 'The id of the vote',
    },
    question_id: {
      type: 'uuid',
      notNull: true,
      references: 'questions("id")',
      comment: 'The ID of the question answered',
    },
    option_id: {
      type: 'uuid',
      notNull: true,
      references: 'options("id")',
      comment: 'The id of the option selected',
    },
    voter_id: {
      type: 'uuid',
      notNull: true,
      references: 'users("id")',
      comment: 'The id of the voter',
    },
    voted_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('current_timestamp'),
      comment: 'When the user voted',
    },
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('votes');
}
