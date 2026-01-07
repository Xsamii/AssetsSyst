import { HttpParams } from '@angular/common/http';
import { JsonItem } from '../services/shared.service';


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
    skipCount?: number,
    FilterType?: number,
    VisitRequestStatusIds?: any[],
    VisitRequestTypeIds?: any[]
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
    this.skipCount = skipCount;
    this.FilterType = FilterType
    this.VisitRequestStatusIds = this.VisitRequestStatusIds
    this.VisitRequestTypeIds = VisitRequestTypeIds
  }
  pageNumber?: number;
  searchTerm?: string;
  lang?: string;
  sortingDirection?: string;
  sortBy?: string;
  maxResultCount: number;
  filterItems?: JsonItem[];
  ExtraPrams?: ParamItem[];
  fullResult: boolean;
  skipCount: number;
  FilterType: number;
  VisitRequestStatusIds?: any[]
  VisitRequestTypeIds: any[]
}

export interface ParamItem {
  key: string;
  value: string;
  operator?: string;
}
