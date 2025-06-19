import { fastify } from 'fastify';
import {
   jsonSchemaTransform,
   serializerCompiler,
   validatorCompiler,
   type ZodTypeProvider,
} from 'fastify-type-provider-zod';
import { fastifyCors } from '@fastify/cors';
import { fastifySwagger } from '@fastify/swagger';
import { fastifySwaggerUi } from '@fastify/swagger-ui';
import { routes } from './routes/users';
import dotenv from 'dotenv';

dotenv.config();

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCors, { origin: '*' });

app.register(fastifySwagger, {
   openapi: {
      info: {
         title: 'Quioque API',
         version: '1.0.0',
      },
   },
   transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUi, {
   routePrefix: '/docs',
});

app.register(routes);

app.listen({ port: Number(process.env.API_PORT) })
   .then(() => {
      console.log('Sucesso ao iniciar a API');
   })
   .catch((e) => console.error(e));
