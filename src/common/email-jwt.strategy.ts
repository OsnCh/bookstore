import { Injectable } from "@nestjs/common";

const emailJwtKey = "edrtertWabvf";

@Injectable()
export class EmailJwtStrategy{
    public create(email:string): string {
        const crypto = require('crypto');
        const emailToken = crypto.createHmac('sha256', emailJwtKey)
                   .update(email)
                   .digest('hex');
        return emailToken;
    }
}