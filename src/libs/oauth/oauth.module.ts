import { DynamicModule, Module } from "@nestjs/common";
import { ProviderOptionsSymbol, TypeAsyncOptions, TypeOptions } from "./constants";
import { OAuthService } from "./services";

@Module({})
export class OAutModule {
    public static register(options: TypeOptions): DynamicModule {
        return {
            module: OAutModule,
            providers: [
                {
                    useValue: options.services,
                    provide: ProviderOptionsSymbol,
                },
                OAuthService,
            ],
            exports: [OAuthService],
        };
    }

    public static registerAsync(options: TypeAsyncOptions): DynamicModule {
        return {
            module: OAutModule,
            imports: options.imports,
            providers: [
                {
                    useFactory: options.useFactory,
                    provide: ProviderOptionsSymbol,
                    inject: options.inject,
                },
                OAuthService,
            ],
            exports: [OAuthService],
        };
    }
}
