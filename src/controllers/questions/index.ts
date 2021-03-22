import { APIError } from '../../config/error';
import QuestionTable from '../../interface/questions';
import { sql } from '../../stores/database';
import status from 'http-status';
import OptionTable from '../../interface/option';
import httpStatus from 'http-status';
import OptionsController from '../options';

/**
 * A Fn to add questions to DB
 * @param questionPayload question object
 */
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

/**
 * A controller Fn to create questions with an array of options
 * @param payload An object with question and options
 * payload example: {question: {question: "Are you a cat person or a dog person", poll_id: "any-generic-id"}, options: ['yes', 'no']}
 * @returns both question and options
 */
async function createQuestionWithOptions(payload: QuestionOptionCreateType) {
  try {
    const question = await createQuestion(payload.question);
    const optionsToSave = payload.options.map((option) => ({
      option,
      question_id: question.id,
    }));
    const savedOptions = await OptionsController.addOptions(optionsToSave);
    return { question, options: savedOptions };
  } catch (error) {
    throw new APIError({
      errors: error,
      status: status.INTERNAL_SERVER_ERROR,
      message: error.message || error,
    });
  }
}

/**
 * A Fn to edit questions
 * @param questionId The ID of the question to be edited
 * @param question New info to add
 */
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

/**
 * A Fn to delete a question given the ID
 * @param questionId The ID of the question to delete
 */
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

/**
 * A controller Fn to get a question by question ID
 * @param questionId The ID of the question you want to query
 * @returns The question from the DB
 */
async function getQuestionById(questionId: string) {
  try {
    const [question] = await sql<
      QuestionTable
    >`SELECT * FROM questions WHERE ID = ${questionId} RETURNING *`;

    if (!question) {
      throw new APIError({
        status: httpStatus.NOT_FOUND,
        message: 'Question with this ID not found',
        errors: 'Question with this ID not found',
      });
    }

    return question;
  } catch (error) {
    throw new APIError({
      errors: error,
      status: status.INTERNAL_SERVER_ERROR,
      message: error.message || error,
    });
  }
}

/**
 * A controller Fn to get all options belonging to a question
 * @param questionId The question ID
 */
async function getQuestionOptions(questionId: string) {
  try {
    const [options] = await sql<
      [OptionTable[]]
    >`SELECT * FROM options WHERE question_id = ${questionId}`;

    if (!options) {
      throw new APIError({
        status: httpStatus.NOT_FOUND,
        message: 'No options found',
        errors: 'Options not found',
      });
    }
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
  getQuestionOptions,
  getQuestionById,
  createQuestionWithOptions,
};
