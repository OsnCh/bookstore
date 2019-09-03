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
const user_entity_1 = require("entities/user.entity");
const md5_1 = require("ts-md5/dist/md5");
const user_repository_1 = require("repositories/user.repository");
const user_model_1 = require("models/auth/user.model");
const application_exception_1 = require("common/exceptions/application.exception");
const email_sevice_1 = require("./email.sevice");
const email_jwt_strategy_1 = require("common/email-jwt.strategy");
const fb_1 = require("fb");
const environment_1 = require("environments/environment");
function checkResponseFacebook(response, rejectObj) {
    if (response && !response.error) {
        return;
    }
    let error = !response ? 'Facebook api error.' : response.error;
    throw new application_exception_1.ApplicationException(error);
    rejectObj();
}
let AuthService = class AuthService {
    constructor(jwtService, userRepository, emailService, emailJwtStrategy) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.emailJwtStrategy = emailJwtStrategy;
    }
    signIn(model) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.validateUser(model.email);
            if (!user || this.getHashPassowrd(model.password) != user.passwordHash) {
                throw new application_exception_1.ApplicationException('User not found!');
            }
            return {
                expiresIn: 3600,
                accessToken: this.getAccessToken(user),
                isNewUser: false
            };
        });
    }
    signInByGoogle(model) {
        return __awaiter(this, void 0, void 0, function* () {
            const { OAuth2Client } = require('google-auth-library');
            let payload;
            try {
                const client = new OAuth2Client(model.clientId);
                const ticket = yield client.verifyIdToken({
                    idToken: model.accessToken,
                    audience: model.clientId
                });
                payload = ticket.getPayload();
            }
            catch (error) {
                console.log(error);
                throw new application_exception_1.ApplicationException('Google service error');
            }
            const userid = payload['sub'];
            let appUser = yield this.userRepository.findOne({ googleUserId: userid });
            let isNewUser = false;
            if (!appUser) {
                isNewUser = true;
                appUser = yield this.signUpGoogle({
                    email: payload['email'],
                    firstName: payload['given_name'],
                    lastName: payload['family_name'],
                }, userid);
            }
            return {
                expiresIn: 3600,
                accessToken: this.getAccessToken(appUser),
                isNewUser: isNewUser
            };
        });
    }
    signUpGoogle(model, userGoogleId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.validateEmailForSignUp(model.email);
            let pwd = this.generateRandomPassword();
            let user = this.userRepository.create({
                email: model.email,
                firstName: model.firstName,
                lastName: model.lastName,
                emailConfirmed: true,
                googleUserId: userGoogleId,
                role: user_entity_1.UserRole.CLIENT,
                passwordHash: this.getHashPassowrd(pwd).toString()
            });
            let sendMessage = (() => __awaiter(this, void 0, void 0, function* () {
                return yield this.emailService.sendUserPassword(model.email, `${model.firstName} ${model.lastName}`, pwd);
            }));
            sendMessage();
            yield this.userRepository.save(user);
            return user;
        });
    }
    signInFacebook(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('token', accessToken);
            const fb = new fb_1.Facebook({ version: environment_1.environment.facebookData.apiVersion });
            let token = yield new Promise((resolve, reject) => {
                fb.api('oauth/access_token', {
                    client_id: environment_1.environment.facebookData.facebookClientId,
                    client_secret: environment_1.environment.facebookData.facebookClientSecretKey,
                    grant_type: 'client_credentials'
                }, function (res) {
                    checkResponseFacebook(res, reject);
                    var accessToken = res.access_token;
                    resolve(accessToken);
                });
            });
            console.log('acces_token', accessToken);
            let userFacebookData = yield new Promise((resolve, reject) => {
                fb.api(`/debug_token?input_token=${accessToken}&access_token=${token}`, function (response) {
                    checkResponseFacebook(response, reject);
                    resolve(response);
                });
            });
            console.log('debug_token', userFacebookData);
            let facebookApiError = new application_exception_1.ApplicationException('Facebook api bad response');
            if (!userFacebookData.data.is_valid) {
                throw facebookApiError;
            }
            let facebookUserId = userFacebookData.data.user_id;
            let appUser = yield this.userRepository.findOne({ facebookUserId: facebookUserId });
            let isNewUser = false;
            if (!appUser) {
                isNewUser = true;
                let userScopeData = yield new Promise((resolve, reject) => {
                    fb.api(`/${facebookUserId}?fields=email,name`, { access_token: `${accessToken}` }, function (response) {
                        resolve(response);
                    });
                });
                console.log('user_scope', userScopeData);
                if (!userScopeData) {
                    throw facebookApiError;
                }
                appUser = yield this.signUpByFacebook(facebookUserId, userScopeData.name, userScopeData.email);
            }
            return {
                expiresIn: 3600,
                accessToken: this.getAccessToken(appUser),
                isNewUser: isNewUser
            };
        });
    }
    signUpByFacebook(facebookUserId, name, email) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!email) {
                throw new application_exception_1.ApplicationException('Email not found.');
            }
            yield this.validateEmailForSignUp(email);
            let nameArr = name.split(' ');
            let firstName = (nameArr.length > 0) ? nameArr[0] : "unknown";
            let lastName = (nameArr.length > 1) ? nameArr[1] : "unknown";
            let password = this.generateRandomPassword();
            let appUser = this.userRepository.create({
                firstName: firstName,
                lastName: lastName,
                facebookUserId: facebookUserId,
                email: email,
                emailConfirmed: true,
                role: user_entity_1.UserRole.CLIENT,
                passwordHash: this.getHashPassowrd(password).toString()
            });
            (() => __awaiter(this, void 0, void 0, function* () {
                yield this.emailService.sendUserPassword(email, `${firstName} ${lastName}`, password);
            }))();
            yield this.userRepository.save(appUser);
            return appUser;
        });
    }
    generateRandomPassword() {
        var randPassword = Array(environment_1.environment.userGenerationPassword.passwordLength).
            fill(environment_1.environment.userGenerationPassword.passwordChars).map((x) => { return x[Math.floor(Math.random() * x.length)]; }).join('');
        return randPassword;
    }
    getHashPassowrd(password) {
        return md5_1.Md5.hashAsciiStr(password);
    }
    getAccessToken(user) {
        const accessToken = this.jwtService.sign({
            email: user.email,
            role: user.role,
            name: user.firstName,
            surname: user.lastName
        });
        return accessToken;
    }
    validateUser(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findOne({ email: email });
            if (!user) {
                throw new application_exception_1.ApplicationException('User not found!');
            }
            if (!user.isEmailConfirm) {
                throw new application_exception_1.ApplicationException('Email is not confirmed!');
            }
            if (!user.isActive) {
                throw new application_exception_1.ApplicationException('User is not active!');
            }
            return user;
        });
    }
    signUp(model) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.validateEmailForSignUp(model.email);
            let emailToken = this.emailJwtStrategy.create(model.email);
            const passwordHash = this.getHashPassowrd(model.password);
            const newUser = this.userRepository.create({
                email: model.email,
                isActive: true,
                firstName: model.firstName,
                lastName: model.lastName,
                passwordHash: passwordHash.toString(),
                role: user_entity_1.UserRole.CLIENT,
                isEmailConfirm: false,
                emailConfirmedToken: emailToken
            });
            this.userRepository.save(newUser);
            yield this.emailService.sendConfirmEmail(newUser.emailConfirmedToken, model.email);
            return "User is registered. Check your email inbox.";
        });
    }
    validateEmailForSignUp(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findOne({
                email: email
            });
            if (user) {
                throw new application_exception_1.ApplicationException('User with such email already exists!');
            }
        });
    }
    confirmEmail(token) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield this.userRepository.findOneOrFail({ emailConfirmedToken: token });
            if (!user || !user.isActive) {
                throw new application_exception_1.ApplicationException('User not found!');
            }
            if (user.isEmailConfirm) {
                throw new application_exception_1.ApplicationException('Email alredy confirmed!');
            }
            user.isEmailConfirm = true;
            yield this.userRepository.update({ id: user.id }, user);
            return 'Email is confirmed.';
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield this.userRepository.find();
            return users.map(user => {
                return new user_model_1.UserModel(user);
            });
        });
    }
};
AuthService = __decorate([
    common_1.Injectable({
        scope: common_1.Scope.REQUEST
    }),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        user_repository_1.UserRepository,
        email_sevice_1.EmailService,
        email_jwt_strategy_1.EmailJwtStrategy])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map