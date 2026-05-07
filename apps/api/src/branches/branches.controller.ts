import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { BranchesService } from './branches.service';
import { CreateBranchDto, UpdateBranchDto, BranchResponseDto } from './dto/branch.dto';
import { Roles } from '../auth/decorators';
import { RolesGuard } from '../auth/guards';
import { GetCurrentUser } from '../auth/decorators';

@ApiTags('branches')
@ApiBearerAuth('access-token')
@UseGuards(RolesGuard)
@Controller('branches')
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  @ApiOperation({
    summary: 'List all branches',
    description: 'Returns all branches belonging to the authenticated user\'s organization.',
  })
  @ApiResponse({ status: 200, type: [BranchResponseDto] })
  @Roles(Role.admin, Role.supervisor)
  @Get()
  async findAll(@GetCurrentUser('organizationId') organizationId: string): Promise<BranchResponseDto[]> {
    return this.branchesService.findAll(organizationId);
  }

  @ApiOperation({
    summary: 'Get a single branch',
    description: 'Returns details of a specific branch.',
  })
  @ApiParam({ name: 'id', example: 'a3f2c1d0-4e5b-6789-abcd-ef0123456789' })
  @ApiResponse({ status: 200, type: BranchResponseDto })
  @ApiResponse({ status: 404, description: 'Branch not found.' })
  @Roles(Role.admin, Role.supervisor)
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @GetCurrentUser('organizationId') organizationId: string,
  ): Promise<BranchResponseDto> {
    return this.branchesService.findOne(id, organizationId);
  }

  @ApiOperation({
    summary: 'Create a new branch',
    description: 'Only accessible by organization admins.',
  })
  @ApiResponse({ status: 201, type: BranchResponseDto })
  @ApiResponse({ status: 409, description: 'Branch code already exists.' })
  @Roles(Role.admin)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() dto: CreateBranchDto,
    @GetCurrentUser('organizationId') organizationId: string,
  ): Promise<BranchResponseDto> {
    return this.branchesService.create(dto, organizationId);
  }

  @ApiOperation({
    summary: 'Update a branch',
    description: 'Updates branch details. Only accessible by organization admins.',
  })
  @ApiParam({ name: 'id', example: 'a3f2c1d0-4e5b-6789-abcd-ef0123456789' })
  @ApiResponse({ status: 200, type: BranchResponseDto })
  @Roles(Role.admin)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateBranchDto,
    @GetCurrentUser('organizationId') organizationId: string,
  ): Promise<BranchResponseDto> {
    return this.branchesService.update(id, dto, organizationId);
  }

  @ApiOperation({
    summary: 'Delete a branch',
    description: 'Removes a branch from the organization. Only accessible by organization admins.',
  })
  @ApiParam({ name: 'id', example: 'a3f2c1d0-4e5b-6789-abcd-ef0123456789' })
  @ApiResponse({ status: 204, description: 'Branch deleted successfully.' })
  @Roles(Role.admin)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id') id: string,
    @GetCurrentUser('organizationId') organizationId: string,
  ): Promise<void> {
    return this.branchesService.remove(id, organizationId);
  }
}
