"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const jwt_1 = require("@nestjs/jwt");
const auth_controller_1 = require("./controllers/auth.controller");
const auth_service_1 = require("./services/auth.service");
const jwt_strategy_1 = require("./common/jwt.strategy");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./entities/user.entity");
const user_repository_1 = require("./repositories/user.repository");
const book_entity_1 = require("./entities/book.entity");
const book_repository_1 = require("./repositories/book.repository");
const category_entity_1 = require("./entities/category.entity");
const category_repository_1 = require("./repositories/category.repository");
const book_service_1 = require("./services/book.service");
const category_service_1 = require("./services/category.service");
const category_controller_1 = require("./controllers/category.controller");
const book_controller_1 = require("./controllers/book.controller");
const magazine_repository_1 = require("./repositories/magazine.repository");
const magazine_entity_1 = require("./entities/magazine.entity");
const magazine_service_1 = require("./services/magazine.service");
const magazine_controller_1 = require("./controllers/magazine.controller");
const email_sevice_1 = require("./services/email.sevice");
const email_jwt_strategy_1 = require("./common/email-jwt.strategy");
const order_repository_1 = require("./repositories/order.repository");
const orderProduct_repository_1 = require("./repositories/orderProduct.repository");
const order_entity_1 = require("./entities/order.entity");
const orderProduct_entity_1 = require("./entities/orderProduct.entity");
const order_controller_1 = require("./controllers/order.controller");
const order_service_1 = require("./services/order.service");
let ApplicationModule = class ApplicationModule {
    configure(consumer) {
        consumer.apply();
    }
};
ApplicationModule = __decorate([
    common_1.Module({
        imports: [
            typeorm_1.TypeOrmModule.forRootAsync({
                useFactory: () => ({
                    type: "mongodb",
                    host: "booksandmagazines-fgkra.mongodb.net",
                    url: "mongodb+srv://user:user@booksandmagazines-fgkra.mongodb.net/booksandmagazine?retryWrites=true&w=majority",
                    port: 27017,
                    username: "user",
                    password: "user",
                    database: "booksandmagazine",
                    entities: [user_entity_1.UserEntity, book_entity_1.BookEntity, magazine_entity_1.MagazineEntity, category_entity_1.CategoryEntity, order_entity_1.OrderEntity, orderProduct_entity_1.OrderProductEntity],
                    synchronize: true,
                    useNewUrlParser: true,
                    w: 'majority',
                    readPreference: 'primary'
                })
            }),
            typeorm_1.TypeOrmModule.forFeature([user_repository_1.UserRepository,
                book_repository_1.BookRepository,
                magazine_repository_1.MagazineRepository,
                category_repository_1.CategoryRepository,
                order_repository_1.OrderRepository,
                orderProduct_repository_1.OrderProductRepository]),
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            jwt_1.JwtModule.register({
                secretOrPrivateKey: 'secretKey',
                signOptions: {
                    expiresIn: 3600,
                },
            }),
        ],
        controllers: [auth_controller_1.AuthController,
            category_controller_1.CategoryController,
            book_controller_1.BookController,
            magazine_controller_1.MagazineController,
            order_controller_1.OrderController],
        providers: [
            jwt_strategy_1.JwtStrategy,
            email_jwt_strategy_1.EmailJwtStrategy,
            auth_service_1.AuthService,
            book_service_1.BookService,
            magazine_service_1.MagazineService,
            category_service_1.CategoryService,
            email_sevice_1.EmailService,
            order_service_1.OrderService
        ],
    })
], ApplicationModule);
exports.ApplicationModule = ApplicationModule;
//# sourceMappingURL=app.module.js.map