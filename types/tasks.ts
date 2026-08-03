export interface TaskType {
  text: string;
  start?: Date;
  due?: Date;
  tags?: string[];
  starred?: boolean;
}

export interface TagType {
  text: string;
  emoji?: string;
}
