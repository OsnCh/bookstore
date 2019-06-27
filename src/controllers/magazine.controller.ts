import { ApiBearerAuth, ApiUseTags, ApiOkResponse } from "@nestjs/swagger";
import { Controller, Get, UseGuards, Param, Post, Body } from "@nestjs/common";
import { MagazineService } from "src/services/magazine.service";
import { CategoryService } from "src/services/category.service";
import { User } from "src/common/user.decorator";
import { JwtAuthGuard, Roles } from "src/common";
import { GetMagazinesModel } from "src/models/magazine/getMagazines.model";
import { UserRole } from "src/entities/user.entity";
import { RolesGuard } from "src/common/guards/roles.guard";
import { AddMagazineModel } from "src/models/magazine/addMagazine.model";
import { UpdateMagazineModel } from "src/models/magazine/updateMagazine.model";
import { GetMagazineModel } from "src/models/magazine/getMagazine.model";

@ApiBearerAuth()
@ApiUseTags('Magazine')
@Controller('api/magazine')
export class MagazineController{
    constructor(private magazineService: MagazineService,
        private categoryService: CategoryService){}
    
    @Get('all')
    @ApiOkResponse({type: GetMagazinesModel})
    async getAllMagazines(@User() user): Promise<GetMagazinesModel>{
        let categories = await this.categoryService.getCategoriesForSelect();
        return await this.magazineService.getAllMagazines(user && user.role == UserRole.ADMIN, categories);
    }

    @Get('category/:id')
    @ApiOkResponse({type: GetMagazinesModel})
    async getMagazinesByCategoryId(@Param('id') categoryId: string, @User() user){
        let categories = await this.categoryService.getCategoriesForSelect();
        return await this.magazineService.getMagazinesByCategory(categoryId, 
            user && user.role == UserRole.ADMIN, categories);
    }

    @Get('/:id')
    @ApiOkResponse({ type: GetMagazineModel })
    async getMagazineById(@Param('id') id: string){
        let categories = await this.categoryService.getCategoriesForSelect();
        let response = new GetMagazineModel;
        response.categories = categories;
        response.magazine = await this.magazineService.getMagazineById(id, categories)
        return response;
    }

    @Post('add')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiOkResponse({ type: String })
    async addMagazine(@Body() model: AddMagazineModel): Promise<String>{
        return await this.magazineService.addMagazine(model);
    }

    @Post('update')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiOkResponse({ type: String })
    async updateMagazine(@Body() model: UpdateMagazineModel): Promise<String>{
        return await this.magazineService.updateMagazine(model);
    }

    @Get('delete/:id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiOkResponse({ type: String })
    async deleteMagazine(@Param('id') id:string){
        return await this.magazineService.deleteMagazine(id);
    }

    @Post('delete')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiOkResponse({ type: String })
    async deleteMagazines(@Body() ids: Array<string>){
        return await this.magazineService.deleteMany(ids);
    }
}