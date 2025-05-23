import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  CloudWatchClient,
  PutMetricDataCommand,
  MetricDatum,
} from "@aws-sdk/client-cloudwatch";

@Injectable()
export class CloudWatchService {
  private readonly client: CloudWatchClient;
  private readonly namespace: string;

  constructor(private readonly configService: ConfigService) {
    const region = this.configService.get<string>("AWS_REGION") || "us-east-1";
    const accessKeyId = this.configService.get<string>("AWS_ACCESS_KEY_ID");
    const secretAccessKey = this.configService.get<string>(
      "AWS_SECRET_ACCESS_KEY"
    );

    if (accessKeyId && secretAccessKey) {
      this.client = new CloudWatchClient({
        region,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      });
    } else {
      this.client = new CloudWatchClient({ region });
    }
    this.namespace = "BlogManagementService";
  }

  async putMetric(
    name: string,
    value: number,
    unit: "Count",
    dimensions?: Record<string, string>
  ) {
    const metric: MetricDatum = {
      MetricName: name,
      Value: value,
      Unit: unit,
      Timestamp: new Date(),
      Dimensions: dimensions
        ? Object.entries(dimensions).map(([Name, Value]) => ({ Name, Value }))
        : undefined,
    };

    const command = new PutMetricDataCommand({
      Namespace: this.namespace,
      MetricData: [metric],
    });

    await this.client.send(command);
  }
}
