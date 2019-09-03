import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, HttpException } from '@nestjs/common';
import { ApplicationException } from '../exceptions/application.exception';
import { Environments } from '../environments';

@Catch()
export class ExceptionHandlerFilter implements ExceptionFilter  {

    catch(error: Error, host: ArgumentsHost) {
        let response = host.switchToHttp().getResponse()
        if (error instanceof HttpException) {
            return response.status(error.getStatus()).send(error.message.message)
        }
        let status = (error instanceof ApplicationException) ?
            HttpStatus.BAD_REQUEST : HttpStatus.INTERNAL_SERVER_ERROR;

        if (status === HttpStatus.BAD_REQUEST)
            return response.status(status).send(error.message)
        if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
            if (process.env.NODE_ENV == Environments.Production.toString()) {
                const logger = require('logzio-nodejs').createLogger({
                    token: 'NmWSLQCArMEIRiuYUmFlRSpuYOoeRRcb',
                    type: error.constructor.name
                });
                logger.log({ 
                    message: error.message, 
                    stack: error.stack,
                    timestamp: new Date().toISOString(),
                    path: response.url
                });
                console.error(error.stack);
            }
            return response.status(status).send((error.message)? error.message:'Internal Server Error!')
        }
    }
}