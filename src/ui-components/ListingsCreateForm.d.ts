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
export declare type ListingsCreateFormInputValues = {};
export declare type ListingsCreateFormValidationValues = {};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ListingsCreateFormOverridesProps = {
    ListingsCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
} & EscapeHatchProps;
export declare type ListingsCreateFormProps = React.PropsWithChildren<{
    overrides?: ListingsCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: ListingsCreateFormInputValues) => ListingsCreateFormInputValues;
    onSuccess?: (fields: ListingsCreateFormInputValues) => void;
    onError?: (fields: ListingsCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: ListingsCreateFormInputValues) => ListingsCreateFormInputValues;
    onValidate?: ListingsCreateFormValidationValues;
} & React.CSSProperties>;
export default function ListingsCreateForm(props: ListingsCreateFormProps): React.ReactElement;
