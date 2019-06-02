"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const application_exception_1 = require("../exceptions/application.exception");
const environments_1 = require("../environments");
let ExceptionHandlerFilter = class ExceptionHandlerFilter {
    catch(error, host) {
        let response = host.switchToHttp().getResponse();
        if (error instanceof common_1.HttpException) {
            return response.status(error.getStatus()).send(error.message.message);
        }
        let status = (error instanceof application_exception_1.ApplicationException) ?
            common_1.HttpStatus.BAD_REQUEST : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        if (status === common_1.HttpStatus.BAD_REQUEST)
            return response.status(status).send(error.message);
        if (status === common_1.HttpStatus.INTERNAL_SERVER_ERROR) {
            if (process.env.NODE_ENV == environments_1.Environments.Production.toString()) {
                console.error(error.stack);
                return response.status(status).send('Internal Server Error!');
            }
            else {
                return response.status(status).send(error.message);
            }
        }
    }
};
ExceptionHandlerFilter = __decorate([
    common_1.Catch()
], ExceptionHandlerFilter);
exports.ExceptionHandlerFilter = ExceptionHandlerFilter;
//# sourceMappingURL=exception.middleware.js.map