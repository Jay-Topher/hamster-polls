import TableCommons from './interfaceCommons';

export default interface UserTable extends TableCommons {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
}
