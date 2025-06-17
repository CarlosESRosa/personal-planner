export const swaggerConfig = {
    openapi: {
        info: { title: 'Task API', version: '1.0.0' },

        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        // security: [{ bearerAuth: [] }]   // exige auth por padrão (opcional)
    }
}