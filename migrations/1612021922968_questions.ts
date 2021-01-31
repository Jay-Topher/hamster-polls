/* eslint-disable @typescript-eslint/camelcase */
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('questions', {
    id: {
      type: 'uuid',
      notNull: true,
      primaryKey: true,
      unique: true,
      default: pgm.func('uuid_generate_v4()'),
      comment: 'The id of the poll question',
    },
    question: {
      type: 'TEXT',
      notNull: true,
      comment: 'The poll question',
    },
    poll_id: {
      type: 'uuid',
      notNull: true,
      references: 'polls("id")',
      comment: 'The poll which the question belongs to.',
    },
    created_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('current_timestamp'),
      comment: 'When the question was created',
    },
    updated_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('current_timestamp'),
      comment: 'when the question was updated',
    },
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('questions');
}
