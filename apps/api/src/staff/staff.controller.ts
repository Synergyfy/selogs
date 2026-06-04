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
import { StaffService } from './staff.service';
import {
  CreateStaffDto,
  UpdateStaffDto,
  StaffResponseDto,
  StaffCheckInDto,
  ShiftResponseDto,
} from './dto/staff.dto';
import { Roles, Public, GetCurrentUser } from '../auth/decorators';
import { RolesGuard } from '../auth/guards';
import { Capability } from '../common/capabilities';

@ApiTags('staff')
@ApiBearerAuth('access-token')
@UseGuards(RolesGuard)
@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Public()
  @ApiOperation({ summary: 'List active staff members publicly for device login/pairing' })
  @ApiResponse({ status: 200, type: [StaffResponseDto] })
  @Get('public/:orgId')
  async findActiveStaffPublic(@Param('orgId') orgId: string): Promise<StaffResponseDto[]> {
    return this.staffService.findActiveStaffPublic(orgId);
  }

  @ApiOperation({ summary: 'Create a new staff member (Admin only)' })
  @ApiResponse({ status: 201, type: StaffResponseDto })
  @Capability('staff:create')
  @Roles(Role.admin)
  @Post()
  async create(
    @Body() dto: CreateStaffDto,
    @GetCurrentUser('organizationId') organizationId: string,
  ): Promise<StaffResponseDto> {
    return this.staffService.create(dto, organizationId);
  }

  @ApiOperation({ summary: 'List all staff members' })
  @ApiResponse({ status: 200, type: [StaffResponseDto] })
  @Roles(Role.admin, Role.supervisor)
  @Get()
  async findAll(
    @GetCurrentUser('organizationId') organizationId: string,
  ): Promise<StaffResponseDto[]> {
    return this.staffService.findAll(organizationId);
  }

  @ApiOperation({ summary: 'Staff Shift Check-In' })
  @ApiResponse({ status: 201, type: ShiftResponseDto })
  @Post('checkin')
  @HttpCode(HttpStatus.CREATED)
  async checkIn(
    @Body() dto: StaffCheckInDto,
    @GetCurrentUser('organizationId') organizationId: string,
  ): Promise<ShiftResponseDto> {
    return this.staffService.checkIn(dto, organizationId);
  }

  @ApiOperation({ summary: 'Staff Shift Check-Out' })
  @ApiParam({ name: 'staffId', example: 'S12345' })
  @ApiResponse({ status: 200, type: ShiftResponseDto })
  @Post('checkout/:staffId')
  @HttpCode(HttpStatus.OK)
  async checkOut(
    @Param('staffId') staffId: string,
    @GetCurrentUser('organizationId') organizationId: string,
  ): Promise<ShiftResponseDto> {
    return this.staffService.checkOut(staffId, organizationId);
  }

  @ApiOperation({ summary: 'Get shift history logs' })
  @ApiResponse({ status: 200, type: [ShiftResponseDto] })
  @Roles(Role.admin, Role.supervisor)
  @Get('shifts')
  async getShifts(
    @GetCurrentUser('organizationId') organizationId: string,
  ): Promise<ShiftResponseDto[]> {
    return this.staffService.getShiftHistory(organizationId);
  }

  @ApiOperation({ summary: 'Update staff member (Admin only)' })
  @ApiResponse({ status: 200, type: StaffResponseDto })
  @Roles(Role.admin)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateStaffDto,
    @GetCurrentUser('organizationId') organizationId: string,
  ): Promise<StaffResponseDto> {
    return this.staffService.update(id, dto, organizationId);
  }

  @ApiOperation({ summary: 'Delete staff member (Admin only)' })
  @ApiResponse({ status: 204 })
  @Roles(Role.admin)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id') id: string,
    @GetCurrentUser('organizationId') organizationId: string,
  ): Promise<void> {
    return this.staffService.remove(id, organizationId);
  }
}
