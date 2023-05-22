import { FC, InputHTMLAttributes } from "react";
import { Input, FormInputLabel, Group } from "./form-input.styles"

export type FormInputProps = { label: string;}  & InputHTMLAttributes<HTMLInputElement>

const FormInput: FC<FormInputProps> = ({label, ...otherProps}) => {
  return (
    <Group>
        <Input {...otherProps}/>
        { label && (
            <FormInputLabel shrink={Boolean(
               otherProps && 
               otherProps.value === "string" &&
               otherProps.value.length)}>
               {label}
            </FormInputLabel>
        )}
    </Group>
  )
}

export default FormInput