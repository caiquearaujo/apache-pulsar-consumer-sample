import helmetPlugin from './helmet.plugin';
import corsPlugin from './cors.plugin';
import rateLimitPlugin from './ratelimit.plugin';
import compressPlugin from './compress.plugin';
import pulsarPlugin from './pulsar.plugin';

export default [
	helmetPlugin,
	corsPlugin,
	rateLimitPlugin,
	compressPlugin,
	pulsarPlugin,
];
