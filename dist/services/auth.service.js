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
const jwt_1 = require("@nestjs/jwt");
const user_entity_1 = require("src/entities/user.entity");
const models_1 = require("../models");
const md5_1 = require("ts-md5/dist/md5");
const user_repository_1 = require("src/repositories/user.repository");
let AuthService = class AuthService {
    constructor(jwtService, userRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }
    signIn(model) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findOne({
                email: model.email
            });
            if (user) {
                throw Error('User has already exist!');
            }
            const accessToken = this.jwtService.sign({
                email: user.email,
                role: user.role,
                name: user.firstName,
                surname: user.lastName
            });
            return {
                expiresIn: 3600,
                accessToken
            };
        });
    }
    signUp(model) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findOne({
                email: model.email
            });
            if (user) {
                throw Error('User has already exist!');
            }
            const passwordHash = md5_1.Md5.hashAsciiStr(model.password);
            const newUser = this.userRepository.create({
                email: model.email,
                isActive: true,
                firstName: model.firstName,
                lastName: model.lastName,
                passwordHash: passwordHash.toString(),
                role: user_entity_1.UserRole.CLIENT
            });
            const accessToken = this.jwtService.sign({
                email: newUser.email,
                role: newUser.role,
                name: newUser.firstName,
                surname: newUser.lastName
            });
            return {
                expiresIn: 3600,
                accessToken
            };
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield this.userRepository.find();
            return users.map(user => {
                return new models_1.UserModel(user);
            });
        });
    }
};
AuthService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        user_repository_1.UserRepository])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map