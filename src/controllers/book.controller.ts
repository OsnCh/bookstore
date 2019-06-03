import { ApiBearerAuth, ApiUseTags, ApiOkResponse } from "@nestjs/swagger";
import { Controller, Get, UseGuards, Param, Post, Body } from "@nestjs/common";
import { BookService } from "src/services/book.service";
import { GetBooksModel } from "src/models/book/getBooks.model";
import { User } from "src/common/user.decorator";
import { JwtAuthGuard, Roles } from "src/common";
import { UserRole } from "src/entities";
import { RolesGuard } from "src/common/guards/roles.guard";
import { AddBookModel } from "src/models/book/addBook.model";
import { UpdateBookModel } from "src/models/book/updateBook.model";

@ApiBearerAuth()
@ApiUseTags('book')
@Controller('book')
export class BookController{
    constructor(private bookService: BookService){}

    @Get('all')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({type: GetBooksModel})
    async getAllBooks(@User() user): Promise<GetBooksModel>{
        return await this.bookService.getAllBooks(user.role == UserRole.ADMIN);
    }

    @Get('category/:id')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({type: GetBooksModel})
    async getBooksByCategoryId(@Param('id') categoryId: string, @User() user){
        return await this.bookService.getBooksByCategory(categoryId, user.role == UserRole.ADMIN);
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
        return await this.updateBook(model);
    }

    @Get('delete/:id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiOkResponse({ type: String })
    async deleteBook(@Param('id') id:string){
        return await this.deleteBook(id);
    }
}