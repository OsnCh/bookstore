import { ApiModelProperty } from "@nestjs/swagger";

export class GetBookModel{
    @ApiModelProperty()
    id: string;
    @ApiModelProperty()
    price: number;
    @ApiModelProperty()
    categoryName: string;
    @ApiModelProperty()
    name: string;
    @ApiModelProperty()
    description: string;
}