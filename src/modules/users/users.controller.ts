import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import {
  InviteTeacherDto,
  UpdateUserStatusDto,
  ListUsersQueryDto,
} from './dto/create-user.dto';

/**
 * Contrôleur pour la gestion des utilisateurs
 * Endpoints admin pour inviter des enseignants et gérer les statuts
 */
@ApiTags('Admin/Users')
@Controller('admin/users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private usersService: UsersService) {}

  /**
   * Inviter un enseignant
   */
  @Post('teachers/invite')
  @Roles('ADMIN')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Inviter un enseignant',
    description:
      'Crée un compte enseignant et envoie une invitation par email',
  })
  @ApiResponse({
    status: 201,
    description: 'Enseignant invité avec succès',
    schema: {
      example: {
        utilisateurId: 'usr_789',
        email: 'prof@mail.com',
        statut: 'INVITED',
        invited: true,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Email déjà utilisé',
  })
  async inviteTeacher(@Body() dto: InviteTeacherDto) {
    return this.usersService.inviteTeacher(dto);
  }

  /**
   * Lister les utilisateurs
   */
  @Get()
  @Roles('ADMIN')
  @ApiOperation({
    summary: 'Lister les utilisateurs',
    description: 'Récupère la liste des utilisateurs avec filtres optionnels',
  })
  @ApiQuery({
    name: 'role',
    required: false,
    enum: ['ADMIN', 'ENSEIGNANT', 'PARENT'],
  })
  @ApiQuery({
    name: 'statut',
    required: false,
    enum: ['INVITED', 'ACTIVE', 'DISABLED'],
  })
  @ApiQuery({
    name: 'q',
    required: false,
    description: 'Recherche par email/prénom/nom',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des utilisateurs',
    schema: {
      example: {
        data: [
          {
            id: 'usr_123',
            email: 'prof@mail.com',
            prenom: 'Ahmed',
            nom: 'Dupont',
            role: 'ENSEIGNANT',
            statut: 'ACTIVE',
          },
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          pages: 1,
        },
      },
    },
  })
  async listUsers(@Query() query: ListUsersQueryDto) {
    return this.usersService.listUsers(query);
  }

  /**
   * Obtenir un utilisateur
   */
  @Get(':id')
  @Roles('ADMIN')
  @ApiOperation({
    summary: 'Obtenir un utilisateur',
  })
  @ApiResponse({
    status: 200,
    description: 'Utilisateur trouvé',
  })
  @ApiResponse({
    status: 404,
    description: 'Utilisateur non trouvé',
  })
  async findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  /**
   * Mettre à jour le statut d'un utilisateur
   */
  @Patch(':id/status')
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Mettre à jour le statut d\'un utilisateur',
    description: 'Activer, désactiver ou inviter un utilisateur',
  })
  @ApiResponse({
    status: 200,
    description: 'Statut mis à jour',
  })
  @ApiResponse({
    status: 404,
    description: 'Utilisateur non trouvé',
  })
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateUserStatusDto,
  ) {
    return this.usersService.updateStatus(id, dto);
  }
}

