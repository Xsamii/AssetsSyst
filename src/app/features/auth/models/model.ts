export interface Login {
  isSuccess: boolean;
  errors: {
    fieldName: string;
    code: string;
    message: string;
    fieldLang: string;
  }[];
  data: {
    email: string;
    code: string;
  };
}

export interface VerifyCode {
  isSuccess: boolean;
  errors: {
    fieldName: string;
    code: string;
    message: string;
    fieldLang: string;
  }[];
  data: {
    token: string;
    refreshToken: string;
    code: string;
    role: number;
    officeTypeId: number
  };
}
