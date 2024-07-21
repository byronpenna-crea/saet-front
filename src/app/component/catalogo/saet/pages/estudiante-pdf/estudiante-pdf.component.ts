import { AfterViewInit, Component } from '@angular/core';
import * as pdfjsLib from 'pdfjs-dist';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-estudiante-pdf',
  templateUrl: './estudiante-pdf.component.html',
  styleUrls: ['./estudiante-pdf.component.css'],
})
export class EstudiantePdfComponent implements AfterViewInit {
  pdfSrc: string | undefined;

  constructor(private route: ActivatedRoute) {
    this.route.paramMap.subscribe(params => {
      const pdfName = params.get('name');
      if (pdfName) {
        this.pdfSrc = `assets/${pdfName}.pdf`;
      }
    });
  }
  rendered: boolean = false;

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (!this.rendered && this.pdfSrc) {
        this.renderPdf(this.pdfSrc);
      }
    });
  }

  async renderPdf(url: string) {
    console.log('render pdf ');
    const canvas: HTMLCanvasElement | null = document.getElementById(
      'pdf-canvas'
    ) as HTMLCanvasElement;
    if (!canvas) {
      console.error('Failed to find canvas element');
      return;
    }

    const context = canvas.getContext('2d');
    console.log('context ', context);
    if (!context) {
      console.error('Failed to get canvas context');
      return;
    }
    this.rendered = true;
    // Configurar el worker src
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

    // Cargar el documento PDF
    try {
      const pdf = await pdfjsLib.getDocument(url).promise;
      console.log('pdf ', pdf);
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 1.5 });
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };
      page.render(renderContext);
    } catch (error) {
      console.error('Error rendering PDF:', error);
    }
  }
}
