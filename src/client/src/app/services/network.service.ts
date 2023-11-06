import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class NetworkService {
  host: string = 'http://localhost:5000/';

  constructor(private http: HttpClient) {}

  getHeaders() {
    const headers = new HttpHeaders();
    headers.set('Access-Control-Allow-Origin', this.host);
    headers.set('Content-Type', 'application/json');
    return headers;
  }

  weather(): Observable<any> {
    const headers = this.getHeaders();

    const location =
      localStorage.getItem('location') != null &&
      localStorage.getItem('location') != undefined &&
      localStorage.getItem('location') != ''
        ? localStorage.getItem('location')
        : 'Maribor';

    return this.http
      .get<any>(this.host + 'weather/forecast/' + location, {
        headers,
      })
      .pipe(
        map((data) => {
          localStorage.setItem('forecast', JSON.stringify(data.forecast));
          localStorage.setItem(
            'clothesIcons',
            JSON.stringify(data.clothesIcons)
          );
          return data;
        })
      );
  }

  suggestions(user_id: string): Observable<any> {
    const headers = this.getHeaders();

    const data = {
      user_id: user_id,
      location:
        localStorage.getItem('location') != null
          ? localStorage.getItem('location')
          : 'Maribor',
    };

    return this.http
      .post<any>(this.host + 'weather/suggestions', data, {
        headers,
      })
      .pipe(
        map((data: any) => {
          let categories: any = [];
          let stats: any = [];
          data.forecast.forEach((day: any) => {
            categories.push({ title: day.title, active: false });
            const stat: any = [
              {
                title: 'Temp',
                value: String(day.temp) + ' °C',
                icon: this.getStats(0, day.temp, day.prec, day.wind),
              },
              {
                title: 'Precipitation',
                value: String(day.prec) + ' mm',
                icon: this.getStats(1, day.temp, day.prec, day.wind),
              },
              {
                title: 'Wind speed',
                value: String(day.wind) + ' km/h',
                icon: this.getStats(2, day.temp, day.prec, day.wind),
              },
            ];
            stats.push(stat);
          });
          data.categories = categories;
          data.stats = stats;

          return data;
        })
      );
  }

  login(user: any): Observable<any> {
    const headers = this.getHeaders();

    return this.http
      .post<any>(this.host + 'user/login', user, {
        headers,
      })
      .pipe(
        map((data) => {
          localStorage.setItem('user', JSON.stringify(data));
          return data;
        })
      );
  }

  register(user: any): Observable<any> {
    const headers = this.getHeaders();

    return this.http
      .post<any>(this.host + 'user/register', user, {
        headers,
      })
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  updateUser(user: any): Observable<any> {
    const headers = this.getHeaders();

    return this.http
      .put<any>(this.host + 'user/update', user, {
        headers,
      })
      .pipe(
        map((data) => {
          if (
            data != undefined &&
            data.acknowledged != undefined &&
            data.acknowledged
          ) {
            localStorage.setItem('user', JSON.stringify(user));
          }
          return data;
        })
      );
  }

  delete(_id: any): Observable<any> {
    const headers = this.getHeaders();

    return this.http
      .delete<any>(this.host + 'user/delete', {
        headers,
        body: {
          _id: _id,
        },
      })
      .pipe(
        map((data) => {
          if (
            data != undefined &&
            data.acknowledged != undefined &&
            data.acknowledged
          ) {
            localStorage.removeItem('user');
          }
          return data;
        })
      );
  }

  wardrobeItems(_id: string, index: number, sindex: any): Observable<any> {
    const headers = this.getHeaders();

    const data = {
      user_id: _id,
      category: index,
      subcategory: sindex,
    };

    return this.http
      .post<any>(this.host + 'item/get', data, {
        headers,
      })
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  wardrobeItemsSimiliar(item: any): Observable<any> {
    const headers = this.getHeaders();

    return this.http
      .post<any>(this.host + 'item/get/similar', item, {
        headers,
      })
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  createWardrobeItem(item: any): Observable<any> {
    const headers = this.getHeaders();

    return this.http
      .post<any>(this.host + 'item/create', item, {
        headers,
      })
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  updateWardrobeItem(item: any): Observable<any> {
    const headers = this.getHeaders();

    return this.http
      .put<any>(this.host + 'item/update', item, {
        headers,
      })
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  deleteWardrobeItem(_id: any): Observable<any> {
    const headers = this.getHeaders();

    return this.http
      .delete<any>(this.host + 'item/delete', {
        headers,
        body: {
          _id: _id,
        },
      })
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  getOutfits(user_id: string, season: number): Observable<any> {
    const headers = this.getHeaders();

    return this.http
      .get<any>(this.host + 'outfit/get/multiple/' + season + '/' + user_id, {
        headers,
      })
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  getOutfit(_id: string): Observable<any> {
    const headers = this.getHeaders();

    return this.http
      .get<any>(this.host + 'outfit/get/single/' + _id, {
        headers,
      })
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  createOutfit(outfit: any): Observable<any> {
    const headers = this.getHeaders();

    return this.http
      .post<any>(this.host + 'outfit/create', outfit, {
        headers,
      })
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  updateOutfit(outfit: any): Observable<any> {
    const headers = this.getHeaders();

    return this.http
      .put<any>(this.host + 'outfit/update', outfit, {
        headers,
      })
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  deleteOutfit(_id: any): Observable<any> {
    const headers = this.getHeaders();

    return this.http
      .delete<any>(this.host + 'outfit/delete', {
        headers,
        body: {
          _id: _id,
        },
      })
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  getEval(): Observable<any> {
    const headers = this.getHeaders();

    return this.http
      .get<any>(this.host + 'evaluation', {
        headers,
      })
      .pipe(
        map((data) => {
          let temp: any = [];
          let prec: any = [];
          let wind: any = [];

          data.forEach((e: any) => {
            if (e.feature == 'temp_mean') {
              temp.push(e);
            }
            if (e.feature == 'precipitation') {
              prec.push(e);
            }
            if (e.feature == 'wind_speed') {
              wind.push(e);
            }
          });

          temp.sort((a: any, b: any) => {
            const dateA = Date.parse(a.date);
            const dateB = Date.parse(b.date);
            return dateA - dateB;
          });

          prec.sort((a: any, b: any) => {
            const dateA = Date.parse(a.date);
            const dateB = Date.parse(b.date);
            return dateA - dateB;
          });

          wind.sort((a: any, b: any) => {
            const dateA = Date.parse(a.date);
            const dateB = Date.parse(b.date);
            return dateA - dateB;
          });

          const res: any = {
            temp: temp,
            prec: prec,
            wind: wind,
          };

          return res;
        })
      );
  }

  getStats(i: number, t: number, p: number, w: number) {
    let icon = 'assets/sys-icons/status-inactive.svg';
    switch (i) {
      case 0:
        icon = t < 10 ? 'assets/sys-icons/status-bad.svg' : icon;
        icon =
          t >= 10 && t < 15 ? 'assets/sys-icons/status-moderate.svg' : icon;
        icon = t >= 15 && t < 30 ? 'assets/sys-icons/status-good.svg' : icon;
        icon = t >= 30 ? 'assets/sys-icons/status-bad.svg' : icon;
        break;
      case 1:
        icon = p < 2.5 ? 'assets/sys-icons/status-good.svg' : icon;
        icon =
          p >= 2.5 && p < 7.6 ? 'assets/sys-icons/status-moderate.svg' : icon;
        icon = p >= 7.6 ? 'assets/sys-icons/status-bad.svg' : icon;
        break;
      case 2:
        icon = w < 20 ? 'assets/sys-icons/status-good.svg' : icon;
        icon =
          w >= 20 && w < 30 ? 'assets/sys-icons/status-moderate.svg' : icon;
        icon = w >= 30 ? 'assets/sys-icons/status-bad.svg' : icon;
        break;
    }

    return icon;
  }
}
