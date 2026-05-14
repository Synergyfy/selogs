import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { GatesService } from './gates.service';
import { CreateGateDto, UpdateGateDto, GateResponseDto } from './dto/gate.dto';
import { GetCurrentUser, Roles } from '../auth/decorators';
import { RolesGuard } from '../auth/guards';
import { Capability } from '../common/capabilities';

@ApiTags('gates')
@ApiBearerAuth('access-token')
@UseGuards(RolesGuard)
@Controller('gates')
export class GatesController {
  constructor(private readonly gatesService: GatesService) {}

  @Post()
  @Capability('gate:create')
  @Roles(Role.admin, Role.super_admin)
  @ApiOperation({ summary: 'Create a new gate' })
  @ApiResponse({
    status: 201,
    description: 'The gate has been successfully created.',
    type: GateResponseDto,
  })
  async create(
    @Body() createGateDto: CreateGateDto,
    @GetCurrentUser('organizationId') organizationId: string,
  ): Promise<GateResponseDto> {
    return this.gatesService.create(createGateDto, organizationId);
  }

  @Get()
  @Roles(Role.admin, Role.supervisor, Role.super_admin)
  @ApiOperation({ summary: 'Get all gates' })
  @ApiResponse({
    status: 200,
    description: 'List of all gates.',
    type: [GateResponseDto],
  })
  async findAll(
    @GetCurrentUser('organizationId') organizationId: string,
  ): Promise<GateResponseDto[]> {
    return this.gatesService.findAll(organizationId);
  }

  @Get(':id')
  @Roles(Role.admin, Role.supervisor, Role.super_admin)
  @ApiOperation({ summary: 'Get a specific gate by id' })
  @ApiResponse({
    status: 200,
    description: 'The found gate.',
    type: GateResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Gate not found.' })
  async findOne(
    @Param('id') id: string,
    @GetCurrentUser('organizationId') organizationId: string,
  ): Promise<GateResponseDto> {
    return this.gatesService.findOne(id, organizationId);
  }

  @Patch(':id')
  @Roles(Role.admin, Role.super_admin)
  @ApiOperation({ summary: 'Update a gate' })
  @ApiResponse({
    status: 200,
    description: 'The gate has been successfully updated.',
    type: GateResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Gate not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateGateDto: UpdateGateDto,
    @GetCurrentUser('organizationId') organizationId: string,
  ): Promise<GateResponseDto> {
    return this.gatesService.update(id, updateGateDto, organizationId);
  }

  @Delete(':id')
  @Roles(Role.admin, Role.super_admin)
  @ApiOperation({ summary: 'Delete a gate' })
  @ApiResponse({
    status: 200,
    description: 'The gate has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Gate not found.' })
  async remove(
    @Param('id') id: string,
    @GetCurrentUser('organizationId') organizationId: string,
  ): Promise<void> {
    return this.gatesService.remove(id, organizationId);
  }
}
