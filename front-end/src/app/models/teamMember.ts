export class TeamMember {
  private _teamNumber: number;
  private _firstName: string;
  private _lastName: string;
  private _specialty: string;
  private _email: string;
  private _biography: string;
  private _profilePicture: string;

  constructor(teamNumber: number, firstName: string, lastName: string, specialty: string, email: string,
              biography: string, profilePicture: string) {
    this._teamNumber = teamNumber;
    this._firstName = firstName;
    this._lastName = lastName;
    this._specialty = specialty;
    this._email = email;
    this._biography = biography;
    this._profilePicture = profilePicture;
  }

  get teamNumber(): number {
    return this._teamNumber;
  }

  get firstName(): string {
    return this._firstName;
  }

  get lastName(): string {
    return this._lastName;
  }

  get specialty(): string {
    return this._specialty;
  }

  get email(): string {
    return this._email;
  }

  get biography(): string {
    return this._biography;
  }

  get profilePicture(): string {
    return this._profilePicture;
  }


  set teamNumber(value: number) {
    this._teamNumber = value;
  }

  set firstName(value: string) {
    this._firstName = value;
  }

  set lastName(value: string) {
    this._lastName = value;
  }

  set specialty(value: string) {
    this._specialty = value;
  }

  set email(value: string) {
    this._email = value;
  }

  set biography(value: string) {
    this._biography = value;
  }

  set profilePicture(value: string) {
    this._profilePicture = value;
  }
}
