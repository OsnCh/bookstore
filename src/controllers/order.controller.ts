import { ApiBearerAuth, ApiUseTags, ApiOkResponse } from "@nestjs/swagger";
import { Controller, Post, Body, UseGuards, Get, Param } from "@nestjs/common";
import { OrderService } from "src/services/order.service";
import { User } from "src/common/user.decorator";
import { JwtAuthGuard, Roles } from "src/common";
import { SaveOrderModel } from "src/models/order/saveOrder.model";
import { RolesGuard } from "src/common/guards/roles.guard";
import { UserRole } from "src/entities/user.entity";
import { GetOrderModel } from "src/models/order/getOrder.model";
import { OrderStatus } from "src/common/enums/orderStatus.enum";

@ApiBearerAuth()
@ApiUseTags('Order')
@Controller('api/order')
export class OrderController{

    constructor(private orderService: OrderService){}

    @Post('create')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({type: String})
    async createOrder(@Body() model: SaveOrderModel, @User() user): Promise<string>{
        return await this.orderService.saveOrder(user.id, model);
    } 

    @Get('all')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async getAll(): Promise<Array<GetOrderModel>>{
        return await this.orderService.getAllOrders();
    }

    @Get('changestatus/:id/:status')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async changeStatus(@Param('id') id:string, @Param('status') status: OrderStatus): Promise<string>{
        return await this.orderService.changeOrderStatus(id, status);
    }

    @Get('get')
    @UseGuards(JwtAuthGuard)
    async getUserOrders(@User() user): Promise<Array<GetOrderModel>>{
        return await this.orderService.getUserOrders(user.id);
    }

}