import { Module } from "@nestjs/common";
import { PasswordService } from "./services";

@Module({
    providers: [PasswordService],
    exports: [PasswordService],
})
export class SecurityModule {}
