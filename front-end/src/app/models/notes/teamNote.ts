import {Team} from '../team';
import {Specialty} from "../user";
import {Note} from "./note";

export class TeamNote extends Note {
  public get isPublic(): boolean {
    return this.public;
  }

  public set isPublic(aPublic: boolean) {
    this.public = aPublic;
  }

  public public: boolean;
  public specialties: Specialty[] = [];
  public team: Team;

  public static readonly path = "team";

  public getPath(): string {
    return TeamNote.path;
  }

  public getParentID(): string {
    return this.team.id.toString();
  }

  public getIdentifier(): string | number {
    return this.team.id;
  }

  public getListOfSpecialties(): Specialty[] {
    return [...this.specialties];
  }

  public static getEmpty(): TeamNote {
    return new TeamNote()
  }

  public getEmpty(): TeamNote {
    return TeamNote.getEmpty();
  }
}
