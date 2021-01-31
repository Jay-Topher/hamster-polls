declare namespace NodeJs {
  export interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    DATABASE_URL: string;
    PORT: string;
  }
}
