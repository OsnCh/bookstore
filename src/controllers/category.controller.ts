import { ApiBearerAuth, ApiUseTags, ApiOkResponse } from "@nestjs/swagger";
import { Controller, Post, Body, Get, Param, UseGuards, Header } from "@nestjs/common";
import { AddCategoryModel } from "src/models/category/addCategory.model";
import { CategoryService } from "src/services/category.service";
import { GetCategoriesModel } from "src/models/category/getCategories.model";
import { Roles, JwtAuthGuard } from "src/common";
import { UserRole } from "src/entities/user.entity";
import { UpdateCategoryModel } from "src/models/category/updateCategory.model";
import { RolesGuard } from "src/common/guards/roles.guard";

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