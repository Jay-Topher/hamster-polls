/* eslint-disable @typescript-eslint/camelcase */
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('options', {
    id: {
      type: 'uuid',
      notNull: true,
      primaryKey: true,
      unique: true,
      default: pgm.func('uuid_generate_v4()'),
      comment: 'The id of the option',
    },
    option: {
      type: 'VARCHAR(250)',
      notNull: true,
      comment: 'Option text for a poll question',
    },
    question_id: {
      type: 'uuid',
      notNull: true,
      references: 'questions("id")',
      comment: 'The id of the question the option belongs to',
    },
    created_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('current_timestamp'),
      comment: 'When the option was created',
    },
    updated_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('current_timestamp'),
      comment: 'When the option was updated',
    },
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('options');
}
