import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled } from "@aws-amplify/datastore";



type EagerUntitledJSON = {
  readonly NewField?: string | null;
}

type LazyUntitledJSON = {
  readonly NewField?: string | null;
}

export declare type UntitledJSON = LazyLoading extends LazyLoadingDisabled ? EagerUntitledJSON : LazyUntitledJSON

export declare const UntitledJSON: (new (init: ModelInit<UntitledJSON>) => UntitledJSON)

type EagerListings = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Listings, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly Address?: UntitledJSON | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyListings = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Listings, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly Address?: UntitledJSON | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Listings = LazyLoading extends LazyLoadingDisabled ? EagerListings : LazyListings

export declare const Listings: (new (init: ModelInit<Listings>) => Listings) & {
  copyOf(source: Listings, mutator: (draft: MutableModel<Listings>) => MutableModel<Listings> | void): Listings;
}