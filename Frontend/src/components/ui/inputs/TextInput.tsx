/* ./src/components/ui/inputs/TextInput.tsx */
import { type ComponentPropsWithoutRef, forwardRef } from "react";
import BaseInput from "./BaseInput";

type Props = ComponentPropsWithoutRef<typeof BaseInput>;

const TextInput = forwardRef<HTMLInputElement, Props>((props, ref) => (
    <BaseInput ref={ref} type="text" {...props} />
));
TextInput.displayName = "TextInput";
export default TextInput;
