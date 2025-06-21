/* ./src/components/ui/inputs/PasswordInput.tsx */
import { LockClosedIcon } from "@heroicons/react/24/solid";
import { type ComponentPropsWithoutRef, forwardRef, useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import BaseInput from "./BaseInput";

type Props = ComponentPropsWithoutRef<typeof BaseInput>;

const PasswordInput = forwardRef<HTMLInputElement, Props>((props, ref) => {
    const [visible, setVisible] = useState(false);
    return (
        <BaseInput
            ref={ref}
            type={visible ? "text" : "password"}
            icon={<LockClosedIcon className="w-5 h-5 text-primary" />}
            {...props}
        >
            {/* botão de toggle visibilidade */}
            <button
                type="button"
                onClick={() => setVisible(!visible)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-accent-light focus:outline-none"
                tabIndex={-1}
            >
                {visible ? (
                    <EyeSlashIcon className="w-5 h-5" />
                ) : (
                    <EyeIcon className="w-5 h-5" />
                )}
            </button>
        </BaseInput>
    );
});
PasswordInput.displayName = "PasswordInput";
export default PasswordInput;
