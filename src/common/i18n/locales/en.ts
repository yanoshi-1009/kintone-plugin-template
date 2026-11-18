/**
 * The locale that serves as the source of truth for translation keys and interpolation variables.
 * `as const` on the translations is required. Losing the literal types silently
 * disables type checking for t()'s interpolation variables (e.g. {{name}}).
 */
const en = {
  config: {
    label: {
      save: "Save",
      cancel: "Cancel"
    }
  }
} as const;

/** Widens the translation literal types to string, keeping only the key structure */
type Translation<T> = {
  [K in keyof T]: T[K] extends string ? string : Translation<T[K]>;
};

/** The type that non-en locales must satisfy. Detects missing or extra keys at compile time */
export type Translations = Translation<typeof en>;

export default en;
