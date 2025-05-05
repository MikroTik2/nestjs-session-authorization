import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { ProviderOptionsSymbol, TypeOptions } from "../constants";
import { BaseOAuthService } from "../providers";

@Injectable()
export class OAuthService implements OnModuleInit {
    public constructor(@Inject(ProviderOptionsSymbol) private readonly options: TypeOptions) {}

    public onModuleInit() {
        for (const provider of this.options.services) {
            provider.baseUrl = this.options.baseUrl;
        }
    }

    public findByService(service: string): BaseOAuthService | null {
        return this.options.services.find(s => s.name === service) ?? null;
    }
}
