import { APIError } from '../../config/error';
import OptionTable from '../../interface/option';
import { sql } from '../../stores/database';
import status from 'http-status';

/**
 * a Fn to add single or multiple options to a question
 * @param options option or options to add
 */
async function addOptions(options: OptionTable[] | OptionTable) {
  try {
    const [savedOption] = await sql<
      OptionTable | OptionTable[]
    >`INSERT INTO options ${sql(options, 'option', 'question_id')} RETURNING *`;

    return savedOption;
  } catch (error) {
    throw new APIError({
      status: status.INTERNAL_SERVER_ERROR,
      message: error.message || error,
      errors: error,
    });
  }
}

/**
 *
 * @param optionId ID of the option to edit
 * @param option Text to edit the option
 */
async function editOption(optionId: string, option: string) {
  try {
    const [editedOption] = await sql<
      OptionTable
    >`UPDATE questions set option = ${option} WHERE id = ${optionId} RETURNING *`;
    if (!editedOption) {
      throw new APIError({
        errors: 'Option to update not found',
        status: status.NOT_FOUND,
        message: 'Option to update not found',
      });
    }

    return editedOption;
  } catch (error) {
    throw new APIError({
      errors: error,
      status: status.INTERNAL_SERVER_ERROR,
      message: error.message || error,
    });
  }
}

/**
 * A Fn to delete an option from the DB
 * @param optionId ID of the option to be deleted
 */
async function deleteOption(optionId: string) {
  try {
    const [optionToDelete] = await sql<{
      id: string;
    }>`DELETE FROM options WHERE id = ${optionId} RETURNING id`;
    if (!optionToDelete) {
      throw new APIError({
        errors: 'Option to delete not found',
        status: status.NOT_FOUND,
        message: 'Option to delete not found',
      });
    }

    return optionToDelete.id;
  } catch (error) {
    throw new APIError({
      errors: error,
      status: status.INTERNAL_SERVER_ERROR,
      message: error.message || error,
    });
  }
}

export default {
  addOptions,
  deleteOption,
  editOption,
};
