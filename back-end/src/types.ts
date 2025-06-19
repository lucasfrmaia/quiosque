import type {
   FastifyBaseLogger,
   FastifyInstance,
   RawReplyDefaultExpression,
   RawRequestDefaultExpression,
   RawServerDefault,
} from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';

export type TFastiftTypeInstace = FastifyInstance<
   RawServerDefault,
   RawRequestDefaultExpression,
   RawReplyDefaultExpression,
   FastifyBaseLogger,
   ZodTypeProvider
>;
