import { Kafka, type Producer, type Consumer, type ConsumerSubscribeTopic, type KafkaMessage } from "kafkajs";
import { type KafkaEnvelope } from "@logpulse/shared-events";
import { IdempotencyService } from "@logpulse/infrastructure-redis";

export class KafkaProducerService {
  private readonly kafka: Kafka;
  private producer: Producer | null = null;
  private readonly producerClientId: string;

  public constructor(brokers: string[], clientId: string) {
    this.producerClientId = clientId;
    this.kafka = new Kafka({ brokers, clientId: this.producerClientId });
  }

  public async connect(): Promise<void> {
    this.producer = this.kafka.producer();
    await this.producer.connect();
  }

  public async publish<TPayload>(
    topic: string,
    key: string,
    envelope: KafkaEnvelope<TPayload>
  ): Promise<void> {
    if (!this.producer) {
      throw new Error("Kafka producer is not connected");
    }

    await this.producer.send({
      topic,
      messages: [{ key, value: JSON.stringify(envelope) }]
    });
  }
}

export abstract class KafkaConsumerService<TPayload> {
  private readonly kafka: Kafka;
  private consumer: Consumer | null = null;
  private readonly consumerClientId: string;
  private readonly consumerGroupId: string;

  protected constructor(
    brokers: string[],
    clientId: string,
    groupId: string,
    private readonly idempotencyService: IdempotencyService
  ) {
    this.consumerClientId = clientId;
    this.consumerGroupId = groupId;
    this.kafka = new Kafka({ brokers, clientId: this.consumerClientId });
  }

  public async connect(topic: ConsumerSubscribeTopic): Promise<void> {
    this.consumer = this.kafka.consumer({ groupId: this.consumerGroupId });
    await this.consumer.connect();
    await this.consumer.subscribe(topic);
    await this.consumer.run({
      eachMessage: async ({ message }) => {
        await this.handleMessage(message);
      }
    });
  }

  private async handleMessage(message: KafkaMessage): Promise<void> {
    if (!message.value) {
      return;
    }

    const envelope = JSON.parse(message.value.toString("utf-8")) as KafkaEnvelope<TPayload>;
    const key = `kafka:idempotency:${envelope.organizationId}:${envelope.eventId}`;
    if (await this.idempotencyService.hasProcessed(key)) {
      return;
    }

    await this.processEnvelope(envelope);
    await this.idempotencyService.markProcessed(key, 86_400);
  }

  protected abstract processEnvelope(envelope: KafkaEnvelope<TPayload>): Promise<void>;
}
