import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

export class CreateClassDailySummaryDto {
  @IsString()
  @IsNotEmpty()
  classeId: string;

  @IsString()
  @IsNotEmpty()
  date: string; // Format: YYYY-MM-DD

  @IsString()
  @IsNotEmpty()
  activites: string;

  @IsString()
  @IsNotEmpty()
  apprentissages: string;

  @IsString()
  @IsNotEmpty()
  humeurGroupe: string;

  @IsString()
  @IsOptional()
  observations?: string;
}

export class UpdateClassDailySummaryDto {
  @IsString()
  @IsOptional()
  activites?: string;

  @IsString()
  @IsOptional()
  apprentissages?: string;

  @IsString()
  @IsOptional()
  humeurGroupe?: string;

  @IsString()
  @IsOptional()
  observations?: string;
}

export class PublishClassDailySummaryDto {
  // Pas de paramètres, juste pour publier
}

export class ClassDailySummaryResponseDto {
  id: string;
  classeId: string;
  classeNom: string;
  date: string;
  activites: string;
  apprentissages: string;
  humeurGroupe: string;
  observations?: string;
  statut: 'Brouillon' | 'Publie';
  creePar: string;
  creeLe: string;
  modifieLe: string;
  publieLe?: string;
}

export class GetClassDailySummariesQueryDto {
  page?: number = 1;
  pageSize?: number = 25;
  date?: string;
  dateMin?: string;
  dateMax?: string;
  statut?: 'Brouillon' | 'Publie';
  classeId?: string;
}

