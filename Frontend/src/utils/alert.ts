import Swal, { type SweetAlertIcon } from "sweetalert2";

interface Params {
    title: string;
    text: string;
    icon: SweetAlertIcon;
}

export function showAlert({ title, text, icon }: Params) {
    return Swal.fire({ title, text, icon, confirmButtonText: "Ok" });
}
