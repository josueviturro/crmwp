import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { AdminGuard } from '../auth/admin.guard.js';
import { CurrentUser, type AuthenticatedUser } from '../auth/current-user.decorator.js';
import { TeamService } from './team.service.js';
import { InviteMemberDto } from './dto/invite-member.dto.js';
import { UpdateRoleDto } from './dto/update-role.dto.js';

@UseGuards(JwtAuthGuard)
@Controller('team')
export class TeamController {
  constructor(private teamService: TeamService) {}

  @Get()
  list(@CurrentUser() user: AuthenticatedUser) {
    return this.teamService.listMembers(user.tenantId);
  }

  @UseGuards(AdminGuard)
  @Post('invite')
  invite(@CurrentUser() user: AuthenticatedUser, @Body() dto: InviteMemberDto) {
    return this.teamService.inviteMember(user.tenantId, dto);
  }

  @UseGuards(AdminGuard)
  @Patch(':userId/role')
  updateRole(@CurrentUser() user: AuthenticatedUser, @Param('userId') userId: string, @Body() dto: UpdateRoleDto) {
    return this.teamService.updateRole(user.tenantId, userId, dto.role);
  }

  @UseGuards(AdminGuard)
  @Delete(':userId')
  remove(@CurrentUser() user: AuthenticatedUser, @Param('userId') userId: string) {
    return this.teamService.removeMember(user.tenantId, userId, user.userId);
  }
}
