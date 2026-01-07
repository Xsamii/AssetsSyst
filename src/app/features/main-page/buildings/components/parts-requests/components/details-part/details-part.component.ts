import { Component } from '@angular/core';
import { PartsService } from '../../services/parts.service';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { StatusParts } from 'src/app/Shared/enums/status-parts';

@Component({
  selector: 'app-details-part',
  templateUrl: './details-part.component.html',
  styleUrls: ['./details-part.component.scss'],
  providers: [DatePipe],
})
export class DetailsPartComponent {
  parts:any[] =[1,2]
  currentParts:any
  id:number;
  PartsHistory:any;
  status:StatusParts;
  
  constructor( private _route: ActivatedRoute,
      private PartsService:PartsService,
      private datePipe:DatePipe) {
  }
  ngOnInit(): void {
   
    this._route.params.subscribe(res => {
      this.id = res['id'];
      this.getData(this.id);
    
    })
    
   
}
getData(id: number) {
  
  this.PartsService.getById(id).subscribe((data) => {
    this.currentParts = data?.data

  });
}

}