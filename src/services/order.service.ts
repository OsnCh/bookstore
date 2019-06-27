import { Injectable } from "@nestjs/common";
import { SaveOrderModel } from "src/models/order/saveOrder.model";
import { OrderRepository } from "src/repositories/order.repository";
import { OrderProductEntity } from "src/entities/orderProduct.entity";
import { SaveOrderItemModel } from "src/models/order/saveOrderItem.model";
import { OrderProductRepository } from "src/repositories/orderProduct.repository";
import { ObjectID } from "typeorm";
import { ApplicationException } from "src/common/exceptions/application.exception";
import { OrderStatus } from "src/common/enums/orderStatus.enum";
import { GetOrderModel } from "src/models/order/getOrder.model";
import { UserRepository } from "src/repositories/user.repository";
import { BookEntity } from "src/entities/book.entity";
import { MagazineEntity } from "src/entities/magazine.entity";
import { ProductType } from "src/common/enums/productType.enum";
import { BookRepository } from "src/repositories/book.repository";
import { MagazineRepository } from "src/repositories/magazine.repository";
import { GetBooksItemModel } from "src/models/book/getBooksItem.model";
import { GetMagazinesItemModel } from "src/models/magazine/getMagazinesItem.model";
import { GetSelectCategoryModel } from "src/models/category/getSelectCategory.model";
import { CategoryRepository } from "src/repositories/category.repository";
import { GetOrderProductModel } from "src/models/order/getOrderProduct.model";

const removeDublicate = function (elem, index, self) {
    return index === self.indexOf(elem);
};

const removeDublicateOrderProducts = function (elem, index, self) {
    return index === self.findIndex(v => elem.type == v.type && elem.id == v.id);
}

@Injectable()
export class OrderService {
    constructor(private orderRepository: OrderRepository,
        private orderProductRepository: OrderProductRepository,
        private userRepository: UserRepository,
        private bookRepository: BookRepository,
        private magazineRepository: MagazineRepository,
        private categoryRepository: CategoryRepository) { }

    async saveOrder(userId: string, model: SaveOrderModel): Promise<string> {
        if (!model.products || model.products.length == 0) {
            throw new ApplicationException('Product list is empty.')
        }

        let orderProductIds = new Array<ObjectID>();
        for (let i = 0; i < model.products.length; i++) {
            let orderProduct = await this.createOrderProduct(model.products[i])
            orderProductIds.push(orderProduct.id);
        }

        let order = this.orderRepository.create({
            userId: userId,
            orderProductIds: orderProductIds.map(v => v.toString()),
            status: OrderStatus.WAITINGCONFIRMATION
        })
        await this.orderRepository.save(order);
        return "Order successfully created."
    }

    private async createOrderProduct(orderProductModel: SaveOrderItemModel): Promise<OrderProductEntity> {
        let orderProduct = this.orderProductRepository.create({
            productId: orderProductModel.id,
            type: orderProductModel.type,
            count: orderProductModel.count
        });
        await this.orderProductRepository.save(orderProduct);
        return orderProduct;
    }

    //#region get all orders
    async getAllOrders(): Promise<Array<GetOrderModel>> {
        let orderModels = new Array<GetOrderModel>();
        let orders = await this.orderRepository.find();

        let usersIds = orders.map(v => v.userId.toString());
        usersIds = usersIds.filter(removeDublicate);
        let users = await this.userRepository.find(usersIds as any);

        let orderProducts = await this.orderProductRepository.find();
        let orderProductsIds = orderProducts.filter(removeDublicateOrderProducts).
            map(v => { return { id: v.id, type: v.type } });
        let products = await this.getProducts(orderProductsIds);

        for (let i = 0; i < orders.length; i++) {
            const order = orders[i];
            let orderModel = new GetOrderModel;
            orderModel.id = order.id.toString();
            let client = users.find(v => v.id.toString() == order.userId.toString());
            if (client) {
                orderModel.clientEmail = client.email;
                orderModel.clientFirstName = client.firstName;
                orderModel.clientLastName = client.lastName;
            }
            orderModel.orderStatus = order.status;
            orderModel.products = this.findProducts(order.orderProductIds.map(v => v.toString()), products, orderProducts);
            orderModel.amount = this.getAmountByOrderModel(orderModel);
            orderModels.push(orderModel);
        }

        return orderModels;
    }

    private getAmountByOrderModel(model: GetOrderModel): number {
        let amount = 0;
        model.products.forEach(v => {
            amount += v.count * v.product.price;
        })
        return amount;
    }

    private findProducts(ids: string[],
        products: Array<{ data: GetBooksItemModel | GetMagazinesItemModel; type: ProductType; }>,
        orderProducts: OrderProductEntity[]): GetOrderProductModel[] {

        let productModels = ids.
            filter(id => orderProducts.find(pr => pr.id.toString() == id
                && products.find(nPr => pr.productId == nPr.data.id && pr.type == nPr.type)?true:false)?true:false).
            map(id => {
                let oPr = orderProducts.find(or => or.id.toString() == id);
                let pr = products.find(v => oPr.productId == v.data.id && oPr.type == v.type);
                let model = new GetOrderProductModel;
                model.type = oPr.type;
                model.count = oPr.count;
                model.product = (pr.type == ProductType.BOOK) ? new GetBooksItemModel : new GetMagazinesItemModel;
                model.id = oPr.id.toString();
                model.product.id = pr.data.id;
                model.product.category = pr.data.category;
                model.product.description = pr.data.description;
                model.product.isActive = pr.data.isActive;
                model.product.name = pr.data.name;
                model.product.price = pr.data.price;
                return model;
            });
        return productModels;
    }

    private async getProducts(ids: { id: string; type: ProductType }[] | any): Promise<Array<{ data: GetBooksItemModel | GetMagazinesItemModel; type: ProductType }>> {
        let products = new Array<{ data: GetBooksItemModel | GetMagazinesItemModel; type: ProductType }>();
        let books = await this.bookRepository.find(ids.filter(v => v.type == ProductType.BOOK).map(v => v.id));
        for (let i = 0; i < books.length; i++) {
            let bookModel = await this.mapBookEntity(books[i], products.map(v => v.data.category));
            products.push({ data: bookModel, type: ProductType.BOOK })
        }
        let magazines = await this.magazineRepository.find(ids.filter(v => v.type == ProductType.MAGAZINE).map(v => v.id))
        for (let i = 0; i < magazines.length; i++) {
            let magazineModel = await this.mapMagazineEntity(magazines[i], products.map(v => v.data.category));
            products.push({ data: magazineModel, type: ProductType.MAGAZINE })
        }
        return products;
    }

    private async mapBookEntity(entity: BookEntity, categories: Array<GetSelectCategoryModel>): Promise<GetBooksItemModel> {
        let bookModel = new GetBooksItemModel;
        bookModel.id = entity.id.toString();
        bookModel.category = await this.findCategory(categories, entity.categoryId.toString());
        bookModel.name = entity.name;
        bookModel.price = entity.price;
        bookModel.isActive = entity.isActive;
        bookModel.description = entity.description;
        return bookModel;
    }


    private async mapMagazineEntity(entity: MagazineEntity, categories: Array<GetSelectCategoryModel>): Promise<GetMagazinesItemModel> {
        let magazineModel = new GetMagazinesItemModel;
        magazineModel.id = entity.id.toString();
        magazineModel.category = await this.findCategory(categories, entity.categoryId.toString());
        magazineModel.name = entity.name;
        magazineModel.price = entity.price;
        magazineModel.isActive = entity.isActive;
        magazineModel.description = entity.description;
        return magazineModel;
    }

    private async findCategory(categoriesExists: Array<GetSelectCategoryModel>, id: string): Promise<GetSelectCategoryModel> {
        let category = categoriesExists.find(v => v.id == id);
        if (category) {
            return category;
        }

        category = new GetSelectCategoryModel;
        let categoryEntity = await this.categoryRepository.findOne(id);
        category.id = categoryEntity.id.toString();
        category.name = categoryEntity.name;
        return category;
    }
    //#endregion

    async changeOrderStatus(id: string, status: OrderStatus): Promise<string>{
        await this.orderRepository.update(id, { status: status });
        return "Change status succefuly";
    }
    
}