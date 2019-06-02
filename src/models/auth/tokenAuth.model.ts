import { ApiModelProperty } from '@nestjs/swagger';
export class TokenAuthModel {
    @ApiModelProperty()
    expiresIn: number;
    @ApiModelProperty()
    accessToken: string;
}