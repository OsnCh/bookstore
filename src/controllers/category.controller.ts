import { ApiBearerAuth, ApiUseTags, ApiOkResponse } from "@nestjs/swagger";
import { Controller, Post, Body, Get, Param, UseGuards, Header } from "@nestjs/common";
import { AddCategoryModel } from "models/category/addCategory.model";
import { CategoryService } from "services/category.service";
import { GetCategoriesModel } from "models/category/getCategories.model";
import { Roles, JwtAuthGuard } from "common";
import { UserRole } from "entities/user.entity";
import { UpdateCategoryModel } from "models/category/updateCategory.model";
import { RolesGuard } from "common/guards/roles.guard";

@ApiBearerAuth()
@ApiUseTags('Category')
@Controller('api/category')
export class CategoryController{
    constructor(private categoryService: CategoryService){}

    @Post('add')
    @ApiOkResponse({type: 'text'})
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async add(@Body() model: AddCategoryModel): Promise<String> {
        return await this.categoryService.addCategory(model);
    }

    @Get('all')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({type: GetCategoriesModel})
    async getAll():Promise<GetCategoriesModel>{
        return await this.categoryService.getCategories();
    }

    @Get('delete/:id')
    @ApiOkResponse({type: 'text'})
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async delete(@Param('id') id: string):Promise<String>{
        return await this.categoryService.deleteCategory(id);
    }
    
    @Post('update')
    @ApiOkResponse({type: 'text'})
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async update(@Body() model: UpdateCategoryModel): Promise<String>{
        return await this.categoryService.updateCategory(model);
    }
}