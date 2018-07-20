import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, map, tap} from 'rxjs/operators';

import {Hero} from './hero';
import {MessageService} from './message.service';

const httpOptions = {headers: new HttpHeaders({'Content-Type': 'application/json'})};

@Injectable({
  providedIn: 'root'
})

export class HeroService {

  private heroesUrl = 'api/heroes';

  constructor(private messageService: MessageService,
    private http: HttpClient) {}

  getHeroes(): Observable<Hero[]> {
    this.log('fetched heroes');
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(tap(heroes => this.log('fetched heroes')), catchError(this.handleError('getHeroes', [])));
  }

  getHero(id: number): Observable<Hero> {
    const url = this.heroesUrl + '/' + id;
    return this.http.get<Hero>(url).pipe(tap(_ => this.log('fetched hero id= ' + id),
      catchError(this.handleError<Hero>('getHero id= ' + id))));
  }

  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, httpOptions).pipe(
      tap(_ => this.log('updated hero id= ' + hero.id)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, httpOptions)
      .pipe(tap((h: Hero) => this.log('added hero w/ id= ' + h.id)),
      catchError(this.handleError<Hero>('addHero')));
  }

  deleteHero(hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = this.heroesUrl + '/' + id;

    return this.http.delete<Hero>(url, httpOptions).pipe(
      tap(_ => this.log('deleted hero id= ' + id)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }

  searchHeroes(str: string): Observable<Hero[]> {
    if (!str.trim()) {
      return of([]);
    }

    return this.http.get<Hero[]>(this.heroesUrl + '/?name=' + str).pipe(
      tap(_ => this.log('foun heroes matching ' + str)),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );

  }

  private log(message: string) {
    this.messageService.add('HeroService: ' + message);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);

      this.log(operation + ' failed: ' + error.message);

      return of(result as T);
    };
  }
}
