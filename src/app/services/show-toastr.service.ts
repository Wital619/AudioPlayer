import {Injectable} from '@angular/core';
import {ToastrService} from 'ngx-toastr';

@Injectable()
export class ShowToastrService {
  constructor(private toastr: ToastrService) {}

  showError(message: string, error?) {
    this.toastr.error(message);
    console.log(error);
  }

  showSuccess(message: string) {
    this.toastr.success(message);
  }

  showWarning(message: string) {
    this.toastr.warning(message);
  }
}
