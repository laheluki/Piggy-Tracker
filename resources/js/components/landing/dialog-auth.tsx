import { Dialog, DialogContent } from "@/components/ui/dialog";
import FormRegister from "@/components/landing/form-register";
import FormLogin from "@/components/landing/form-login";

import { useModalAuth } from "@/store/use-modal-auth";
import { useBlur } from "@/store/use-blur";

export default function DialogAuth() {
    const { isOpen, view, setModalOpen } = useModalAuth();
    const { setIsBlur, isBlur } = useBlur();

    return (
        <Dialog
            open={isOpen}
            onOpenChange={() => {
                setModalOpen(!isOpen);
                setIsBlur(!isBlur);
            }}
        >
            <DialogContent className="sm:max-w-[475px] px-10 sm:top-20  sm:bottom-auto sm:translate-y-0 sm:left-1/2 sm:-translate-x-1/2">
                {view === "sign-in" && <FormLogin />}

                {view === "sign-up" && <FormRegister />}
            </DialogContent>
        </Dialog>
    );
}
