export type FilteredKeys<T, U> = {
  [P in keyof T]: T[P] extends U ? P : never;
}[keyof T];
export type FilteredProperties<T, U> = { [K in FilteredKeys<T, U>]: T[K] };
export type PullOutArrays<T> = FilteredProperties<T, unknown[]>;
export type AtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> &
  U[keyof U];
export type SortListType<T> = {
  collection: Array<T>;
  order: {
    field: FilteredKeys<T, number>;
    type?: 'asc' | 'desc';
  };
};
