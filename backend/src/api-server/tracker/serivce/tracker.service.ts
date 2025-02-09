import { TrackerModel } from "../../../data-sources/sql/models/tracker.model";
import { AppLogger } from "../../../loggers/logger-service/logger.service";

export class TrackerService {
  private readonly trackerModel: TrackerModel = TrackerModel.getInstance();
  private readonly logger: AppLogger = AppLogger.getInstance();
}
