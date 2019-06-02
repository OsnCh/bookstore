import { ApiModelProperty } from '@nestjs/swagger';
export class SignInAuthModel {
    @ApiModelProperty()
    email: string;
    @ApiModelProperty()
    password: string;
}