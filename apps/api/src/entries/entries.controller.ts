import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
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
  ApiParam,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { EntriesService } from './entries.service';
import {
  CreateEntryDto,
  CheckoutEntryDto,
  EntriesQueryDto,
  EntryResponseDto,
  PaginatedEntriesResponseDto,
} from './dto/entry.dto';
import { Roles } from '../auth/decorators';
import { RolesGuard } from '../auth/guards';
import { GetCurrentUser } from '../auth/decorators';

@ApiTags('entries')
@ApiBearerAuth('access-token')
@UseGuards(RolesGuard)
@Controller('entries')
export class EntriesController {
  constructor(private readonly entriesService: EntriesService) {}

  @ApiOperation({
    summary: 'List and filter vehicle entries',
    description:
      'Returns paginated list of entries. Scoped to organization and branch based on user role.',
  })
  @ApiResponse({ status: 200, type: PaginatedEntriesResponseDto })
  @Get()
  async findAll(
    @Query() query: EntriesQueryDto,
    @GetCurrentUser('organizationId') organizationId: string,
    @GetCurrentUser('role') role: Role,
    @GetCurrentUser('branchId') branchId?: string,
  ): Promise<PaginatedEntriesResponseDto> {
    return this.entriesService.findAll(query, organizationId, role, branchId);
  }

  @ApiOperation({
    summary: 'Get entry details',
  })
  @ApiParam({ name: 'id', example: 'e5f6g7h8-i9j0-k1l2-m3n4-o5p6q7r8s9t0' })
  @ApiResponse({ status: 200, type: EntryResponseDto })
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @GetCurrentUser('organizationId') organizationId: string,
  ): Promise<EntryResponseDto> {
    return this.entriesService.findOne(id, organizationId);
  }

  @ApiOperation({
    summary: 'Vehicle Check-In',
    description: 'Captures a new vehicle entry. Accessible by all roles.',
  })
  @ApiResponse({ status: 201, type: EntryResponseDto })
  @ApiResponse({ status: 409, description: 'Vehicle already inside.' })
  @Post('checkin')
  @HttpCode(HttpStatus.CREATED)
  async checkin(
    @Body() dto: CreateEntryDto,
    @GetCurrentUser('organizationId') organizationId: string,
    @GetCurrentUser('sub') userId: string,
  ): Promise<EntryResponseDto> {
    return this.entriesService.create(dto, organizationId, userId);
  }

  @ApiOperation({
    summary: 'Vehicle Check-Out',
    description: 'Marks a vehicle as exited.',
  })
  @ApiParam({ name: 'id', example: 'e5f6g7h8-i9j0-k1l2-m3n4-o5p6q7r8s9t0' })
  @ApiResponse({ status: 200, type: EntryResponseDto })
  @Patch(':id/checkout')
  async checkout(
    @Param('id') id: string,
    @Body() dto: CheckoutEntryDto,
    @GetCurrentUser('organizationId') organizationId: string,
    @GetCurrentUser('sub') userId: string,
  ): Promise<EntryResponseDto> {
    return this.entriesService.checkout(id, dto, organizationId, userId);
  }
}
