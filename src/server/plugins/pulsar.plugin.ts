import { FastifyInstance } from 'fastify';
import { TFnApplyToFastify } from '@/types/types';
import PulsarConnectionInstance from '@/pulsar';

const callable: TFnApplyToFastify = async (app: FastifyInstance) => {
	await app.register(async (instance, opts, done) => {
		try {
			await PulsarConnectionInstance.createConsumer({
				topic: 'apache-pulsar-sample-events',
				subscription: 'apache-pulsar-sample-subscription',
				listener: (msg, _consumer) => {
					const { event, payload } = JSON.parse(
						msg.getData().toString()
					);

					console.log(`Event ${event} received`, payload);
					_consumer.acknowledge(msg);
				},
			});

			done();
		} catch (err: any) {
			console.error(err);
			done(err);
		}

		instance.addHook('onClose', (_instance, _done) => {
			PulsarConnectionInstance.close();
			_done();
		});
	});
};

export default callable;
