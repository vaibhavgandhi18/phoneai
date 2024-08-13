import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AIDataService {
    private apiUrl = '/assets/data/aicalls.json';
    private sendCallUrl = 'https://api.bland.ai/v1/calls';

    constructor(private http: HttpClient) {}

    getData(): Observable<any> {
        return this.http.get<any>(this.apiUrl);
    }

    userAgentCall(phoneNumber: number, prompt: string): Observable<any> {
        var data = {
            phone_number: phoneNumber,
            task: prompt,
            voice_id: 1,
            reduce_latency: false,
            transfer_phone_number: null,
        };
        return this.http.post<any>(this.sendCallUrl, data, {
            headers: {
                Authorization: 'sk-pgldljte7f9ucdfvsaw4lv664dg46m1v2k7lr6a6z5cq5eyh5wrdpry9w91grxcr69',
                'Content-Type': 'application/json',
            },
        });
    }

    //   postData(data: any): Observable<any> {
    //     return this.http.post<any>(this.apiUrl, data);
    //   }
}
