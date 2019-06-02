import "reflect-metadata";
import { NestModule, MiddlewareConsumer } from '@nestjs/common';
export declare class ApplicationModule implements NestModule {
    configure(consumer: MiddlewareConsumer): void;
}
