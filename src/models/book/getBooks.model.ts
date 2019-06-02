import { GetBooksItemModel } from "./getBooksItem.model";
import { ApiModelProperty } from "@nestjs/swagger";
import { GetBookSelectCategoryModel } from "./getBookSelectCategory.model";

export class GetBooksModel{
    @ApiModelProperty()
    books: GetBooksItemModel[]
    @ApiModelProperty()
    categories: GetBookSelectCategoryModel[]
}