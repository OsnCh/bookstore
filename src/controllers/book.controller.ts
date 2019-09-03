import { ApiBearerAuth, ApiUseTags, ApiOkResponse } from "@nestjs/swagger";
import { Controller, Get, UseGuards, Param, Post, Body } from "@nestjs/common";
import { BookService } from "services/book.service";
import { GetBooksModel } from "models/book/getBooks.model";
import { User } from "common/user.decorator";
import { JwtAuthGuard, Roles } from "common";
import { UserRole } from "entities/user.entity";
import { RolesGuard } from "common/guards/roles.guard";
import { AddBookModel } from "models/book/addBook.model";
import { UpdateBookModel } from "models/book/updateBook.model";
import { CategoryService } from "services/category.service";
import { GetBookModel } from "models/book/getBook.model";

@ApiBearerAuth()
@ApiUseTags('Book')
@Controller('api/book')
export class BookController{
    constructor(private bookService: BookService,
        private categoryService: CategoryService){}

    @Get('all')
    @ApiOkResponse({type: GetBooksModel})
    async getAllBooks(@User() user): Promise<GetBooksModel>{
        let categories = await this.categoryService.getCategoriesForSelect();
        return await this.bookService.getAllBooks(user && user.role == UserRole.ADMIN, categories);
    }

    @Get('/:id')
    @ApiOkResponse({type: GetBookModel})
    async getBook(@Param('id') id: string){
        return await this.bookService.getBook(id);
    }

    @Get('category/:id')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({type: GetBooksModel})
    async getBooksByCategoryId(@Param('id') categoryId: string, @User() user){
        let categories = await this.categoryService.getCategoriesForSelect();
        return await this.bookService.getBooksByCategory(categoryId, 
            user.role == UserRole.ADMIN, categories);
    }

    @Post('add')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiOkResponse({ type: String })
    async addBook(@Body() model: AddBookModel): Promise<String>{
        return await this.bookService.addBook(model);
    }

    @Post('update')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiOkResponse({ type: String })
    async updateBook(@Body() model: UpdateBookModel): Promise<String>{
        return await this.bookService.updateBook(model);
    }

    @Get('delete/:id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiOkResponse({ type: String })
    async deleteBook(@Param('id') id:string): Promise<string>{
        return await this.bookService.deleteBook(id);
    }

    @Post('delete')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiOkResponse({ type: String })
    async deleteBooks(@Body() ids:Array<string>): Promise<string>{
        return await this.bookService.deleteBooks(ids);
    }
}