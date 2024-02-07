export interface ILoginResponse {
    id: number;
    fullName: string;
    mobile: string;
    email: string;
    role: string;
    isActive: string;
    resetPasswordRequired: string;
    token: Token;
  }


  interface Token {
    token: string;
    success: string;
    refreshToken: string;
  }
