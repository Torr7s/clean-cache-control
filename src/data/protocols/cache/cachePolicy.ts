export class CachePolicy {
  private static MAX_AGE_IN_DAYS: number = 3;

  private constructor() {}

  public static validate(timestamp: Date, date: Date): boolean {
    const cacheMaxAge = new Date(timestamp);

    cacheMaxAge.setDate(cacheMaxAge.getDate() + CachePolicy.MAX_AGE_IN_DAYS);

    return cacheMaxAge > date;
  }
}