type UTCString =
  `${number}-${number}-${number} ${number}:${number}:${number} UTC`; // e.g. 2022-06-01 16:47:55 UTC

type Modify<T, R extends PartialAny<T>> = Omit<T, keyof R> & R;

type InsensitiveQuery = {
  mode: 'insensitive';
  contains: string;
};
