import { GetOrderProductModel } from "./getOrderProduct.model";
import { OrderStatus } from "common/enums/orderStatus.enum";
import { ApiModelProperty } from "@nestjs/swagger";

export class GetOrderModel{

    constructor(){
        this.products = new Array;
    }

    @ApiModelProperty()
    id: string;
    @ApiModelProperty()
    clientFirstName: string;
    @ApiModelProperty()
    clientLastName: string;
    @ApiModelProperty()
    clientEmail: string;
    @ApiModelProperty()
    orderStatus: OrderStatus;
    @ApiModelProperty()
    amount: number;
    @ApiModelProperty()
    products: Array<GetOrderProductModel>
}