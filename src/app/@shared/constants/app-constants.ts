import { DomSanitizer } from '@angular/platform-browser';
import { TableUtil } from './tableUtil';
import * as XLSX from 'xlsx';

export class AppConstants {
  static readUrlAsFile: any;

  static get Instance() {
    return new AppConstants();
  }

  async readUrlAsFile(fileURL: string): Promise<any> {
    // console.log(fileURL);
    return new Promise((resolve) => {
      let xhr = new XMLHttpRequest();
      xhr.open('GET', fileURL);
      xhr.responseType = 'blob';
      xhr.onload = () => {
        let blob: any = xhr.response;
        blob.lastModifiedDate = new Date();
        blob.name = fileURL.split('/').pop();
        resolve(blob);
      };
      xhr.send();
    });
  }

  async downloadExcel(data: any, type?: any) {
    TableUtil.exportArrayToExcel(data, type);
  }

  async importExcel(event: any) {
    /* wire up file reader */
    return new Promise((resolve) => {
      const target: DataTransfer = <DataTransfer>event.target;
      if (target.files.length !== 1) {
        throw new Error('Cannot use multiple files');
      }
      const reader: FileReader = new FileReader();
      reader.readAsBinaryString(target.files[0]);
      reader.onload = (e: any) => {
        /* create workbook */
        const binarystr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary' });

        /* selected the first sheet */
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];

        /* save data */
        const data = XLSX.utils.sheet_to_json(ws); // to get 2d array pass 2nd parameter as object {header: 1}
        console.log(data); // Data will be logged in array format containing objects
        resolve(data);
      };
    });
  }
}
