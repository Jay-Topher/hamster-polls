interface JwtPayload {
  id: string;
  username: string;
  email: string;
}

interface UserType {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  username: string;
}

interface UserLoginType {
  username: string;
  password: string;
}

interface LoggedInUserType {
  id: string;
  email: string;
  username: string;
  password: string;
}

interface PollType {
  title: string;
  description?: string;
  author_id: string;
}

interface QuestionCreateType {
  question: string;
  poll_id: string;
}
