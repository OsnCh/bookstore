import { ApiModelProperty } from "@nestjs/swagger";
import { ProductType } from "src/common/enums/productType.enum";

export class SaveOrderItemModel{
    @ApiModelProperty()
    id: string;
    @ApiModelProperty()
    type: ProductType;
    @ApiModelProperty()
    count: number;
}