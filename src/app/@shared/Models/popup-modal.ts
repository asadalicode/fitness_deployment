import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
export class PopupModal {
  modalDialog: any;

  constructor(public matDialog: MatDialog) {}

  openModal(type: string, componentRef: any, modalData?: object, fromComponent?: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;

    switch (type) {
      case 'login': {
        dialogConfig.width = '450px';
        dialogConfig.id = `modal-${type}`;
        dialogConfig.data = modalData;
        this.modalDialog = this.matDialog.open(componentRef, dialogConfig);
        break;
      }

      case 'view-pdf': {
        dialogConfig.width = '900px';
        dialogConfig.id = `modal-${type}`;
        // dialogConfig.data = modalData;
        dialogConfig.data = {
          type: type,
          data: modalData,
          fromComponent: fromComponent,
        };
        this.modalDialog = this.matDialog.open(componentRef, dialogConfig);
        break;
      }
      case 'user-detail': {
        dialogConfig.width = '700px';
        dialogConfig.id = `modal-${type}`;
        // dialogConfig.data = modalData;
        dialogConfig.data = {
          type: type,
          data: modalData,
          fromComponent: fromComponent,
        };
        this.modalDialog = this.matDialog.open(componentRef, dialogConfig);
        break;
      }

      case 'coach-detail': {
        dialogConfig.width = '700px';
        dialogConfig.height = '440px';

        dialogConfig.id = `modal-${type}`;
        dialogConfig.data = modalData;
        this.modalDialog = this.matDialog.open(componentRef, dialogConfig);
        break;
      }

      case 'delete':
      case 'tick':
      case 'cross': {
        dialogConfig.width = '480px';
        dialogConfig.id = `modal-${type}`;
        (dialogConfig.backdropClass = 'backdropBackground'),
          (dialogConfig.data = {
            type: type,
            data: modalData,
            fromComponent: fromComponent,
          });

        dialogConfig.panelClass = 'custom-modalbox';
        this.modalDialog = this.matDialog.open(componentRef, dialogConfig);
        break;
      }

      case 'arrange-coach': {
        dialogConfig.width = '480px';
        dialogConfig.id = `modal-${type}`;
        (dialogConfig.backdropClass = 'backdropBackground'),
          (dialogConfig.data = {
            type: type,
            data: modalData,
            fromComponent: fromComponent,
          });

        dialogConfig.panelClass = 'custom-modalbox';
        this.modalDialog = this.matDialog.open(componentRef, dialogConfig);
        break;
      }

      case 'add-new':
      case 'add-payout':
      case 'add-faq':
      case 'edit-faq':
      case 'workout-type':

      case 'set-commission': {
        dialogConfig.width = '550px';
        dialogConfig.id = `modal-${type}`;
        dialogConfig.backdropClass = 'backdropBackground';
        dialogConfig.data = {
          type: type,
          data: modalData,
          fromComponent: fromComponent,
        };
        dialogConfig.panelClass = 'custom-modalbox';
        this.modalDialog = this.matDialog.open(componentRef, dialogConfig);
        break;
      }

      default: {
        break;
      }
    }

    return this.modalDialog;
  }

  closeModal() {
    this.modalDialog.close();
  }
}
