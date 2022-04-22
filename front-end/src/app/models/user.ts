export class User {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  specialty: Specialty;
  teamId: number;

  constructor(id?: number, email?: string, password?: string, firstName?: string, lastName?: string, specialty?: Specialty, teamId?: number) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.specialty = specialty;
    this.teamId = teamId;
  };

  static copyConstructor(user: User): User {
    return Object.assign(new User(), user);
    // return Object.assign(new User(user.id, user.email, user.password, user.firstName, user.lastName, user.specialty, user.teamId), user);
  }

  getId(): number {
    return this.id;
  }

  getEmail(): string {
    return this.email;
  }

  getPassword(): string {
    return this.password;
  }

  getFirstName(): string {
    return this.firstName;
  }

  getLastName(): string {
    return this.lastName;
  }

  getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  getSpecialty(): Specialty {
    return this.specialty;
  }

  getTeamId(): number {
    return this.teamId;
  }
}

export enum Specialty {
  agronomy = "Agronomy",
  botany = "Botany",
  geology = "Geology",
  hydrology = "Hydrology",
  climateScience = "Climate Science",
  administrator = "Admin"
}
