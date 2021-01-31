/* eslint-disable @typescript-eslint/camelcase */
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('poll_history', {
    id: {
      type: 'uuid',
      notNull: true,
      primaryKey: true,
      unique: true,
      default: pgm.func('uuid_generate_v4()'),
      comment: 'The id of the history',
    },
    voter_id: {
      type: 'uuid',
      notNull: true,
      references: 'users("id")',
      comment: 'The id of the voter',
    },
    poll_id: {
      type: 'uuid',
      notNull: true,
      references: 'polls("id")',
      comment: 'The id of the answered poll',
    },
    created_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('current_timestamp'),
      comment: 'When the poll was answered',
    },
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('poll_history');
}
