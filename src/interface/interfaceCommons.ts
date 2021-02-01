export interface TimeStamp {
  type: String;
  notNull: boolean;
  default: () => void;
}

export default interface TableCommons {
  id: string;
  created_at: TimeStamp;
  updated_at?: TimeStamp;
  deleted_at?: TimeStamp;
}
