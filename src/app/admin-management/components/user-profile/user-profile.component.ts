import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { PopupModal } from '@app/@shared/Models/popup-modal';
// import { ChangeAvatarComponent } from '@app/@shared/modals/components/change-avatar/change-avatar.component';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from '@app/@shared/services/data.service';
import { Observable, Subscription } from 'rxjs';
import { CredentialsService } from '@app/auth';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MustMatch } from '@app/@shared/Models/must-match.validator';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { AppConstants } from '@app/@shared/constants/app-constants';
import { NotifierService } from 'angular-notifier';
import { Permissions } from '@app/@shared/Models/permissions';
import { environment } from '@env/environment';
import { BlobSharedViewStateService } from '@app/@shared/services/azure-services/blob-shared-view-state.service';
import {
  BlobService,
  UploadConfig,
  UploadParams,
} from 'angular-azure-blob-service';
import { BlobUploadsViewStateService } from '@app/@shared/services/azure-services/blob-uploads-view-state.service';
import { BlobDownloadsViewStateService } from '@app/@shared/services/azure-services/blob-downloads-view-state.service';
import { BlobDeletesViewStateService } from '@app/@shared/services/azure-services/blob-deletes-view-state.service';

export interface Tag {
  name: string;
}
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  @ViewChild('tagInput', { static: false }) tagInput: ElementRef<
    HTMLInputElement
  >;
  data: Subscription;
  adminData: any = {};
  Form!: FormGroup;
  isLoading: boolean = false;
  permissionsData: any = [];
  filteredPermissions: Observable<string[]>;
  url: any = '';
  selectedUserImage: any;
  checked = false;
  visible = true;
  selectable = true;
  removable = false;
  addOnBlur = false;
  popupRef = new PopupModal(this.matDialog);

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  tags: String[] = [];
  allPermissions: any;
  containers$ = this.blobState.containers$;
  config: any = {};
  Config: UploadParams = environment.Config;

  @ViewChild('fileInput', { static: false }) fileInput: ElementRef<
    HTMLInputElement
  >;
  uploads$ = this.blobUploadState.uploadedItems$;
  items$ = this.blobState.itemsInContainer$;
  deletedItems$ = this.blobDeletes.deletedItems$;
  downloads$ = this.blobDownloads.downloadedItems$;
  fileUploading = false;

  constructor(
    private matDialog: MatDialog,
    private dataService: DataService,
    private credService: CredentialsService,
    private fd: FormBuilder,
    private notifierService: NotifierService,
    private blobState: BlobSharedViewStateService,
    private blob: BlobService,
    private blobUploadState: BlobUploadsViewStateService,
    private blobDownloads: BlobDownloadsViewStateService,
    private blobDeletes: BlobDeletesViewStateService
  ) {
    this.createForm();
    this.permissions();
  }

  ngOnInit(): void {
    this.getAdminData();
  }

  permissions() {
    this.dataService
      .get_WithoutCount('/admin/get_all_permissions', Permissions)
      .subscribe(
        (res: any) => {
          this.allPermissions = res;
          console.log(this.allPermissions);
          res.forEach((element: any) => {
            this.permissionsData.push(element.name);
          });
          // this.filterPermissions();
        },
        (error) => {}
      );
  }

  private createForm() {
    this.Form = this.fd.group(
      {
        id: [''],
        name: ['', [Validators.required, Validators.maxLength(15)]],
        email: ['', [Validators.required, Validators.email]],
        role: ['', Validators.required],
        joining_date: ['', Validators.required],
        permissions: [{ value: '', disabled: true }, Validators.required],
        image: ['', Validators.required],
        current_password: ['', [Validators.required, Validators.minLength(5)]],
        new_password: ['', [Validators.required, Validators.minLength(5)]],
        confirm_password: ['', [Validators.required, Validators.minLength(5)]],
      },
      {
        validator: MustMatch('new_password', 'confirm_password'),
      }
    );
  }

  hasError = (controlName: string, errorName: string) => {
    return this.Form.controls[controlName].hasError(errorName);
  };

  get permissionControls(): FormArray {
    return this.Form.controls.permissions as FormArray;
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      this.tags.push(value);
    }
    if (input) {
      input.value = '';
    }
  }

  remove(tag: string): void {
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.tags.push(event.option.viewValue);
    this.tagInput.nativeElement.value = '';
    this.Form.controls.permissions.setValue(null);
  }

  onSelectFile(event: { target: { files: Blob[] } }) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      let file: any;
      file = event.target.files;
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      this.selectedUserImage = file[0].name;

      reader.onload = (event) => {
        // called once readAsDataURL is completed
        this.url = event.target.result;
      };

      if (event.target.files !== null) {
        this.fileUploading = true;
        const baseUrl = this.blob.generateBlobUrl(this.Config, file[0].name);
        this.Form.patchValue({
          image: file[0].name + environment.sasContainerUrl,
        });
        this.config = {
          baseUrl: baseUrl,
          sasToken: this.Config.sas,
          blockSize: 1024 * 64, // OPTIONAL, default value is 1024 * 32
          file: event.target.files[0],
          complete: () => {
            console.log('Transfer completed !');
            this.fileUploading = false;
          },

          error: (err: any) => {
            console.log('Error:', err);
          },
          progress: (percent: any) => {
            console.log(percent);
            // this.percent = percent;
          },
        };
        this.uploadFile();
      }
    }
  }
  public delete() {
    this.url = null;
  }
  openItemModal() {
    this.matDialog.closeAll();
    // const dialogRef = this.popupRef.openModal('change-avatar', ChangeAvatarComponent);
  }

  getAdminData() {
    let file = 'Frame 4.png' + new Date().getTime();
    console.log(file);
    let data: any = this.credService.credentials;
    this.dataService
      .getForTesting('/admin/get_admin_details')
      .subscribe((res: any) => {
        data.image_name = res?.data?.image_url;
        this.adminData = data;
        this.setFormValues(data);
      });
  }

  async setFormValues(data: any) {
    data.AdminPermissions.forEach((element: any) => {
      this.tags.push(element.name);
    });

    this.Form.patchValue({
      name: data.name,
      email: data.email,
      role: data.role,
      joining_date: await new Date(data.createdAt),
      permissions: this.tags,
      image: data?.image_name ? data?.image_name : '',
      id: data.id,
    });
    this.url = data?.image_name
      ? environment.sasContainerUrl +
        '/' +
        data?.image_name +
        environment.sasTokenUrl
      : '';
  }

  touch() {
    this.Form.controls.image.markAsTouched();
  }

  uploadFile() {
    this.blob.upload(this.config);
  }

  submit() {
    this.touch();
    if (this.Form.invalid) {
      return false;
    }
    if (!this.fileUploading) {
      this.isLoading = true;
      this.Form.value.permissions = JSON.stringify(this.tags);
      let permissionArr: any = [];
      this.allPermissions.forEach((res: any) => {
        this.tags.forEach((elem: any) => {
          if (res.name == elem) {
            permissionArr.push(res.id);
          }
        });
      });
      this.Form.value.permissions_ids = JSON.stringify(permissionArr);
      this.Form.value.is_active = 1;
      this.Form.value.password = this.Form.value.current_password;
      this.Form.value.joining_date = this.Form.value.joining_date.toDateString();
      this.dataService
        .putFormDataProfile(`/admin/${this.adminData.id}`, this.Form.value)
        .subscribe(
          (res: any) => {
            this.dataService.profileUpdate$.next(true);
            this.notifierService.notify(
              'success',
              'Profile updated successfully'
            );
            this.isLoading = false;
          },
          (error) => {
            this.isLoading = false;
            if (error.error.error) {
              this.notifierService.notify('error', error.error.message);
            } else
              this.notifierService.notify(
                'error',
                'Oops! Something went wrong'
              );
          }
        );
    }
  }

  onSelected(files: FileList): void {
    this.blobUploadState.uploadItems(files);
    this.fileInput.nativeElement.value = '';
  }

  showFileDialog(): void {
    this.fileInput.nativeElement.click();
  }

  onDownloadClick(filename: string): void {
    this.blobDownloads.downloadItem(filename);
  }

  onDeleteClick(filename: string): void {
    console.log(filename);
    this.blobDeletes.deleteItem(filename);
  }

  onClick(containerName: string): void {
    this.blobState.getContainerItems(containerName);
  }
}
