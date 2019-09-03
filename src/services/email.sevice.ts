import { Injectable } from "@nestjs/common";
import { environment } from "src/environments/environment";

@Injectable()
export class EmailService{

    public async sendEmail(from: string, to: string, subject: string, body: string): Promise<any>{
      let transporter = this.getClient();
      await transporter.sendMail({
        from: from, 
        to: to, 
        subject: subject, 
        html: body 
      });
    }

    public async sendUserPassword(email: string, userName: string, password: string): Promise<any>{
      return await this.sendEmail(environment.smtp.email,
        email, 'New password for you!',
        `<br/>
        Thank you for registering, ${userName}.
        <br/>
        <p><span>Your new password:</span>${password}</p>`); 
    }

    public async sendConfirmEmail(token: string, email: string): Promise<any> {
      return await this.sendEmail(environment.smtp.email,
        email, 'Link for confirm email!',
        `<br/>
        Your link for confirm email.
        <br/>
        <a href='${environment.apiUrl}/api/auth/confirm/${token}'>Confirm</a>`); 
    }

    private getClient(){
      const nodemailer = require("nodemailer");

      let transporter = nodemailer.createTransport({
        host: environment.smtp.host,
        port: environment.smtp.port,
        secure: true, 
        auth: {
          user: environment.smtp.user.userName, 
          pass: environment.smtp.user.password 
        }
      });
      return transporter;
    }
}