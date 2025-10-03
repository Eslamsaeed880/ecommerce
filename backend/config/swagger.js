import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const setupSwagger = (app, port) => {
    try {
        const swaggerDocument = YAML.load(path.join(__dirname, '../swagger.yaml'));
        
        swaggerDocument.servers = [
            {
                url: `http://localhost:${port}`,
                description: 'Development server'
            },
            {
                url: 'https://your-production-url.com',
                description: 'Production server'
            }
        ];

        const options = {
            customCss: `
                .swagger-ui .topbar { display: none; }
                .swagger-ui .info { margin-bottom: 50px; }
                .swagger-ui .scheme-container { background: #f7f7f7; padding: 15px; margin: 20px 0; }
                .swagger-ui .auth-wrapper { margin-top: 20px; }
                .swagger-ui .btn.authorize { background-color: #49cc90; border-color: #49cc90; }
                .swagger-ui .btn.authorize:hover { background-color: #3ea370; }
                .swagger-ui .opblock-summary-description { font-weight: normal; }
                .swagger-ui .opblock { margin-bottom: 20px; }
            `,
            customSiteTitle: 'E-commerce API Documentation',
            customfavIcon: '/favicon.ico',
            swaggerOptions: {
                persistAuthorization: true,
                displayRequestDuration: true,
                docExpansion: 'none',
                filter: true,
                showExtensions: true,
                showCommonExtensions: true,
                tryItOutEnabled: true,
                supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch']
            }
        };

        app.use('/api-docs', swaggerUi.serve);
        app.get('/api-docs', swaggerUi.setup(swaggerDocument, options));
        
        app.get('/api-docs.json', (req, res) => {
            res.setHeader('Content-Type', 'application/json');
            res.send(swaggerDocument);
        });

        console.log('✅ Swagger documentation setup complete');
        
    } catch (error) {
        console.error('❌ Error setting up Swagger:', error.message);
        console.error('Stack:', error.stack);
    }
};