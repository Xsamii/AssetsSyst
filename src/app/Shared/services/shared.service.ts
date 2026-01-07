import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Lookups } from '../models/shared.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  baseUrl: string;
  constructor(private http: HttpClient, private _router: Router) {
    this.baseUrl = environment.url;
  }

  showSideMenu = new Subject<boolean>();
  showSideMenuFun(value: boolean) {
    this.showSideMenu.next(value);
  }

  homeIsClicked = new Subject<boolean>();
  HomeClickedFun(value: boolean) {
    this.homeIsClicked.next(value);
  }

  goToHome() {
    let userRole = +localStorage.getItem('maintainanceRole');
    switch (userRole) {
      case 1:
      case 2:
        this._router.navigate(['/dashboard']);
        break;
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
        this._router.navigate(['/maintenance/maintenace-requests']);
        break;
      default:
    }
    this.HomeClickedFun(true);
  }

  // LOOKUPS

  // ---------------------------------
  // GET ALL BUILDING LOOKUP
  // ---------------------------------
  getAllBuilding(): Observable<Lookups> {
    return this.http.get<Lookups>(`${environment.url}LookUp/GetAllBuilding`);
  }
  // ---------------------------------
  // GET ALL Building SubUnit LOOKUP
  // ---------------------------------
  getAllBuildingSubUnit(id: number): Observable<Lookups> {
    return this.http.get<Lookups>(
      `${environment.url}LookUp/GetAllBuildingSubUnit?buildingId=${id}`
    );
  }
   // ---------------------------------
  // GET ALL RegularChecks Types LOOKUP
  // ---------------------------------
  getRegularCheckTypes(): Observable<Lookups> {
    return this.http.get<Lookups>(
      `${environment.url}LookUp/GetRegularCheckTypes`
    );
  }
   // GET ALL Maintenance Types LOOKUP
  // ---------------------------------
  getMaintenanceTypes(): Observable<Lookups> {
    return this.http.get<Lookups>(
      `${environment.url}LookUp/GetMaintenanceTypes`
    );
  }
  getAllContractor(): Observable<Lookups> {
    return this.http.get<Lookups>(
      `${environment.url}LookUp/GetAllContractor`
    );
  }
  // ---------------------------------
  // GET ALL Floors in SubUnit LOOKUP
  // ---------------------------------
  getFloorsInSubunit(id: number): Observable<Lookups> {
    return this.http.get<Lookups>(
      `${environment.url}LookUp/GetSubUnitFloors?subUnitId=${id}`
    );
  }
  // ---------------------------------
  // GET ALL OFFICES IN FLOOR LOOKUP
  // ---------------------------------
  getOfficesInFloor(id: number): Observable<Lookups> {
    return this.http.get<Lookups>(
      `${environment.url}LookUp/GetFloorOffices?floorId=${id}`
    );
  }
  // ---------------------------------
  // GET ALL ASSETS  LOOKUP
  // ---------------------------------
  getAllAssets(): Observable<Lookups> {
    return this.http.get<Lookups>(`${environment.url}LookUp/GetAllAssets`);
  }
   // ---------------------------------
  // GET ALL ASSETS BY BUILDING ID  LOOKUP
  // ---------------------------------
  getAllAssetsByBuildingId(id: number): Observable<Lookups> {
    return this.http.get<Lookups>(`${environment.url}LookUp/GetBuildingOfAsset?BuildingId=${id}`);
  }
   // ---------------------------------
  // GET ALL ASSETS BY FLOOR IDS  LOOKUP
  // ---------------------------------
  getAllAssetsByFloorIds(floorIds: number[]): Observable<Lookups> {
    const params = floorIds.map(id => `FloorIds=${id}`).join('&');
    return this.http.get<Lookups>(`${environment.url}LookUp/GetFloorOfAsset?${params}`);
  }
  // ---------------------------------
  // Get All Assets By Search  LOOKUP
  // ---------------------------------
  GetAllAssetsBySearch(number): Observable<Lookups> {
    return this.http.get<Lookups>(
      `${environment.url}LookUp/GetAllAssetsByBuildingOfficeId?officeId=${number}`
    );
  }
  // ---------------------------------
  // GET ALL ASSET TYPES   LOOKUP
  // ---------------------------------
  getAllAssetTypes(): Observable<Lookups> {
    return this.http.get<Lookups>(`${environment.url}LookUp/GetAssetTypes`);
  }
  // ---------------------------------
  // GET ALL ASSET TYPES MAIN CATEGORIES LOOKUP
  // ---------------------------------
  getAllAssetTypesMainCategories(id: number): Observable<Lookups> {
    return this.http.get<Lookups>(
      `${environment.url}LookUp/GetAssetTypeCategories?assetTypeId=${id}`
    );
  }
  // ---------------------------------
  // GET ALL ASSET TYPES SUB CATEGORIES LOOKUP
  // ---------------------------------
  getAllAssetTypesSubCategories(id: number): Observable<Lookups> {
    return this.http.get<Lookups>(
      `${environment.url}LookUp/GetAssetCategorySubCategories?categoryId=${id}`
    );
  }
  // -----------------------------------------
  // GET ALL Primary Maintenance Type LOOKUP
  // ------------------------------------------
  getAllPrimaryMaintenanceType(): Observable<Lookups> {
    return this.http.get<Lookups>(
      `${environment.url}LookUp/GetPrimaryMaintenanceType`
    );
  }
  // -----------------------------------------
  // GET ALL Sub Maintenance Type LOOKUP
  // ------------------------------------------
  getMaintTypesByParent(id: number): Observable<Lookups> {
    return this.http.get<Lookups>(
      `${environment.url}LookUp/GetMaintTypesByParent?parentId=${id}`
    );
  }

  // --------------------------------------------------
  // GET ALL Maintenance Consulting Projects LOOKUP
  // ---------------------------------------------------

  getMaintenanceConsultingProjects(): Observable<Lookups> {
    return this.http.get<Lookups>(
      `${environment.url}LookUp/GetConsultancyMaintContractor`
    );
  }
  // -----------------------------------------------
  // GET ALL Maintenance Execute Projects LOOKUP
  // ----------------------------------------------
  getMaintenanceExecutiveProjects(): Observable<Lookups> {
    return this.http.get<Lookups>(
      `${environment.url}LookUp/GetSupervisorMaintContractor`
    );
  }

  // -----------------------------------------------
  // GET MALFUNCTION TYPES LOOKUP
  // ----------------------------------------------
  getMalfunctionTypes(): Observable<Lookups> {
    return this.http.get<Lookups>(
      `${environment.url}LookUp/GetPrimaryMaintenanceType`
    );
  }

  // -----------------------------------------------
  // -----------------------------------------------
  // -----------------------------------------------
  // -----------------------------------------------
  // PROJECTS SECTION LOOKUPS
  // -----------------------------------------------
  // -----------------------------------------------
  // -----------------------------------------------
  // -----------------------------------------------

  getProjectClassifications(): Observable<Lookups> {
    return this.http.get<Lookups>(
      `${environment.url}LookUp/GetProjectClassification`
    );
  }
  getProjectStatus(): Observable<Lookups> {
    return this.http.get<Lookups>(`${environment.url}LookUp/GetProjectStatue`);
  }
  getProjectType(): Observable<Lookups> {
    return this.http.get<Lookups>(`${environment.url}LookUp/GetProjectTypes`);
  }

  getContractors(): Observable<Lookups> {
    return this.http.post<Lookups>(
      `${environment.url}Office/GetOfficeByUser`,
      {}
    );
  }
  getSupervisorOffice(): Observable<Lookups> {
    return this.http.get<Lookups>(
      `${environment.url}LookUp/GetSupervisorOffice`,
      {}
    );
  }
  getManagers(): Observable<Lookups> {
    return this.http.get<Lookups>(
      `${environment.url}Project/GetProjectManager`
    );
  }
  getProjects(): Observable<Lookups> {
    return this.http.get<Lookups>(`${environment.url}LookUp/GetProjects`);
  }
  getProjectTasks(): Observable<Lookups> {
    return this.http.get<Lookups>(`${environment.url}LookUp/GetAllProjectTask`);
  }
  getVisitRequestTypes(): Observable<Lookups> {
    return this.http.get<Lookups>(
      `${environment.url}LookUp/GetVisitRequestType`
    );
  }

  getUserTypes(): Observable<Lookups> {
    return this.http.get<Lookups>(`${environment.url}LookUp/GetUserTypes`);
  }
  getOfficeList(): Observable<Lookups> {
    return this.http.get<Lookups>(`${environment.url}LookUp/GetOfficelist`);
  }
  GetOfficeOfAssetList(id): Observable<Lookups> {
    return this.http.get<Lookups>(`${environment.url}LookUp/GetOfficeOfAsset`, {
      params: { assetId: id },
    });
  }
    GetOfficeOfBuilding(id): Observable<Lookups> {
    return this.http.get<Lookups>(`${environment.url}LookUp/GetOfficeOfBuilding`, {
      params: { buildingId: id },
    });
  }
  getSuperVisorProjectsList(): Observable<Lookups> {
    return this.http.get<Lookups>(
      `${environment.url}Project/GetSuperVisiorProjects`
    );
  }
  getSupervisorOfficeList(): Observable<Lookups> {
    return this.http.get<Lookups>(
      `${environment.url}LookUp/GetSupervisorOffice`
    );
  }
  getAllExecutiveProjectsList(): Observable<Lookups> {
    return this.http.get<Lookups>(
      `${environment.url}VisitRequest/GetMyExcutiveProjects`
    );
  }
  getAllExecutiveProjectsHaveOfficeList(): Observable<Lookups> {
    return this.http.get<Lookups>(
      `${environment.url}VisitRequest/GetMyExecutiveProjectsHaveOffice`
    );
  }
  getProjectManagersByOfficeId(id): Observable<Lookups> {
    return this.http.get<Lookups>(
      environment.url + 'LookUp/GetAllProjectManagersByOfficeId',
      { params: { officeId: id } }
    );
  }
  getOfficesByType(id): Observable<Lookups> {
    return this.http.get<Lookups>(
      environment.url + 'LookUp/GetOfficeListByType?officeTypeId=' + id
    );
  }
   GetBuildingFloors(id): Observable<Lookups> {
    return this.http.get<Lookups>(
      environment.url + 'LookUp/GetBuildingFloors?BuildingId=' + id
    );
  }
    GetFloorOrBuildingOffices(id): Observable<any> {
    return this.http.get<any>(
      environment.url + 'LookUp/GetBuildingOfficesAndFloors?BuildingId=' + id
    );
  }
// GetFloorOrBuildingOffices(floorId?, buildingId?): Observable<Lookups> {
//   const floorParam = floorId ? `floorId=${floorId}` : 'floorId=';
//   const buildingParam = buildingId ? `BuildingId=${buildingId}` : 'BuildingId=';

//   return this.http.get<Lookups>(
//     `${environment.url}LookUp/GetFloorOrBuildingOffices?${floorParam}&${buildingParam}`
//   );
// }
  getKpi():Observable<Lookups>{
       return this.http.get<Lookups>(
      environment.url + 'LookUp/GetKPIs'
    );
  }
    getContractEvaluationTerms():Observable<Lookups>{
       return this.http.get<Lookups>(
      environment.url + 'LookUp/GetContractEvaluationTerms'
    );
  }
  // ---------------------------------------
  // GET ALL Visit Requests Status LOOKUP
  // ---------------------------------------
  getVisitRequestsStatus() {
    return this.http.get(
      environment.url + 'LookUp/GetMaintenanceRequestStatus'
    );
  }
  // ---------------------------------------
  // GET INVENTORY LOOKUPS
  // ---------------------------------------
  getAllInventoryCategories() {
    return this.http.get(environment.url + 'LookUp/GetInvintoryType');
  }
  getInventoryMeasuringUnits() {
    return this.http.get(environment.url + 'LookUp/GetAllInventoryUnit');
  }
  // ---------------------------------------
  // GET Piece LOOKUPS
  // ---------------------------------------
  GetAllInventoryPiece() {
    return this.http.get(environment.url + 'LookUp/GetAllInventoryPiece');
  }
  getStatus() {
    return this.http.get(
      environment.url + 'LookUp/GetAllPiecesRequestStatusType'
    );
  }
  Getperiodss() {
    return this.http.get(environment.url + 'LookUp/Getperiods');
  }
  GetmaintPlanTypeForEves() {
    return this.http.get(environment.url + 'LookUp/GetmaintPlanTypeForEves');
  }
  GetEveContracterType() {
    return this.http.get(environment.url + 'LookUp/GetEveContracterType');
  }
   GetPlanMalfunctionTypeId() {
    return this.http.get(environment.url + 'LookUp/GetPlanMalfunctionTypeId');
  }
  GetSites() {
    return this.http.get<Lookups>(`${environment.url}LookUp/GetSites`);
  }
  // ---------------------------------------
  // GET ALL Request Priorety LOOKUP
  // ---------------------------------------
  getRequestPriorety() {
    return [
      { name: 'عاجل', id: 1 },
      { name: 'عادي', id: 2 },
    ];
  }

  // ---------------------------------------
  // List By Filter Genric
  // ---------------------------------------

  getListByFilterGenric(
    pagenation: any,
    filterDataParams: FilterDataParams,
    controllerRoute: string,
    routeName: string = 'GetResultsByFilter',
    responseType: 'json' | 'blob' = 'json',
    assetId?: number,
    mainCatId?:number
  ): Observable<any> {
    let params = new HttpParams();
    params = params.set('SkipCount', pagenation?.first ? pagenation.first : 0);
    params = params.set(
      'MaxResultCount',
      pagenation?.rows ? pagenation.rows : 10
    );
    if (
      filterDataParams?.renderType != undefined &&
      filterDataParams?.renderType != null
    ) {
      params = params.set('renderType', filterDataParams?.renderType);
    }
    if (
      filterDataParams?.filterItems != undefined &&
      filterDataParams?.filterItems != null
    ) {
      let jsonString = this.generateJson(filterDataParams?.filterItems);

      params = params.set('Filter', jsonString);
    }
    if (filterDataParams?.lang != undefined && filterDataParams?.lang != null) {
      params = params.set('Lang', filterDataParams?.lang);
    }
    if (
      filterDataParams?.fullResult != undefined &&
      filterDataParams?.fullResult != null
    ) {
      params = params.set('fullResult', filterDataParams?.fullResult);
    }
    if (
      filterDataParams?.searchTerm != undefined &&
      filterDataParams?.searchTerm != null
    ) {
      params = params.set('SearchTerm', filterDataParams?.searchTerm);
    }
    if (
      filterDataParams?.ProjectId != undefined &&
      filterDataParams?.ProjectId != null
    ) {
      params = params.set('ProjectId', filterDataParams?.ProjectId);
    }
    if (
      filterDataParams?.GlobalProjectId != undefined &&
      filterDataParams?.GlobalProjectId != null
    ) {
      params = params.set('GlobalProjectId', filterDataParams?.GlobalProjectId);
    }
     if (
      filterDataParams?.mainCatId != undefined &&
      filterDataParams?.mainCatId != null
    ) {
      params = params.set('mainCatId', filterDataParams?.mainCatId);
    }

    if (
      filterDataParams &&
      filterDataParams.ProjectType !== undefined &&
      filterDataParams.ProjectType !== null
    ) {
      params = params.set('ProjectType', filterDataParams.ProjectType);
    }
    if (
      filterDataParams?.sortBy != undefined &&
      filterDataParams?.sortBy != null
    ) {
      params = params.set('SortBy', filterDataParams?.sortBy);
    }
    if (
      filterDataParams?.sortingDirection != undefined &&
      filterDataParams?.sortingDirection != null
    ) {
      params = params.set(
        'SortingDirection',
        filterDataParams?.sortingDirection
      );
    }
    if (
      filterDataParams &&
      filterDataParams.filterType !== undefined &&
      filterDataParams.filterType !== null
    ) {
      params = params.set('FilterType', filterDataParams.filterType);
    }
    if (
      filterDataParams?.ExtraPrams != undefined &&
      filterDataParams?.ExtraPrams != null
    ) {
      filterDataParams?.ExtraPrams.forEach((element) => {
        params = params.set(element.key, element.value);
      });
    }
    if (filterDataParams &&
      filterDataParams.AssetId !== undefined &&
      filterDataParams.AssetId !== null) {
      params = params.set('AssetId', filterDataParams?.AssetId);
    }
    return this.http.get<any>(
      this.baseUrl + controllerRoute + '/' + routeName,
      { params: params, responseType: responseType as any }
    );
  }

  generateJson(items: JsonItem[]): string {
    const result: { [key: string]: { Operator: string; Value: string } } = {};

    for (const item of items) {
      result[item.key] = { Operator: item.operator, Value: item.value };
    }

    return JSON.stringify(result, null); // Indent with 2 spaces for better readability
  }

  createJsonItem(
    selectName: string,
    selectedValue: string,
    operator: string
  ): any {
    // Create and return a JSON item based on the selectName, selectedValue, and operator
    return {
      key: selectName,
      operator: operator,
      value: selectedValue,
    };
  }

  createParamItem(selectName: string, selectedValue: string): any {
    // Create and return a JSON item based on the selectName, selectedValue, and operator
    return {
      key: selectName,
      value: selectedValue,
    };
  }
}

export interface JsonItem {
  key: string;
  value: string;
  operator: string;
}

export interface ParamItem {
  key: string;
  value: string;
  operator?: string;
}
export class FilterDataParams {
  constructor(
    pageNumber?: number,
    searchTerm?: string,
    filter?: string,
    lang?: string,
    sortingDirection?: string,
    sortBy?: string,
    maxResultCount: number = 10,
    filterItems?: JsonItem[],
    ExtraPrams?: ParamItem[],
    fullResult: boolean = false,
    ProjectId?: number,
    GlobalProjectId?: number,
    skipCount?: number,
    filterType?: number,
    ProjectType?: number,
    renderType?: number,
    AssetId?:number,
    mainCatId?:number
  ) {
    this.pageNumber = pageNumber;
    this.searchTerm = searchTerm;
    this.lang = lang;
    this.sortingDirection = sortingDirection;
    this.sortBy = sortBy;
    this.maxResultCount = maxResultCount;
    this.filterItems = filterItems;
    this.ExtraPrams = ExtraPrams;
    this.fullResult = fullResult;
    this.filterType = filterType;
    this.ProjectType = ProjectType;
    this.ProjectId = ProjectId;
    this.GlobalProjectId = GlobalProjectId;
    this.skipCount = skipCount;
    this.renderType = renderType;
    this.AssetId=AssetId
    this.mainCatId=mainCatId
  }
  filterType?: number;
  pageNumber?: number;
  searchTerm?: string;
  lang?: string;
  sortingDirection?: string;
  sortBy?: string;
  maxResultCount: number;
  filterItems?: JsonItem[];
  ExtraPrams?: ParamItem[];
  fullResult: boolean;
  ProjectId?: number;
  GlobalProjectId?: number;
  skipCount?: number;
  ProjectType?: number;
  renderType?: number;
  AssetId?:number
  mainCatId?:number
}
