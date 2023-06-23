/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps } from "@aws-amplify/ui-react";
import { EscapeHatchProps } from "@aws-amplify/ui-react/internal";
import { Listings } from "../models";
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type ListingsUpdateFormInputValues = {};
export declare type ListingsUpdateFormValidationValues = {};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ListingsUpdateFormOverridesProps = {
    ListingsUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
} & EscapeHatchProps;
export declare type ListingsUpdateFormProps = React.PropsWithChildren<{
    overrides?: ListingsUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    listings?: Listings;
    onSubmit?: (fields: ListingsUpdateFormInputValues) => ListingsUpdateFormInputValues;
    onSuccess?: (fields: ListingsUpdateFormInputValues) => void;
    onError?: (fields: ListingsUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: ListingsUpdateFormInputValues) => ListingsUpdateFormInputValues;
    onValidate?: ListingsUpdateFormValidationValues;
} & React.CSSProperties>;
export default function ListingsUpdateForm(props: ListingsUpdateFormProps): React.ReactElement;
