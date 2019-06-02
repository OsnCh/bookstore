"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const services_1 = require("../services");
const models_1 = require("../models");
const swagger_1 = require("@nestjs/swagger");
const signIn_model_1 = require("src/models/auth/signIn.model");
const common_2 = require("src/common");
const roles_guard_1 = require("src/common/guards/roles.guard");
const entities_1 = require("src/entities");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    signIn(model) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.authService.signIn(model);
        });
    }
    signUp(model) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.authService.signIn(model);
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.authService.getAll();
        });
    }
};
__decorate([
    common_1.Post('signIn'),
    swagger_1.ApiOkResponse({ type: models_1.TokenAuthModel }),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [signIn_model_1.SignInAuthModel]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signIn", null);
__decorate([
    common_1.Post('signUp'),
    swagger_1.ApiOkResponse({ type: models_1.TokenAuthModel }),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [models_1.SignUpAuthModel]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signUp", null);
__decorate([
    common_1.Get('users'),
    common_1.UseGuards(roles_guard_1.RolesGuard),
    common_2.Roles(entities_1.UserRole.ADMIN),
    swagger_1.ApiOkResponse({ type: models_1.TokenAuthModel, isArray: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getAll", null);
AuthController = __decorate([
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiUseTags('auth'),
    common_1.Controller('auth'),
    __metadata("design:paramtypes", [services_1.AuthService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map