import {PostgresDataSource} from "../sql-data-source";

export class HealthCheckModel {
  static async healthQueryQuery() {
    const dataSource = PostgresDataSource.getInstance();

    const results: [][] = await dataSource.executeQuery<[][]>("SELECT 1", []);
    return results[0];
  }
}
