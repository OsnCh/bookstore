import { SaveOrderItemModel } from "./saveOrderItem.model";
import { ApiModelProperty } from "@nestjs/swagger";

export class SaveOrderModel{
    @ApiModelProperty()
    products: Array<SaveOrderItemModel>
}