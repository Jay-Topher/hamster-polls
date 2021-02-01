import TableCommons, { TimeStamp } from './interfaceCommons';

export default interface VotesTable extends TableCommons {
  option_id: string;
  voter_id: string;
  voted_at: TimeStamp;
}
