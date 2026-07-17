import { IsIn } from 'class-validator';

export class AccessScopeDto {
  @IsIn(['everyone', 'private'])
  accessScope: 'everyone' | 'private';
}

