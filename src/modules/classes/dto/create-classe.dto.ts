import { IsString, IsInt, IsOptional, IsBoolean, Min, Max } from 'class-validator';

export class CreateClasseDto {
  @IsString()
  nom: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  capacite?: number;

  @IsOptional()
  @IsString()
  trancheAge?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

