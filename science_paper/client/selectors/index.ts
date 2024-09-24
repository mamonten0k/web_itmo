export function selectNetworkThrottlingType() {
    const dialog = document.getElementById('dialog') as HTMLDialogElement;
    const radioBtns = dialog.querySelectorAll('[name="network"]') as NodeListOf<HTMLInputElement>;
    return Array.from(radioBtns)?.filter(btn => btn.checked)[0].value;
}
