import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ClassesService } from './classes.service';
import { CreateClasseDto } from './dto/create-classe.dto';
import { UpdateClasseDto } from './dto/update-classe.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Admin/Classes')
@Controller('admin/classes')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@ApiBearerAuth()
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new classe' })
  @ApiResponse({
    status: 201,
    description: 'Classe created successfully',
  })
  create(@Body() createClasseDto: CreateClasseDto) {
    return this.classesService.create(createClasseDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all classes' })
  @ApiResponse({
    status: 200,
    description: 'List of all classes',
  })
  findAll() {
    return this.classesService.findAll();
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Get classe statistics' })
  @ApiResponse({
    status: 200,
    description: 'Classe statistics including occupancy',
  })
  getStats(@Param('id') id: string) {
    return this.classesService.getClasseStats(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a classe by ID' })
  @ApiResponse({
    status: 200,
    description: 'Classe details',
  })
  @ApiResponse({
    status: 404,
    description: 'Classe not found',
  })
  findOne(@Param('id') id: string) {
    return this.classesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a classe' })
  @ApiResponse({
    status: 200,
    description: 'Classe updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Classe not found',
  })
  update(@Param('id') id: string, @Body() updateClasseDto: UpdateClasseDto) {
    return this.classesService.update(id, updateClasseDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a classe' })
  @ApiResponse({
    status: 204,
    description: 'Classe deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Classe not found',
  })
  remove(@Param('id') id: string) {
    return this.classesService.remove(id);
  }

  /**
   * Récupérer tous les enfants d'une classe avec leur statut de présence
   */
  @Get(':classeId/enfants')
  @ApiOperation({
    summary: 'Récupérer les enfants d\'une classe avec statut de présence',
    description: 'Liste tous les enfants inscrits dans une classe avec leur statut de présence du jour',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des enfants avec statut de présence',
    schema: {
      example: {
        classeId: 'cls_1',
        classeNom: 'Petite Section',
        date: '2025-11-09',
        enfants: [
          {
            id: 'enf_1',
            prenom: 'Alice',
            nom: 'Dupont',
            dateNaissance: '2022-05-15',
            presence: {
              id: 'pres_1',
              statut: 'Present',
              arriveeA: '08:30',
              departA: '17:00',
            },
          },
        ],
      },
    },
  })
  async getChildrenWithPresence(
    @Param('classeId') classeId: string,
    @Req() req: any,
  ) {
    return this.classesService.getChildrenWithPresence(classeId);
  }

  /**
   * Assigner un enseignant à une classe
   */
  @Post(':classeId/enseignants/:enseignantId')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Assigner un enseignant à une classe',
    description: 'Crée une relation entre un enseignant et une classe',
  })
  @ApiResponse({
    status: 201,
    description: 'Enseignant assigné avec succès',
    schema: {
      example: {
        id: 'ec_1',
        enseignantId: 'ens_1',
        classeId: 'cls_1',
        dateDebut: '2025-11-09',
        enseignant: {
          id: 'ens_1',
          utilisateur: {
            prenom: 'Ahmed',
            nom: 'Dupont',
            email: 'ahmed@mail.com',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Enseignant déjà assigné à cette classe',
  })
  async assignTeacherToClass(
    @Param('classeId') classeId: string,
    @Param('enseignantId') enseignantId: string,
    @Req() req: any,
  ) {
    return this.classesService.assignTeacherToClass(classeId, enseignantId);
  }

  /**
   * Retirer un enseignant d'une classe
   */
  @Delete(':classeId/enseignants/:enseignantId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Retirer un enseignant d\'une classe',
    description: 'Supprime la relation entre un enseignant et une classe',
  })
  @ApiResponse({
    status: 204,
    description: 'Enseignant retiré avec succès',
  })
  async removeTeacherFromClass(
    @Param('classeId') classeId: string,
    @Param('enseignantId') enseignantId: string,
    @Req() req: any,
  ) {
    return this.classesService.removeTeacherFromClass(classeId, enseignantId);
  }
}
