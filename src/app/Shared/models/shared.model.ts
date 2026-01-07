export interface Lookups {
  isSuccess: boolean;
  errors: {
    fieldName: string;
    code: string;
    message: string;
    fieldLang: string;
  }[];

  data: [
    {
      id: number;
      name: string;
      code:string;
      url: string;
    }
  ];
}
