export interface JwtPayload {
  id: string;
  name: string;
  role: UserRole;
}

export enum UserRole {
  CLIENT = 'client',
  VETERINARIAN = 'veterinarian',
  ADMIN = 'admin'
}
