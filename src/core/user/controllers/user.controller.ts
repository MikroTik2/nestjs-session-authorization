import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch } from "@nestjs/common";
import { UserRole } from "@prisma/client";
import { UserService } from "../services";
import { Authorization, Authorized, Serialize } from "@/common/decorators";
import { ResponseUserDto, UpdateUserDto } from "../dtos";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("Users")
@Controller("users")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Authorization(UserRole.ADMIN)
    @HttpCode(HttpStatus.OK)
    @Get("by-id/:id")
    @Serialize(ResponseUserDto)
    @ApiOperation({ summary: "Get user by ID (admin only)", description: "Allows an administrator to retrieve user details by their ID." })
    @ApiResponse({ status: HttpStatus.OK, description: "User details retrieved successfully." })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden. Admin access required." })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized." })
    public async findById(@Param("id") id: string) {
        return this.userService.findById(id);
    }

    @Authorization()
    @HttpCode(HttpStatus.OK)
    @Get("profile")
    @Serialize(ResponseUserDto)
    @ApiOperation({ summary: "Get current user profile", description: "Returns the profile data of the currently authenticated user." })
    @ApiResponse({ status: 200, description: "User profile retrieved successfully." })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized." })
    public async findProfile(@Authorized("id") userId: string) {
        return this.userService.findById(userId);
    }

    @Authorization()
    @HttpCode(HttpStatus.OK)
    @Patch("profile")
    @Serialize(ResponseUserDto)
    @ApiOperation({ summary: "Update current user profile", description: "Updates the profile information of the currently authenticated user." })
    @ApiResponse({ status: HttpStatus.OK, description: "User profile updated successfully." })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Invalid input data." })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "Unauthorized." })
    public async updateProfile(@Authorized("id") userId: string, @Body() dto: UpdateUserDto) {
        return this.userService.update(userId, dto);
    }
}
