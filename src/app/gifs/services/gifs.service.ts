import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Gif, SearchGifsResponse} from "../interfaces/gifs.interfaces";

@Injectable({
  providedIn: 'root'
})
export class GifsService {
  private _apiKey: string = 'Np2NVzgsphkxnMkux7NjJPNNugn0GZYu';
  private _servicioURL: string = 'https://api.giphy.com/v1/gifs';
  private _historial: string[] = [];

  public resultados: Gif[] = [];

  get historial(){
    return [...this._historial];
  }

  constructor(private http: HttpClient) {
      this._historial = JSON.parse(localStorage.getItem('historial')!) || [];
      this.resultados = JSON.parse(localStorage.getItem('resultados')!) || [];
  }

  buscarGifs(query: string){
    query = query.trim().toLowerCase(); // Convierte todas las entradas en minuscula para evitar repetir un valor
    if (!this._historial.includes(query)) { // pregunta si no esta incluido un valor dentro de la busqueda
      this._historial.unshift(query); // si es repetido entonces no lo incluye
      this._historial = this._historial.splice(0, 10);  // Para que solo muestre 10 valores en el dashboard

      localStorage.setItem('historial', JSON.stringify(this._historial));

    }

    const params = new HttpParams()
      .set('api_key', this._apiKey)
      .set('limit', '10')
      .set('q', query);
    //console.log(params.toString());

    this.http.get<SearchGifsResponse>(`${this._servicioURL}/search`, {params})
      .subscribe((response) => {
        this.resultados = response.data;
        localStorage.setItem('resultados', JSON.stringify(this.resultados));
      })

  }
}
