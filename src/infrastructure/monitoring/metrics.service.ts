import { Injectable, Logger } from "@nestjs/common";
import { CloudWatchService } from "../services/cloudwatch.service";
import { PrometheusService } from "./prometheus.service";

@Injectable()
export class MetricsService {
  private readonly logger = new Logger(MetricsService.name);

  constructor(
    private readonly cloudWatchService: CloudWatchService,
    private readonly prometheusService: PrometheusService
  ) {}

  async recordApiMetrics(
    method: string,
    path: string,
    status: number,
    duration: number
  ) {
    try {
      // Record to Prometheus
      this.prometheusService.recordHttpRequest(method, path, status, duration);
    } catch (error) {
      this.logger.error(
        `Failed to record API metrics to Prometheus: ${error.message}`,
        error.stack
      );
    }

    try {
      // Record to CloudWatch
      await this.cloudWatchService.putMetric("APIRating", duration, "Count", {
        Method: method,
        Path: path,
        StatusCode: status.toString(),
      });
    } catch (error) {
      this.logger.error(
        `Failed to record API metrics to CloudWatch: ${error.message}`,
        error.stack
      );
    }
  }

  async recordConsultantMetrics(consultantId: string, rating: number) {
    try {
      await this.cloudWatchService.putMetric(
        "ConsultantRating",
        rating,
        "Count",
        { ConsultantId: consultantId }
      );
    } catch (error) {
      this.logger.error(
        `Failed to record consultant metrics to CloudWatch: ${error.message}`,
        error.stack
      );
    }
  }
}
