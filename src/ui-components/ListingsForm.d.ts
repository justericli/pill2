/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps } from "@aws-amplify/ui-react";
import { EscapeHatchProps } from "@aws-amplify/ui-react/internal";
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type ListingsFormInputValues = {};
export declare type ListingsFormValidationValues = {};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ListingsFormOverridesProps = {
    ListingsFormGrid?: PrimitiveOverrideProps<GridProps>;
} & EscapeHatchProps;
export declare type ListingsFormProps = React.PropsWithChildren<{
    overrides?: ListingsFormOverridesProps | undefined | null;
} & {
    onSubmit: (fields: ListingsFormInputValues) => void;
    onChange?: (fields: ListingsFormInputValues) => ListingsFormInputValues;
    onValidate?: ListingsFormValidationValues;
} & React.CSSProperties>;
export default function ListingsForm(props: ListingsFormProps): React.ReactElement;
