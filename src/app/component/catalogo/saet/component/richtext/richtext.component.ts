import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  EventEmitter,
  Output,
} from '@angular/core';
import { KeyValue } from '../saet-input/saet-input.component';
import { Editor } from 'primeng/editor';
import Quill from 'quill';

interface EditorInitEvent {
  editor: Quill;
}
@Component({
  selector: 'app-richtext',
  templateUrl: './richtext.component.html',
  styleUrls: ['./richtext.component.css'],
})
export class RichtextComponent implements OnChanges {
  @Input() text: string = '';
  @Input() name: string = '';
  @Input() value: string = '';
  @Input() testId: string = '';
  @Input() disabled: boolean = false;
  @Input() isHighlight: boolean = false;
  @Output() inputChange = new EventEmitter<KeyValue>();
  @Output() init = new EventEmitter<{ name: string }>();
  @Output() blurChange = new EventEmitter<KeyValue>();

  onBlurChange(name: string) {
    if (!this.editorInstance) return;

    const newValue = this.editorInstance.root.innerHTML.trim();
    this.emitBlurChange(newValue, name);
  }
  onInputChange(event: any, name: string) {
    const newValue = event.htmlValue;
    this.text = newValue;
    this.filterImagesFromURLs();
    this.emitInputChange(newValue, name);

    if (!this.editorInstance) {
      return;
    }

    const editorBody = this.editorInstance.root as HTMLElement;
    if (this.isHighlight) {
      editorBody.style.backgroundColor = '#fff3cd';
    } else {
      editorBody.style.backgroundColor = '#ffffff';
    }
  }
  private editorInstance?: Quill;
  setupEditor(event: EditorInitEvent): void {
    this.editorInstance = event.editor;
    if (!this.editorInstance) {
      return;
    }
    if (this.isHighlight) {
      const editorBody = this.editorInstance.root as HTMLElement;
      editorBody.style.backgroundColor = '#fff3cd';
    }
    setTimeout(() => {
      this.init.emit({ name: this.name });
    },4000);
    // this.init.emit({name: this.name});
  }

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
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isHighlight'] && this.editorInstance) {
      const editorBody = this.editorInstance.root as HTMLElement;
      editorBody.style.backgroundColor = this.isHighlight
        ? '#fff3cd'
        : '#ffffff';
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
  private emitBlurChange(newValue: string, key: string) {
    this.blurChange.emit({
      key: key,
      value: newValue,
    });
  }
  private emitInputChange(newValue: string, key: string) {
    this.inputChange.emit({
      key: key,
      value: newValue,
    });
  }

  protected readonly onblur = onblur;
}
