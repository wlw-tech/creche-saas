import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
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
  CreateUserDto,
  InviteTeacherDto,
  UpdateUserStatusDto,
  ListUsersQueryDto,
  AssignTeacherToClassDto,
} from './dto/create-user.dto';

/**
 * Contrôleur pour la gestion des utilisateurs
 * Endpoints admin pour inviter des enseignants et gérer les statuts
 */
@ApiTags('Admin/Users')
@Controller('admin/users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@ApiBearerAuth()
export class UsersController {
  constructor(private usersService: UsersService) {}

  /**
   * Créer un utilisateur (enseignant ou parent)
   */
  @Post()
  @Roles('ADMIN')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Créer un utilisateur',
    description:
      'Crée un compte utilisateur (enseignant ou parent) et envoie une invitation par email',
  })
  @ApiResponse({
    status: 201,
    description: 'Utilisateur créé avec succès',
    schema: {
      example: {
        utilisateurId: 'usr_789',
        email: 'prof@mail.com',
        role: 'ENSEIGNANT',
        statut: 'INVITED',
        invited: true,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Email déjà utilisé ou données invalides',
  })
  async createUser(@Body() dto: CreateUserDto) {
    return this.usersService.createUser(dto);
  }

  /**
   * Inviter un enseignant (legacy)
   */
  @Post('teachers/invite')
  @Roles('ADMIN')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Inviter un enseignant',
    description:
      'Crée un compte enseignant et envoie une invitation par email (legacy)',
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

  /**
   * Assigner un enseignant à une classe
   */
  @Post('teachers/:utilisateurId/assign-class')
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Assigner un enseignant à une classe',
    description: 'Assigne un enseignant à une classe pour qu\'il puisse enregistrer les présences',
  })
  @ApiResponse({
    status: 200,
    description: 'Enseignant assigné à la classe avec succès',
    schema: {
      example: {
        message: 'Enseignant assigné à la classe avec succès',
        enseignantId: 'ens_123',
        utilisateurId: 'usr_456',
        classeId: 'cls_789',
        classe: {
          id: 'cls_789',
          nom: 'Petite Section',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'L\'utilisateur n\'est pas un enseignant',
  })
  @ApiResponse({
    status: 404,
    description: 'Utilisateur ou classe non trouvé',
  })
  async assignTeacherToClass(
    @Param('utilisateurId') utilisateurId: string,
    @Body() dto: AssignTeacherToClassDto,
  ) {
    return this.usersService.assignTeacherToClass(utilisateurId, dto.classeId);
  }

  /**
   * Supprimer un utilisateur
   */
  @Delete(':id')
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Supprimer un utilisateur',
    description: 'Supprime un utilisateur (enseignant ou parent)',
  })
  @ApiResponse({
    status: 200,
    description: 'Utilisateur supprimé avec succès',
    schema: {
      example: {
        message: 'Utilisateur supprimé avec succès',
        id: 'usr_123',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Utilisateur non trouvé',
  })
  async deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}

