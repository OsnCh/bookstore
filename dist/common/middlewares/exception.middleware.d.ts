import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
export declare class ExceptionHandlerFilter implements ExceptionFilter {
    catch(error: Error, host: ArgumentsHost): any;
}
