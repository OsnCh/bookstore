import { ApiBearerAuth, ApiUseTags, ApiOkResponse } from "@nestjs/swagger";
import { Controller, Post, Body, Get, Param, UseGuards } from "@nestjs/common";
import { AddCategoryModel } from "src/models/category/addCategory.model";
import { CategoryService } from "src/services/category.service";
import { GetCategoriesModel } from "src/models/category/getCategories.model";
import { Roles, JwtAuthGuard } from "src/common";
import { UserRole } from "src/entities";
import { UpdateCategoryModel } from "src/models/category/updateCategory.model";
import { RolesGuard } from "src/common/guards/roles.guard";

@ApiBearerAuth()
@ApiUseTags('category')
@Controller('category')
export class CategoryController{
    constructor(private categoryService: CategoryService){}

    @Post('add')
    @ApiOkResponse({ type: String })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async add(@Body() model: AddCategoryModel): Promise<String> {
        return await this.categoryService.addCategory(model);
    }

    @Get('all')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({type: GetCategoriesModel})
    async getAll():Promise<GetCategoriesModel>{
        return this.categoryService.getCategories();
    }

    @Get('delete/:id')
    @ApiOkResponse({type:String})
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async delete(@Param('id') id: string):Promise<String>{
        return this.categoryService.deleteCategory(id);
    }
    
    @Post('update')
    @ApiOkResponse({type:String})
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async update(model: UpdateCategoryModel): Promise<String>{
        return this.categoryService.updateCategory(model);
    }
}