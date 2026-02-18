export interface JwtPayload {
  id: string;
  name: string;
  role: UserRole;
}

export enum UserRole {

  VETERINARIAN = 'veterinarian',
  ADMIN = 'admin'
}
