import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  EventEmitter,
  Output,
} from '@angular/core';
import { KeyValue } from '../saet-input/saet-input.component';

@Component({
  selector: 'app-richtext',
  templateUrl: './richtext.component.html',
  styleUrls: ['./richtext.component.css'],
})
export class RichtextComponent {
  @Input() text: string = '';
  @Input() name: string = '';
  @Input() value: string = '';
  @Input() testId: string = '';
  @Input() disabled: boolean = false;

  @Output() inputChange = new EventEmitter<KeyValue>();

  onInputChange(event: any, name: string) {
    const newValue = event.htmlValue;
    this.text = newValue;
    this.filterImagesFromURLs();
    this.emitInputChange(newValue, name);
  }

  setupEditor() {
    this.preventImagePaste();
  }

  // Bloquear la inserción de imágenes desde URLs
  preventImagePaste() {
    const editorElement = document.querySelector('.ql-editor');
    if (editorElement) {
      editorElement.addEventListener('paste', (event: any) => {
        const clipboardData = event.clipboardData;
        if (clipboardData) {
          const pastedData = clipboardData.getData('text/html');
          if (pastedData && this.containsImageFromURL(pastedData)) {
            event.preventDefault();
          }
        }
      });
    }
  }

  containsImageFromURL(content: string): boolean {
    const regex = /<img[^>]+src=["'](http|https):\/\/[^"']*["']/;
    return regex.test(content);
  }

  filterImagesFromURLs() {
    const editorElement = document.querySelector('.ql-editor');
    if (editorElement) {
      const images = editorElement.querySelectorAll('img');
      images.forEach(img => {
        const src = img.getAttribute('src');
        if (src && (src.startsWith('http') || src.startsWith('https'))) {
          img.remove(); // Eliminar la imagen del contenido
        }
      });
    }
  }
  private emitInputChange(newValue: string, key: string) {
    this.inputChange.emit({
      key: key,
      value: newValue,
    });
  }
}
