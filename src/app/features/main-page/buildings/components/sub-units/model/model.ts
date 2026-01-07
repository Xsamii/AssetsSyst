// ===========================================
// GET ALL
// ===========================================
export interface SubUnits {
  items: [
    {
      id: number;
      createdByUserId: number;
      modifiedByUserId: number;
      createdAt: string;
      inactive: boolean;
      isDeleted: boolean;
    }
  ];
}
export interface GetAllSubUnits {
  isSuccess: boolean;
  errors: {
    fieldName: string;
    code: string;
    message: string;
    fieldLang: string;
  }[];
  data: {
    items: SubUnits[];
    totalCount: number;
  };
}
// ===========================================
// CREATE & UPDATE & DELETE
// ===========================================
export interface SubUnitData {
  id?: number;
  code: string;
  name: string;
  mainBuildingId: number;
}
export interface CreateUpdateDeleteSubUnit {
  isSuccess: boolean;
  errors: {
    fieldName: string;
    code: string;
    message: string;
    fieldLang: string;
  }[];

  data: boolean;
}
