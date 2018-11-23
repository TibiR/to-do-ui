export interface ToDoItem {
  name: string;
  id?: number;
  description: string;
  date: Date;
  done: Boolean;
  updatable?: Boolean;
  time?: string;
}