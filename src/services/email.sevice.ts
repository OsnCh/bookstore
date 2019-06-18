import { Injectable } from "@nestjs/common";

@Injectable()
export class EmailService{

    public async sendEmail(from: string, to: string, subject: string, body: string): Promise<any>{
      const nodemailer = require("nodemailer");

      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, 
        auth: {
          user: 'nodewarehouse@gmail.com', 
          pass: 'Qwerty123456!@' 
        }
      });
      await transporter.sendMail({
        from: from, 
        to: to, 
        subject: subject, 
        html: body 
      });
    }
}