import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { AuthResponse } from '@auth/interfaces/auth-response.interface';
import { User } from '@auth/interfaces/user.interface';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment.development';

type AuthStatus = 'checking' | 'authentificated' | 'not-authentificated'
const base_URL = environment.BASE_URL


@Injectable({providedIn: 'root'})
export class AuthService {
    
    private router = inject(Router)
    private _authStatus = signal<AuthStatus>('checking')
    private _user = signal<User | null>(null)
    // private _token = signal<string|null>(null)
    private _token = signal<string|null>(localStorage.getItem('token'))

    private http = inject(HttpClient)


    chekStatusResource = rxResource({
        // params: () => this.checkStatus(),
        stream: () => this.checkStatus(),
    })


    authStatus = computed(() => {
        if( this._authStatus() === 'checking') return 'checking';

        if( this._user()){
            return 'authentificated'
        }

        return 'not-authentificated'

    })
    user = computed<User | null>( () => this._user())
    token = computed(this._token )

    isAdmin = computed(() => this._user()?.roles.includes('admin') ?? false )

    login(email: string, password: string): Observable<boolean>{

        return this.http.post<AuthResponse>(`${base_URL}/auth/login`, {
            email: email,
            password
        }).pipe(
            map(resp => this.handleAuthSuccess(resp)),
            catchError((error: any) => this.handleAuthError(error))
        )
    }

    //Checkl Authentication
    checkStatus(): Observable<boolean>{

        const token = localStorage.getItem('token')
        if(!token) {
            this.logout()
            return of(false)
        }


        //agregar el cache para no volver a leer el estado
        return this.http.get<AuthResponse>(`${base_URL}/auth/check-status`, {

            // headers: {
            //     Authorization: `Bearer ${token}`,
            // },

        }).pipe(
            map(resp => this.handleAuthSuccess(resp)),
            catchError((error: any) => this.handleAuthError(error))
        )
    }


    logout(){
        this._user.set(null);
        this._token.set(null);
        this._authStatus.set('not-authentificated')

        localStorage.removeItem('token')
        // this.router.navigate(['/auth/login'])
    }

    private handleAuthSuccess(resp: AuthResponse){

        this._user.set(resp.user);
        this._authStatus.set('authentificated')
        this._token.set(resp.token)

        localStorage.setItem('token', resp.token)

        return true
    }

    private handleAuthError (error: any){
        this.logout();
        return of(false)
    }


    register(email: string, password: string, fullname: string): Observable<boolean>{
        return this.http.post<AuthResponse>(`${base_URL}/auth/register`, {
            email: email,
            password,
            fullName: fullname
        }).pipe(
            map( resp => {return true}),
            catchError(error => {
                console.log('Error: ', error);
                return of(false)
                
            })
        )
        
    }


}


