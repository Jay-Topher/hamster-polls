import TableCommons, { TimeStamp } from './interfaceCommons';

export default interface VotesTable extends TableCommons {
  question_id: string;
  option_id: string;
  voter_id: string;
  voted_at: TimeStamp;
}
