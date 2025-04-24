export function selectNetworkThrottlingType(): string | undefined {
    const dialog = document.getElementById('dialog') as HTMLDialogElement;
    const radioBtns = dialog.querySelectorAll('[name="network"]') as NodeListOf<HTMLInputElement>;
    const checkedBtn = Array.from(radioBtns)?.filter(btn => btn.checked)[0];
    return checkedBtn?.value;
}
