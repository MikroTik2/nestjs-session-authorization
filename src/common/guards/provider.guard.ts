import { OAuthService } from "@/libs/oauth/services";
import { CanActivate, ExecutionContext, Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class AuthProviderGuard implements CanActivate {
    public constructor(private readonly oauthServuce: OAuthService) {}

    public canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();

        const provider = request.params.provider;

        const providerInstance = this.oauthServuce.findByService(provider);

        if (!providerInstance) {
            throw new NotFoundException(`Provider “${provider}” was not found. Please check the correctness of the entered data.`);
        }

        return true;
    }
}
