import { fastify } from 'fastify';
import dotenv from 'dotenv';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';

dotenv.config();

const app = fastify();

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.listen({ port: Number(process.env.API_POR) })
   .then(() => {
      console.log('Sucesso ao iniciar a API');
   })
   .catch((e) => console.error(e));
