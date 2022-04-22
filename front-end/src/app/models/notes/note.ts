import {Specialty, User} from "../user";

export abstract class Note {
  public id: number;
  public header: string;
  public content: string;
  public date: number;
  public user: User;

  constructor(header?: string, content?: string) {
    this.header = header;
    this.content = content;
  }

  public getDate(): Date {
    return new Date(this.date);
  }

  public abstract getListOfSpecialties(): Specialty[];
  public abstract getPath(): string;
  public abstract getParentID(): string;
  public abstract getIdentifier(): string | number;
  public abstract getEmpty(): Object;
}
