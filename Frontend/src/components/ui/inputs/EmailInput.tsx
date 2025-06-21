/* ./src/components/ui/inputs/EmailInput.tsx */
import { EnvelopeIcon } from "@heroicons/react/24/solid";
import { type ComponentPropsWithoutRef, forwardRef } from "react";
import BaseInput from "./BaseInput";

type Props = ComponentPropsWithoutRef<typeof BaseInput>;

const EmailInput = forwardRef<HTMLInputElement, Props>((props, ref) => (
    <BaseInput
        ref={ref}
        type="email"
        icon={<EnvelopeIcon className="w-5 h-5 text-primary" />}
        {...props}
    />
));
EmailInput.displayName = "EmailInput";
export default EmailInput;
