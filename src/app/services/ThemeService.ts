import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private isDarkMode = false;
  private darkModeSubject = new BehaviorSubject<boolean>(this.isDarkMode);
  public isDarkMode$ = this.darkModeSubject.asObservable();
  selectedColor: string = '#3f51b5';

  constructor() {
    console.log(
      'Estoy en Theme service en el constructor, el valor de isDarkMode es: ' +
        this.isDarkMode
    );
    this.isDarkMode = !this.isDarkMode;
  }

  public toggleTheme() {
    console.log(
      'Estoy en Theme service en toggleTheme, el valor de isDarkMode es: ' +
        this.isDarkMode
    );
    this.isDarkMode = !this.isDarkMode;
    this.darkModeSubject.next(this.isDarkMode);
  }

  changeColor(color: string) {
    this.selectedColor = color;
  }
}
