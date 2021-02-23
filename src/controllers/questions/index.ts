import { APIError } from '../../config/error';
import QuestionTable from '../../interface/questions';
import { sql } from '../../stores/database';
import status from 'http-status';

async function createQuestion(questionPayload: QuestionCreateType) {
  try {
    const [questionToSave] = await sql<
      QuestionTable
    >`INSERT INTO questions ${sql(
      questionPayload,
      'question',
      'poll_id',
    )} RETURNING *`;

    return questionToSave;
  } catch (error) {
    throw new APIError({
      errors: error,
      status: status.INTERNAL_SERVER_ERROR,
      message: error.message || error,
    });
  }
}

async function editQuestion(questionId: string, question: string) {
  try {
    const [editedQuestion] = await sql<
      QuestionTable
    >`UPDATE questions set question = ${question} WHERE id = ${questionId} RETURNING *`;
    if (!editedQuestion) {
      throw new APIError({
        errors: 'Question to update not found',
        status: status.NOT_FOUND,
        message: 'Question to update not found',
      });
    }

    return editedQuestion;
  } catch (error) {
    throw new APIError({
      errors: error,
      status: status.INTERNAL_SERVER_ERROR,
      message: error.message || error,
    });
  }
}

async function deleteQuestion(questionId: string) {
  try {
    const [questionToDelete] = await sql<{
      id: string;
    }>`DELETE FROM questions WHERE id = ${questionId} RETURNING id`;

    if (!questionToDelete) {
      throw new APIError({
        errors: 'Question to delete not found',
        status: status.NOT_FOUND,
        message: 'Question to delete not found',
      });
    }

    return questionToDelete.id;
  } catch (error) {
    throw new APIError({
      errors: error,
      status: status.INTERNAL_SERVER_ERROR,
      message: error.message || error,
    });
  }
}

export default {
  createQuestion,
  deleteQuestion,
  editQuestion,
};
