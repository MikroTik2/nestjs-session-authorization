import { Expose, Type } from "class-transformer";
import { ResponseUserDto } from "@/core/user/dtos";

export class AuthResponseDto {
    @Expose()
    @Type(() => ResponseUserDto)
    user: ResponseUserDto;

    @Expose()
    message: string;
}
