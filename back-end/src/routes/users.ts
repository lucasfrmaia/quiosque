import type { TFastiftTypeInstace } from "../types";
import z from "zod";

export async function routes(app: TFastiftTypeInstace) {
    app.post('/user', {
        schema: {
            description: 'Criar novo usuário',
            tags: ['users'],
            body: z.object({
                name: z.string(),
                email: z.string().email()
            }),
            response: {
                201: z.null().describe('Teste')
            }
        }
    }, async (request) => {
        return null
    })
}