import { ApiModelProperty } from "@nestjs/swagger";

export class SignInGoogleModel{
    @ApiModelProperty()
    accessToken: string;
    @ApiModelProperty()
    clientId: string;
}