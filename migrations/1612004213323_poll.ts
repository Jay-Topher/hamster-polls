/* eslint-disable @typescript-eslint/camelcase */
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('polls', {
    id: {
      type: 'uuid',
      notNull: true,
      primaryKey: true,
      unique: true,
      default: pgm.func('uuid_generate_v4()'),
      comment: 'The id of the poll or survey',
    },
    title: {
      type: 'VARCHAR(250)',
      notNull: true,
      comment: 'Title of the poll',
    },
    description: {
      type: 'TEXT',
      comment: "Poll's description",
    },
    author_id: {
      type: 'uuid',
      notNull: true,
      references: 'users("id")',
      comment: 'The author of the poll',
    },
    published: {
      type: 'BOOL',
      notNull: true,
      comment: 'If the poll has been published online or not',
    },
    created_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('current_timestamp'),
      comment: 'When the poll was created',
    },
    updated_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('current_timestamp'),
      comment: 'If poll was updated before publishing',
    },
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('polls');
}
