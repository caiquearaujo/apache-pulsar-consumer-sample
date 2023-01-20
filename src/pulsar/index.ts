import { APACHE_PULSAR_URL } from '@/env';
import {
	Client,
	Producer,
	Consumer,
	ProducerConfig,
	ConsumerConfig,
} from 'pulsar-client';

export class PulsarConnection {
	protected static instance: PulsarConnection;

	protected client?: Client;

	protected producer?: Producer;

	protected consumer?: Consumer;

	private constructor() {
		this.start();
	}

	public static getInstance() {
		if (!PulsarConnection.instance) {
			PulsarConnection.instance = new PulsarConnection();
		}

		return PulsarConnection.instance;
	}

	public async createProducer(options: ProducerConfig) {
		const client = await this.start();

		if (this.producer?.isConnected()) {
			await this.producer.close();
		}

		const timeoutPromise = new Promise<undefined>((resolve, reject) => {
			setTimeout(() => {
				reject(new Error('Timeout while creating producer'));
			}, 5000);
		});

		return Promise.race([
			timeoutPromise,
			new Promise<Producer>((resolve, reject) => {
				client
					.createProducer(options)
					.then(producer => {
						this.producer = producer;
						resolve(this.producer);
					})
					.catch(error => reject(error));
			}),
		]);
	}

	public async createConsumer(options: ConsumerConfig) {
		const client = await this.start();

		if (this.consumer?.isConnected()) {
			await this.consumer.close();
		}

		const timeoutPromise = new Promise<undefined>((resolve, reject) => {
			setTimeout(() => {
				reject(new Error('Timeout while creating consumer'));
			}, 10000);
		});

		return Promise.race([
			timeoutPromise,
			new Promise<Consumer>((resolve, reject) => {
				client
					.subscribe(options)
					.then(consumer => {
						this.consumer = consumer;
						resolve(this.consumer);
					})
					.catch(error => reject(error));
			}),
		]);
	}

	public async start() {
		if (this.client) {
			return this.client;
		}

		this.client = new Client({
			serviceUrl: APACHE_PULSAR_URL,
		});

		return this.client;
	}

	public async close() {
		if (this.producer?.isConnected()) {
			await this.producer.close();
		}

		if (this.consumer?.isConnected()) {
			await this.consumer.close();
		}

		if (this.client) {
			await this.client.close();
			this.client = undefined;
		}
	}
}

export default PulsarConnection.getInstance();
