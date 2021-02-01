import TableCommons from './interfaceCommons';

export default interface PollHistoryTable extends TableCommons {
  voter_id: string;
  poll_id: string;
}
