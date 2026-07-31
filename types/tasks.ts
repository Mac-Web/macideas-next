export interface TaskType {
  text: string;
  due?: Date;
  tags?: TagType[];
  starred?: boolean;
}

export interface TagType {
  text: string;
  icon?: string;
}
