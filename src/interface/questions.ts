import TableCommons from './interfaceCommons';

export default interface QuestionTable extends TableCommons {
  question: string;
  poll_id: string;
}
