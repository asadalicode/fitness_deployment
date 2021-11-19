import { environment } from '@env/environment';

export class CoachDetail {
  constructor(
    public id: number,
    public first_name: string,
    public last_name: string,
    public user_name: string,
    public email: string,
    public gender: string,
    public phone_number: string,
    public bank_swift_code: string,
    public account_currency: string,
    public account_number: string,
    public iban_number: string,
    public document_type: string,
    public document_number: string,
    public bank_id: string,
    public bank_name: string,
    public country_id: string,
    public signature: string,
    public document_image: string,
    public workout_program_type_ids: [],
    public expiry_date: string,
    public subscription_price: string,
    public full_name: string,
    public image_url: string,
    public country_name: string,
    public is_active: boolean,
    public signed_date: boolean
  ) {}
  static adapt(item: any): CoachDetail {
    return item.rows.map((item: any) => {
      let workoutPrograms: any = [];
      if (item.UserWorkoutProgramTypes.length) {
        item.UserWorkoutProgramTypes.forEach((element: any) => {
          let program_types = {
            id: element.workout_program_type_id,
            name: element.WorkoutProgramType.name,
          };
          workoutPrograms.push(program_types);
        });
      }
      return new CoachDetail(
        item?.id,
        item?.first_name || '-',
        item?.last_name || '-',
        item?.user_name || '-',
        item?.email || '-',
        item?.gender || '-',
        item?.phone_number || '-',
        item?.bankDetails?.bank_swift_code || '-',
        item?.bankDetails?.account_currency || '-',
        item?.bankDetails?.account_number || '-',
        item?.bankDetails?.iban_number || '-',
        item?.bankDetails?.document_type || '-',
        item?.bankDetails?.document_number || '-',
        item?.bankDetails?.bank_id || '-',
        item?.bankDetails?.bank_name || '-',
        item?.bankDetails?.country_id || '-',
        item?.bankDetails?.signature
          ? environment.sasContainerUrl +
            '/' +
            item?.bankDetails?.signature +
            environment.sasTokenUrl
          : '',
        item?.bankDetails?.document_image
          ? environment.sasContainerUrl +
            '/' +
            item?.bankDetails?.document_image +
            environment.sasTokenUrl
          : '',
        workoutPrograms || '-',
        item?.bankDetails?.expiry_date || '-',
        item?.bankDetails?.subscription_price || '-',
        item?.first_name + ' ' + item?.last_name || '-',
        item?.image_url
          ? environment.sasContainerUrl +
            '/' +
            item?.image_url +
            environment.sasTokenUrl
          : '',
        item?.Country?.name,
        item.is_verified || false,
        item?.bankDetails?.createdAt || '-'
      );
    });
  }
}
