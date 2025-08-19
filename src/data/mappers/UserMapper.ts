import { User } from '@/src/domain/entities/User';
import { UserDto } from '@/src/data/dtos/UserDto';

export const mapUserDtoToUser = (dto: UserDto): User => ({
  id: dto.id,
  name: dto.name,
  username: dto.username,
  email: dto.email,
});

export const mapUserDtosToUsers = (dtos: UserDto[]): User[] => dtos.map(mapUserDtoToUser); 