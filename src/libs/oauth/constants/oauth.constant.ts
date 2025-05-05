import { FactoryProvider, ModuleMetadata } from "@nestjs/common";
import { BaseOAuthService } from "../providers";

export const ProviderOptionsSymbol = Symbol();

export interface TypeOptions {
    baseUrl: string;
    services: BaseOAuthService[];
}

export type TypeAsyncOptions = Pick<ModuleMetadata, "imports"> & Pick<FactoryProvider<TypeOptions>, "useFactory" | "inject">;
