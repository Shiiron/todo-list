import { TodoTask } from "./task";

export interface List {
  ID: number;
  name: string;
  tasks?: TodoTask[];
}
