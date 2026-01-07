import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  baseUrl = environment.chatBaseUrl +`chat`;

  constructor(public http: HttpClient) {}

  getAnswer(question:string)
  {
    return this.http.get(this.baseUrl +`GetAnswer?Question=${question}`)
  }
  send(body)
  {
    return this.http.post(this.baseUrl,body)
 
  }
}
