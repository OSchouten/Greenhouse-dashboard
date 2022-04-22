import {User} from "./user";

export class Team {
  public readonly id: number;
  public teamName: string;
  public users: User[];

  constructor(team: number | Team, teamName?: string) {
    if (typeof team === "number") {
      this.id = team;
      if (teamName === undefined) teamName = "";
      this.teamName = teamName;
      return;
    }

    this.id = team.id;
    this.teamName = team.teamName;
    if (team.users !== undefined) this.users = team.users;
  }

  public addMember(member: User) {
    //adds the team member to the team and returns true if the team member has been added
    if (!this.users.includes(member)) {
      this.users.push(member);
      member.teamId = this.id;
      return true;
    } else return false;
  }

  public deleteMember(member: User) {
    //deletes the team member from the team and returns true if the team member has been deleted
    if (this.users.includes(member)) {
      const index = this.users.indexOf(member);
      this.users.splice(index, 1);
      return true;
    } else return false;
  }
}
