import "reflect-metadata"
import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './common/jwt.strategy';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserRepository } from "./repositories/user.repository";
import { BookEntity } from "./entities/book.entity";
import { BookRepository } from "./repositories/book.repository";
import { CategoryEntity } from "./entities/category.entity";
import { CategoryRepository } from "./repositories/category.repository";
import { BookService } from "./services/book.service";
import { CategoryService } from "./services/category.service";
import { CategoryController } from "./controllers/category.controller";
import { BookController } from "./controllers/book.controller";
import { MagazineRepository } from "./repositories/magazine.repository";
import { MagazineEntity } from "./entities/magazine.entity";
import { MagazineService } from "./services/magazine.service";
import { MagazineController } from "./controllers/magazine.controller";
import { EmailService } from "./services/email.sevice";
import { EmailJwtStrategy } from "./common/email-jwt.strategy";
import { OrderRepository } from "./repositories/order.repository";
import { OrderProductRepository } from "./repositories/orderProduct.repository";
import { OrderEntity } from "./entities/order.entity";
import { OrderProductEntity } from "./entities/orderProduct.entity";
import { OrderController } from "./controllers/order.controller";
import { OrderService } from "./services/order.service";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: "mongodb",
        host: "booksandmagazines-fgkra.mongodb.net",
        url: "mongodb+srv://user:user@booksandmagazines-fgkra.mongodb.net/booksandmagazine?retryWrites=true&w=majority",
        port: 27017,
        username: "user",
        password: "user",
        database: "booksandmagazine",
        entities: [UserEntity, BookEntity, MagazineEntity, CategoryEntity, OrderEntity, OrderProductEntity],
        synchronize: true,
        useNewUrlParser: true, 
        w: 'majority',
        readPreference: 'primary'
      })
    }),
    TypeOrmModule.forFeature([UserRepository, 
      BookRepository, 
      MagazineRepository,
      CategoryRepository,
      OrderRepository,
      OrderProductRepository]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secretOrPrivateKey: 'secretKey',
      signOptions: {
        expiresIn: 3600,
      },
    }),
  ],
  controllers: [AuthController, 
    CategoryController, 
    BookController,
    MagazineController,
    OrderController],
  providers: [
    JwtStrategy,
    EmailJwtStrategy,
    AuthService,
    BookService,
    MagazineService,
    CategoryService,
    EmailService,
    OrderService
  ],
})
export class ApplicationModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply();
  }
}
