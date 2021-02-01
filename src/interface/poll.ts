import TableCommons from './interfaceCommons';

export default interface PollTable extends TableCommons {
  title: string;
  description: string;
  author_id: string;
  published: boolean;
}
