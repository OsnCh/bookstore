"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("./common");
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        const fs = require('fs');
        const app = yield core_1.NestFactory.create(app_module_1.ApplicationModule, {
            cors: true,
            httpsOptions: {
                cert: fs.readFileSync('ca.crt'),
                key: fs.readFileSync('ca.key'),
                requestCert: false,
                rejectUnauthorized: false
            }
        });
        const port = process.env.PORT || 8080;
        const options = new swagger_1.DocumentBuilder()
            .setTitle('Books store')
            .setDescription('WebAPI for selling books and magazines')
            .setVersion('1.0')
            .addBearerAuth()
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, options);
        swagger_1.SwaggerModule.setup('swagger', app, document);
        app.useGlobalFilters(new common_1.ExceptionHandlerFilter());
        yield app.listen(port, '10.10.0.66');
    });
}
bootstrap();
//# sourceMappingURL=main.js.map