import { ProductType } from "common/enums/productType.enum";
import { GetMagazinesItemModel } from "../magazine/getMagazinesItem.model";
import { GetBooksItemModel } from "../book/getBooksItem.model";
import { ApiModelProperty } from "@nestjs/swagger";

export class GetOrderProductModel{
    @ApiModelProperty()
    id: string;
    @ApiModelProperty()
    type: ProductType;
    @ApiModelProperty()
    product: GetMagazinesItemModel | GetBooksItemModel;
    @ApiModelProperty()
    count: number;
}