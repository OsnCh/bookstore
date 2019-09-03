export const environment = {
  apiUrl: 'http://10.10.0.66:3001/',
  facebookData: {
    apiVersion: 'v3.3',  
    facebookClientId: '200824017475143',
    facebookClientSecretKey: '23ab295cf12b2f954df3b250e27ce75d'
  },
  userGenerationPassword: {
    passwordLength: 10,
    passwordChars: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  },
  smtp:{
    email: 'nodewarehouse@gmail.com',
    host: "smtp.gmail.com",
    port: 465,
    user: {
      userName: 'nodewarehouse@gmail.com', 
      password: 'Qwerty123456!@' 
    }
  },
  production: false
};
