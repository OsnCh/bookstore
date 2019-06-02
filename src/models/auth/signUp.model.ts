import { ApiModelProperty } from '@nestjs/swagger';
export class SignUpAuthModel {
    @ApiModelProperty()
    firstName: string;

    @ApiModelProperty()
    lastName: string;

    @ApiModelProperty()
    email: string;

    @ApiModelProperty()
    password: string;
}