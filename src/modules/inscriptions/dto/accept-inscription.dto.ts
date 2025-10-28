import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO pour accepter une inscription
 */
export class AcceptInscriptionDto {
  @ApiProperty({
    example: 'Inscription acceptée',
    description: 'Notes optionnelles',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}

/**
 * DTO pour rejeter une inscription
 */
export class RejectInscriptionDto {
  @ApiProperty({
    example: 'Capacité atteinte',
    description: 'Raison du rejet',
    required: false,
  })
  @IsOptional()
  @IsString()
  raison?: string;
}

/**
 * Réponse d'acceptation d'inscription
 */
export class AcceptInscriptionResponseDto {
  @ApiProperty({
    example: 'insc_123',
    description: 'ID de l\'inscription',
  })
  inscriptionId: string;

  @ApiProperty({
    example: 'Actif',
    description: 'Nouveau statut',
  })
  statut: string;

  @ApiProperty({
    example: 'fam_123',
    description: 'ID de la famille',
  })
  familleId: string;

  @ApiProperty({
    example: 'enf_123',
    description: 'ID de l\'enfant',
  })
  enfantId: string;

  @ApiProperty({
    description: 'Détails des tuteurs et invitations',
    example: [
      {
        tuteurId: 't1',
        email: 'p1@mail.com',
        invite: 'sent',
        utilisateurId: 'u1',
      },
      {
        tuteurId: 't2',
        email: 'p2@mail.com',
        invite: 'missing_email',
      },
    ],
  })
  tuteurs: Array<{
    tuteurId: string;
    email?: string;
    invite: 'sent' | 'missing_email' | 'error';
    utilisateurId?: string;
  }>;
}

