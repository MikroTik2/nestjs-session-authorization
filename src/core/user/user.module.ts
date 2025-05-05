import { Module } from "@nestjs/common";
import { UserController } from "./controllers";
import { UserService } from "./services";
import { PasswordService } from "@/libs/security/services";

@Module({
    controllers: [UserController],
    providers: [UserService, PasswordService],
    exports: [UserService],
})
export class UserModule {}
