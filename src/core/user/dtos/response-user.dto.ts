import { Expose } from "class-transformer";
import { UserRole, AuthMethod } from "@prisma/client";

export class ResponseUserDto {
    @Expose()
    id: string;

    @Expose()
    displayName: string;

    @Expose()
    email: string;

    @Expose()
    isVerified: boolean;

    @Expose()
    isTwoFactorEnabled: boolean;

    @Expose()
    role: UserRole;

    @Expose()
    method: AuthMethod;

    @Expose()
    picture: string;

    @Expose()
    createdAt: Date;

    @Expose()
    updatedAt: Date;
}
