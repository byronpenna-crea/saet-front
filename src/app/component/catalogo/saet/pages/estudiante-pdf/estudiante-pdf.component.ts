import {AfterViewInit, Component, OnInit} from '@angular/core';
//import * as pdfjsLib from 'pdfjs-dist';
import * as pdfjsLib from 'pdfjs-dist';

import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-estudiante-pdf',
  templateUrl: './estudiante-pdf.component.html',
  styleUrls: ['./estudiante-pdf.component.css']
})
export class EstudiantePdfComponent implements AfterViewInit {
  pdfSrc: string | undefined;

  constructor(private route: ActivatedRoute) {}

  ngAfterViewInit(): void {
    /*const pdfFile = "pdf_example"//params.get('pdfFile');
    if (pdfFile) {
      console.log('put pdf ------', pdfFile);
      this.pdfSrc = `assets/${pdfFile}.pdf`;
      this.renderPdf(this.pdfSrc);
    }*/
  }

  async renderPdf(url: string) {
    console.log('render pdf ');
    const canvas: HTMLCanvasElement = document.getElementById('pdf-canvas') as HTMLCanvasElement;
    const context = canvas.getContext('2d');
    console.log('context ', context);
    if (!context) {
      console.error('Failed to get canvas context');
      return;
    }

    // Configurar el worker src
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;


    // Cargar el documento PDF
    /*pdfjsLib.getDocument(url).promise.then((pdf) => {
      console.log("promise ---- ", pdf);
    }).catch((e) => {
      console.log("error ", e);
    });*/


    pdfjsLib.getDocument(url).promise.then((pdf) => {
      console.log('pdf ', pdf);
      pdf.getPage(1).then((page) => {
        const viewport = page.getViewport({ scale: 1.5 });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport
        };
        page.render(renderContext);
      });
    }).catch((error) => {
      console.error('Error rendering PDF:', error);
    });
  }



}
