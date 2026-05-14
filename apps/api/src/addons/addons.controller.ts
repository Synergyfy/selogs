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
} from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { AddonsService } from './addons.service';
import { CreateAddonDto, UpdateAddonDto } from './dto';
import { PurchaseAddonDto } from './dto/purchase-addon.dto';
import { Roles, GetCurrentUser } from '../auth/decorators';
import { RolesGuard } from '../auth/guards';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Addons')
@Controller('addons')
export class AddonsController {
  constructor(private readonly addonsService: AddonsService) {}

  @Post()
  @Roles(Role.super_admin)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new addon (Super Admin only)' })
  @ApiResponse({ status: 201, description: 'Addon created successfully.' })
  create(@Body() createAddonDto: CreateAddonDto) {
    return this.addonsService.create(createAddonDto);
  }

  @Get('all')
  @Roles(Role.super_admin)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all addons (including inactive ones) (Super Admin only)' })
  findAll() {
    return this.addonsService.findAll();
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all active addons' })
  findAllActive() {
    return this.addonsService.findAllActive();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get an addon by ID' })
  @ApiResponse({ status: 200, description: 'Addon found.' })
  @ApiResponse({ status: 404, description: 'Addon not found.' })
  findOne(@Param('id') id: string) {
    return this.addonsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.super_admin)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an addon (Super Admin only)' })
  update(@Param('id') id: string, @Body() updateAddonDto: UpdateAddonDto) {
    return this.addonsService.update(id, updateAddonDto);
  }

  @Delete(':id')
  @Roles(Role.super_admin)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an addon (Super Admin only)' })
  remove(@Param('id') id: string) {
    return this.addonsService.remove(id);
  }

  @Post('purchase')
  @Roles(Role.admin)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Purchase a standalone add-on using saved payment method' })
  @ApiResponse({ status: 201, description: 'Add-on purchased successfully.' })
  purchaseAddon(
    @GetCurrentUser('organizationId') organizationId: string,
    @GetCurrentUser('email') email: string,
    @Body() dto: PurchaseAddonDto,
  ) {
    return this.addonsService.purchaseAddonStandalone(organizationId, email, dto.addonId);
  }
}
