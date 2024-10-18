import jsPDF from 'jspdf';

export class PrintPdf {
  private doc: jsPDF;
  public title = '';

  loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve(img);
      img.onerror = err => reject(err);
    });
  }
  constructor(doc: jsPDF) {
    this.doc = doc;
  }
}
