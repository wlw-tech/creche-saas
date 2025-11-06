import { ApiProperty } from '@nestjs/swagger';
import { StatutPresence } from '@prisma/client';

export class ClassePresenceDto {
  @ApiProperty({ example: 'cls_1' })
  id: string;

  @ApiProperty({ example: 'Petite Section' })
  nom: string;
}

export class EnfantPresenceDto {
  @ApiProperty({ example: 'enf_1' })
  id: string;

  @ApiProperty({ example: 'Lina' })
  prenom: string;

  @ApiProperty({ example: 'Ait' })
  nom: string;

  @ApiProperty({ type: ClassePresenceDto })
  classe?: ClassePresenceDto;
}

export class PresenceItemDto {
  @ApiProperty({ example: 'prs_1' })
  id: string;

  @ApiProperty({ example: '2025-11-06' })
  date: string;

  @ApiProperty({ example: 'Present', enum: ['Present', 'Absent', 'Justifie'] })
  statut: StatutPresence;

  @ApiProperty({ type: EnfantPresenceDto })
  enfant: EnfantPresenceDto;

  @ApiProperty({ example: '09:00', required: false })
  arriveeA?: string;

  @ApiProperty({ example: '16:30', required: false })
  departA?: string;
}

export class GetPresencesResponseDto {
  @ApiProperty({ type: [PresenceItemDto] })
  items: PresenceItemDto[];

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 25 })
  pageSize: number;

  @ApiProperty({ example: 120 })
  total: number;

  @ApiProperty({ example: true })
  hasNext: boolean;
}

