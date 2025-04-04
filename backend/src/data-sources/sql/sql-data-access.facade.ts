import {PostgresDataSource} from "./sql-data-source";

export class SqlDataAccessFacade {
  private static instance: SqlDataAccessFacade | null = null;
  private readonly postgresDataSource = PostgresDataSource.getInstance();

  private constructor() {}

  public static getInstance(): SqlDataAccessFacade {
    if (!SqlDataAccessFacade.instance) {
      SqlDataAccessFacade.instance = new SqlDataAccessFacade();
    }
    return SqlDataAccessFacade.instance;
  }

  public executeQuery<T>(
    query: string,
    params: unknown[] = [],
    isWrite = false
  ): Promise<T> {
    return this.postgresDataSource.executeQuery<T>(query, params, isWrite);
  }

  public testConnections(): Promise<void> {
    return this.postgresDataSource.testConnections();
  }
}
