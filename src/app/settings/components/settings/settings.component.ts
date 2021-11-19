import { Component, Inject, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { AppConstants } from '@app/@shared/constants/app-constants';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DataService } from './../../../@shared/services/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { switchMap, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Setting } from '@app/@shared/Models/Setting';
import { environment } from '@env/environment';
import { BlobService, UploadParams } from 'angular-azure-blob-service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  isLoading: boolean = false;
  type: string;
  Form!: FormGroup;
  subscriptionAmountForm!: FormGroup;
  freeGroupContentLimitForm!: FormGroup;
  groupImagesForm!: FormGroup;
  IntroductionVideosForm!: FormGroup;

  data: any = {};
  multiple = false;
  freeGroupFilesImg: File[] = [];
  paidGroupFilesImg: File[] = [];
  introdVideoEnglishFiles: File[] = [];
  introdVideoArabicFiles: File[] = [];
  fileUploading = false;
  Config: UploadParams = environment.Config;
  config: any = {};
  uploadPercent: number = 0;
  englishVideoProgress: number;
  arabicVideoProgress: number;
  englishVideoUploading = false;
  arabicVideoUploading = false;
  constructor(
    private formBuilder: FormBuilder,
    public dataService: DataService,
    private router: Router,
    private route: ActivatedRoute,
    private notifierService: NotifierService,
    private blob: BlobService
  ) {
    this.createForm();
    // this.permissions();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      console.log(params);
    });
    this.getSettingDetails();
  }

  async updateFormValues(data: any) {
    this.subscriptionAmountForm.patchValue({
      textField: data.minimum_subscription_amount,
    });

    this.freeGroupContentLimitForm.patchValue({
      free_main_group_limit: data.free_main_group_limit,
      free_video_limit: data.free_video_limit,
    });

    if (data.free_container_image) {
      this.freeGroupFilesImg.push(data.free_container_image);
      this.groupImagesForm.patchValue({ freeGroupFilesImg: true });
      this.groupImagesForm.patchValue({
        freeGroupFilesImgName: data.free_container_image_name,
      });
      this.touch('freeGroupFilesImg');
    }
    if (data.paid_container_image) {
      this.paidGroupFilesImg.push(data.paid_container_image);
      this.groupImagesForm.patchValue({ paidGroupFilesImg: true });
      this.groupImagesForm.patchValue({
        paidGroupFilesImgName: data.paid_container_image_name,
      });
      this.touch('paidGroupFilesImg');
    }

    if (data.app_intro_video) {
      this.introdVideoEnglishFiles.push(data.app_intro_video);
      this.IntroductionVideosForm.patchValue({ introdVideoEnglishFiles: true });
      this.IntroductionVideosForm.patchValue({
        introdVideoEnglishFilesName: data.app_intro_video_name,
      });
      this.touch('introdVideoEnglishFiles');
    }

    if (data.app_intro_video_arabic) {
      this.introdVideoArabicFiles.push(data.app_intro_video_arabic);
      this.IntroductionVideosForm.patchValue({ introdVideoArabicFiles: true });
      this.IntroductionVideosForm.patchValue({
        introdVideoArabicFilesName: data.app_intro_video_arabic_name,
      });
      this.touch('introdVideoArabicFiles');
    }
  }

  getSettingDetails() {
    this.dataService
      .getSingle('/admin_setting', Setting)
      .subscribe(async (res: any) => {
        let resp = await res[0];

        this.touch('freeGroupFilesImg');
        this.touch('paidGroupFilesImg');
        this.touch('introdVideoEnglishFiles');
        this.touch('introdVideoArabicFiles');

        console.log('resp', resp);
        this.updateFormValues(resp);
      });
  }

  private createForm() {
    this.subscriptionAmountForm = this.formBuilder.group({
      textField: ['', Validators.required],
    });

    this.freeGroupContentLimitForm = this.formBuilder.group({
      free_main_group_limit: ['', Validators.required],
      free_video_limit: ['', Validators.required],
    });

    this.groupImagesForm = this.formBuilder.group({
      freeGroupFilesImg: ['', Validators.required],
      paidGroupFilesImg: ['', Validators.required],
      freeGroupFilesImgName: [''],
      paidGroupFilesImgName: [''],
    });

    this.IntroductionVideosForm = this.formBuilder.group({
      introdVideoEnglishFiles: ['', Validators.required],
      introdVideoArabicFiles: ['', Validators.required],
      introdVideoEnglishFilesName: [''],
      introdVideoArabicFilesName: [''],
    });
  }

  submitIntroductionVideosForm() {
    let IntroductionVideosFormData = {
      app_intro_video: this.IntroductionVideosForm.value
        .introdVideoEnglishFilesName,
      app_intro_video_arabic: this.IntroductionVideosForm.value
        .introdVideoArabicFilesName,
    };

    console.log(IntroductionVideosFormData);
    if (!this.fileUploading) {
      this.isLoading = true;
      this.dataService
        .putGroupImagesData(
          '/admin_setting/updateMatrixContent',
          IntroductionVideosFormData
        )
        .subscribe(
          (res: any) => {
            this.router.navigate(['/', 'home']);
            this.notifierService.notify('success', res.message);
            this.isLoading = false;
          },
          (error) => {
            this.isLoading = false;
          }
        );
    }
  }

  uploadFile() {
    this.blob.upload(this.config);
  }

  uploadImageToAzure(file: File, type?: string) {
    this.fileUploading = true;
    const baseUrl = this.blob.generateBlobUrl(this.Config, file.name);
    this.config = {
      baseUrl: baseUrl,
      sasToken: this.Config.sas,
      blockSize: 1024 * 64, // OPTIONAL, default value is 1024 * 32
      file: file,
      complete: () => {
        console.log('Transfer completed !');
        this.fileUploading = false;
      },

      error: (err: any) => {
        console.log('Error:', err);
      },
      progress: (percent: any) => {
        console.log(percent);
        this.uploadPercent = percent;
        this.uploadProgress(type, this.uploadPercent);
      },
    };
    this.uploadFile();
  }

  uploadProgress(type: string, progress: number) {
    switch (type) {
      case 'englishVideoProgress':
        this.englishVideoUploading = true;
        this.englishVideoProgress = progress;
        if (progress == 100) {
          this.englishVideoUploading = false;
        }
        break;

      case 'arabicVideoProgress':
        this.arabicVideoUploading = true;
        this.arabicVideoProgress = progress;
        if (progress == 100) {
          this.arabicVideoUploading = false;
        }
        break;
    }
  }

  submitgroupImagesForm() {
    let groupImagesFormdata = {
      free_container_image: this.groupImagesForm.value.freeGroupFilesImgName,
      paid_container_image: this.groupImagesForm.value.paidGroupFilesImgName,
    };

    if (!this.fileUploading) {
      this.isLoading = true;
      this.dataService
        .putGroupImagesData(
          '/admin_setting/updateMatrixContent',
          groupImagesFormdata
        )
        .subscribe(
          (res: any) => {
            this.router.navigate(['/', 'home']);
            this.notifierService.notify('success', res.message);
            this.isLoading = false;
          },
          (error) => {
            this.isLoading = false;
          }
        );
    }
  }

  submitsubscriptionAmountForm() {
    let Subscriptiondata = {
      matrix: 'minimum_subscription_amount',
      value: this.subscriptionAmountForm.value.textField,
    };

    this.isLoading = true;
    this.dataService.putFormData('/admin_setting', Subscriptiondata).subscribe(
      (res: any) => {
        console.log('subscription res', res);
        this.router.navigate(['/', 'home']);
        this.notifierService.notify('success', res.message);
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
      }
    );
  }
  submitfreeGroupContentLimitForm() {
    let freeGroupContentLimitdata = [
      {
        matrix: 'free_main_group_limit',
        value: this.freeGroupContentLimitForm.value.free_main_group_limit,
      },
      {
        matrix: 'free_video_limit',
        value: this.freeGroupContentLimitForm.value.free_video_limit,
      },
    ];
    this.isLoading = true;
    this.dataService.put('/admin_setting', freeGroupContentLimitdata).subscribe(
      (res: any) => {
        this.router.navigate(['/', 'home']);
        this.notifierService.notify('success', res.message);
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
      }
    );
  }

  hasErrorTextfield = (controlName: string, errorName: string) => {
    return this.subscriptionAmountForm.controls[controlName]?.hasError(
      errorName
    );
  };
  hasErrorfreeGroupContentLimitForm = (
    controlName: string,
    errorName: string
  ) => {
    return this.freeGroupContentLimitForm.controls[controlName]?.hasError(
      errorName
    );
  };
  hasErrorgroupImagesForm = (controlName: string, errorName: string) => {
    return this.groupImagesForm.controls[controlName].hasError(errorName);
  };

  hasErrorIntroductionVideosForm = (controlName: string, errorName: string) => {
    return this.IntroductionVideosForm.controls[controlName].hasError(
      errorName
    );
  };

  touch(type: string) {
    switch (type) {
      case 'freeGroupFilesImg':
        this.groupImagesForm.controls.freeGroupFilesImg.markAsTouched();
        break;
      case 'paidGroupFilesImg':
        this.groupImagesForm.controls.paidGroupFilesImg.markAsTouched();
        break;
      case 'introdVideoEnglishFiles':
        this.IntroductionVideosForm.controls.introdVideoEnglishFiles.markAsTouched();
        break;
      case 'introdVideoArabicFiles':
        this.IntroductionVideosForm.controls.introdVideoArabicFiles.markAsTouched();
        break;

      case 'default':
        return 0;
    }
  }

  patchFormValues(type: string) {
    switch (type) {
      case 'freeGroupFilesImg':
        this.groupImagesForm.patchValue({ freeGroupFilesImg: true });
        break;
      case 'paidGroupFilesImg':
        this.groupImagesForm.patchValue({ paidGroupFilesImg: true });
        break;
      case 'introdVideoEnglishFiles':
        this.IntroductionVideosForm.patchValue({
          introdVideoEnglishFiles: true,
        });
        break;
      case 'introdVideoArabicFiles':
        this.IntroductionVideosForm.patchValue({
          introdVideoArabicFiles: true,
        });
        break;

      case 'default':
        return 0;
    }
  }

  onSelect(event: { addedFiles: any }, type: string) {
    switch (type) {
      case 'freeGroupFilesImg':
        this.freeGroupFilesImg.push(...event.addedFiles);
        this.patchFormValues('freeGroupFilesImg');
        this.groupImagesForm.patchValue({
          freeGroupFilesImgName:
            this.freeGroupFilesImg[0].name + environment.sasContainerUrl,
        });
        this.uploadImageToAzure(this.freeGroupFilesImg[0]);
        console.log(this.freeGroupFilesImg);
        break;
      case 'paidGroupFilesImg':
        this.paidGroupFilesImg.push(...event.addedFiles);
        this.groupImagesForm.patchValue({
          paidGroupFilesImgName:
            this.paidGroupFilesImg[0].name + environment.sasContainerUrl,
        });
        this.uploadImageToAzure(this.paidGroupFilesImg[0]);

        this.patchFormValues('paidGroupFilesImg');
        break;
      case 'introdVideoEnglishFiles':
        this.introdVideoEnglishFiles.push(...event.addedFiles);
        this.IntroductionVideosForm.patchValue({
          introdVideoEnglishFilesName:
            this.introdVideoEnglishFiles[0].name + environment.sasContainerUrl,
        });
        this.uploadImageToAzure(
          this.introdVideoEnglishFiles[0],
          'englishVideoProgress'
        );
        this.patchFormValues('introdVideoEnglishFiles');
        break;
      case 'introdVideoArabicFiles':
        this.introdVideoArabicFiles.push(...event.addedFiles);
        this.IntroductionVideosForm.patchValue({
          introdVideoArabicFilesName:
            this.introdVideoArabicFiles[0].name + environment.sasContainerUrl,
        });
        this.uploadImageToAzure(
          this.introdVideoEnglishFiles[0],
          'arabicVideoProgress'
        );
        this.patchFormValues('introdVideoArabicFiles');
        break;

      case 'default':
        return 0;
    }
  }

  onRemove(event: File, type: string) {
    switch (type) {
      case 'freeGroupFilesImg':
        this.freeGroupFilesImg.splice(this.freeGroupFilesImg.indexOf(event), 1);
        this.groupImagesForm.patchValue({ freeGroupFilesImg: '' });
        break;
      case 'paidGroupFilesImg':
        this.paidGroupFilesImg.splice(this.paidGroupFilesImg.indexOf(event), 1);
        this.groupImagesForm.patchValue({ paidGroupFilesImg: '' });
        break;
      case 'introdVideoEnglishFiles':
        this.introdVideoEnglishFiles.splice(
          this.introdVideoEnglishFiles.indexOf(event),
          1
        );
        this.IntroductionVideosForm.patchValue({ introdVideoEnglishFiles: '' });
        break;
      case 'introdVideoArabicFiles':
        this.introdVideoArabicFiles.splice(
          this.introdVideoArabicFiles.indexOf(event),
          1
        );
        this.IntroductionVideosForm.patchValue({ introdVideoArabicFiles: '' });
        break;

      case 'default':
        return 0;
    }
  }
}
