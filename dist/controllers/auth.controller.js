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
const auth_service_1 = require("services/auth.service");
const swagger_1 = require("@nestjs/swagger");
const signIn_model_1 = require("models/auth/signIn.model");
const common_2 = require("common");
const roles_guard_1 = require("common/guards/roles.guard");
const user_entity_1 = require("entities/user.entity");
const tokenAuth_model_1 = require("models/auth/tokenAuth.model");
const signUp_model_1 = require("models/auth/signUp.model");
const signInGoogle_model_1 = require("models/auth/signInGoogle.model");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    signIn(model) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.authService.signIn(model);
        });
    }
    signInByGoogle(model) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.authService.signInByGoogle(model);
        });
    }
    signInByFacebook(token) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.authService.signInFacebook(token);
        });
    }
    signUp(model) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.authService.signUp(model);
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.authService.getAll();
        });
    }
    emailConfirm(token) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.authService.confirmEmail(token);
        });
    }
};
__decorate([
    common_1.Post('signIn'),
    swagger_1.ApiOkResponse({ type: tokenAuth_model_1.TokenAuthModel }),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [signIn_model_1.SignInAuthModel]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signIn", null);
__decorate([
    common_1.Post('signIn/google'),
    swagger_1.ApiOkResponse({ type: tokenAuth_model_1.TokenAuthModel }),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [signInGoogle_model_1.SignInGoogleModel]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signInByGoogle", null);
__decorate([
    common_1.Get('signIn/facebook/:token'),
    swagger_1.ApiOkResponse({ type: tokenAuth_model_1.TokenAuthModel }),
    __param(0, common_1.Param('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signInByFacebook", null);
__decorate([
    common_1.Post('signUp'),
    swagger_1.ApiOkResponse({ type: tokenAuth_model_1.TokenAuthModel }),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [signUp_model_1.SignUpAuthModel]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signUp", null);
__decorate([
    common_1.Get('users'),
    common_1.UseGuards(common_2.JwtAuthGuard, roles_guard_1.RolesGuard),
    common_2.Roles(user_entity_1.UserRole.ADMIN),
    swagger_1.ApiOkResponse({ type: tokenAuth_model_1.TokenAuthModel, isArray: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getAll", null);
__decorate([
    common_1.Get('confirm/:token'),
    swagger_1.ApiOkResponse({ type: String }),
    __param(0, common_1.Param('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "emailConfirm", null);
AuthController = __decorate([
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiUseTags('Auth'),
    common_1.Controller('api/auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map