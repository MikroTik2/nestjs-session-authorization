import { PrismaService } from "@/libs/prisma/services";
import { Injectable, NotFoundException } from "@nestjs/common";
import { UpdateUserDto } from "../dtos";
import { AuthMethod } from "@prisma/client";
import { PasswordService } from "@/libs/security/services";

@Injectable()
export class UserService {
    public constructor(
        private readonly prisma: PrismaService,
        private readonly passwordService: PasswordService,
    ) {}

    public async create(email: string, password: string, displayName: string, picture: string, method: AuthMethod, isVerified: boolean) {
        const user = await this.prisma.user.create({
            data: {
                email,
                password: password ? await this.passwordService.scryptHash(password) : "",
                displayName,
                picture,
                method,
                isVerified,
            },
            include: {
                account: true,
            },
        });

        return user;
    }

    public async findById(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: {
                account: true,
            },
        });

        if (!user) {
            throw new NotFoundException("User not found. Please check the entered data.");
        }

        return user;
    }

    public async findByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: { email },
            include: {
                account: true,
            },
        });
    }

    public async update(id: string, dto: UpdateUserDto) {
        const user = await this.findById(id);

        return this.prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                email: dto.email,
                displayName: dto.name,
                isTwoFactorEnabled: dto.isTwoFactorEnabled,
            },
        });
    }

    public async delete(id: string) {
        const user = await this.findById(id);

        return this.prisma.user.delete({
            where: { id: user.id },
        });
    }
}
