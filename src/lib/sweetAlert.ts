/** SweetAlertHandling **/
import Swal from "sweetalert2";
import { Messages } from "./config";

export const sweetErrorHandling = async (err: any) => {
  const error = err?.response?.data ?? err;
  const message =
    typeof error === "string" ? error : error?.message ?? Messages.error1;
  await Swal.fire({
    icon: "error",
    text: message,
    showConfirmButton: true,
    confirmButtonText: "OK",
    position: "top",
    customClass: {
      container: "swal-auth-error-container",
      popup: "swal-auth-error-popup",
      icon: "swal-auth-error-icon",
      title: "swal-auth-error-title",
      htmlContainer: "swal-auth-error-content",
      confirmButton: "swal-auth-error-confirm",
    },
  });
};

export const sweetTopSuccessAlert = async (
  msg: string,
  duration: number = 2000
) => {
  await Swal.fire({
    position: "top-end",
    icon: "success",
    title: msg,
    showConfirmButton: false,
    timer: duration,
  });
};

export const sweetTopSmallSuccessAlert = async (
  msg: string,
  duration: number = 2000
) => {
  // pastda: navbar'dagi savat va profil tugmalarini yopib qo'ymasligi uchun
  const Toast = Swal.mixin({
    toast: true,
    position: "bottom-start",
    showConfirmButton: false,
    timer: duration,
    timerProgressBar: true,
  });

  Toast.fire({
    icon: "success",
    title: msg,
  }).then();
};

export const sweetFailureProvider = (
  msg: string,
  show_button: boolean = false,
  forward_url: string = ""
) => {
  Swal.fire({
    icon: "error",
    title: msg,
    showConfirmButton: show_button,
    confirmButtonText: "OK",
  }).then(() => {
    if (forward_url !== "") {
      window.location.replace(forward_url);
    }
  });
};

/** Brend uslubidagi tasdiqlash oynasi (window.confirm o'rniga) */
export const sweetConfirm = async (
  title: string,
  text: string,
  confirmText: string = "Yes",
  cancelText: string = "Not now"
): Promise<boolean> => {
  const result = await Swal.fire({
    icon: "question",
    title,
    text,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    reverseButtons: true,
    focusCancel: true,
  });
  return result.isConfirmed;
};
