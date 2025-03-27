const express = require('express');
const swaggerUi = require('swagger-ui-express');
const yaml = require('js-yaml');
const fs = require('fs-extra');
const path = require('path');
const marked = require('marked');

const app = express();
const port = process.env.PORT || 8080;
const SWAGGER_DIR = path.resolve('../server');
const ENDPOINTS_DIR = path.resolve('../endpoints');

// Bundle Swagger file with proper references
async function bundleSwagger() {
    try {
        // Read the main Swagger file
        const mainSwaggerPath = path.join(SWAGGER_DIR, 'swagger.yaml');
        let rawSwagger = await fs.readFile(mainSwaggerPath, 'utf8');
        const swaggerObj = yaml.load(rawSwagger);

        // Process each path to resolve references
        const paths = swaggerObj.paths || {};
        const newPaths = {};

        for (const [pathKey, pathValue] of Object.entries(paths)) {
            newPaths[pathKey] = pathValue;

            // Check if this is a reference
            if (pathValue && pathValue.$ref) {
                const refPath = pathValue.$ref;

                // Convert the relative path to absolute
                const fullPath = path.resolve(path.join(SWAGGER_DIR, refPath));

                try {
                    // Load the referenced file
                    const refContent = await fs.readFile(fullPath, 'utf8');
                    const refObj = yaml.load(refContent);

                    // Replace the reference with the actual content
                    newPaths[pathKey] = refObj;
                } catch (err) {
                    console.log(`Warning: Could not load ${refPath}`);
                }
            }
        }

        // Update paths in the swagger object
        swaggerObj.paths = newPaths;

        // Convert back to YAML
        const bundledSwagger = yaml.dump(swaggerObj);

        // Write the bundled Swagger file
        const outputPath = path.join(__dirname, 'swagger.yaml');
        await fs.writeFile(outputPath, bundledSwagger);

        return swaggerObj;
    } catch (err) {
        console.error('Error bundling Swagger:', err);
        throw err;
    }
}

// Helper to extract API path and tag from endpoint filename
function getApiInfo(service, endpoint) {
    // Map service numbers to Swagger tags
    const serviceTags = {
        "3030": "Matchmaking",
        "9110": "Arbiter",
        "9111": "KeyDistribution",
        "9120": "Instance",
        "9130": "Authentication",
        "9140": "ProfileAuthority",
        "9150": "News"
    };

    // Map endpoints to specific paths
    const pathMappings = {
        "login_playstation": "/v0/login/playstation",
        "account": "/v0/account",
        "validate": "/v0/validate",
        "heartbeat": "/v0/heartbeat",
        "matchmaking_status": "/v0/matchmaking/status",
        "experience": "/v1/experience",
        "singleplayer_profile": "/v0/singleplayer/profile",
        "singleplayer_report": "/v0/singleplayer/report",
        "inventory_perks_cashin": "/v0/inventory/perks/cashin",
        "stats": "/v0/stats",
        "achievements": "/v0/achievements",
        "news": "/v0/news"
    };

    // Map endpoints to HTTP methods
    const methodMappings = {
        "login_playstation": "post",
        "account": "get",
        "validate": "post",
        "heartbeat": "post",
        "matchmaking_status": "get",
        "experience": "post",
        "singleplayer_profile": "get",
        "singleplayer_report": "post",
        "inventory_perks_cashin": "post",
        "stats": "get",
        "achievements": "get",
        "news": "get"
    };

    const path = pathMappings[endpoint] || `/${endpoint}`;
    const tag = serviceTags[service] || "default";
    const method = methodMappings[endpoint] || "get";

    return {
        path: path,
        tag: tag,
        method: method
    };
}

// Create a route to serve the Markdown files with API links
app.get('/docs/:service/:endpoint', async (req, res) => {
    const {service, endpoint} = req.params;
    const mdPath = path.join(ENDPOINTS_DIR, service, `${endpoint}.md`);

    try {
        // Check if the file exists
        await fs.access(mdPath);

        // Read and render the Markdown file
        const mdContent = await fs.readFile(mdPath, 'utf8');
        const htmlContent = marked.parse(mdContent);

        // Get the corresponding API path and tag for linking to Swagger UI
        const apiInfo = getApiInfo(service, endpoint);

        // Build the API reference URL with proper format for Swagger UI
        const apiRefUrl = `/api-docs/#/${apiInfo.tag}/${apiInfo.method}_${apiInfo.path.replace(/\//g, '_').replace(/^_/, '')}`;

        // Send the rendered HTML with some basic styling
        res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${endpoint} Documentation</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
          }
          pre {
            background-color: #f6f8fa;
            border-radius: 3px;
            padding: 16px;
            overflow: auto;
          }
          code {
            font-family: SFMono-Regular, Consolas, 'Liberation Mono', Menlo, monospace;
            background-color: rgba(27, 31, 35, 0.05);
            border-radius: 3px;
            padding: 0.2em 0.4em;
          }
          h1, h2 {
            border-bottom: 1px solid #eaecef;
            padding-bottom: 0.3em;
          }
          .nav {
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
          }
          .back-link {
            margin-right: 10px;
          }
          .api-link {
            color: #0366d6;
          }
        </style>
      </head>
      <body>
        <div class="nav">
          <div>
            <a href="/docs/${service}" class="back-link">← Back to Service</a>
            <a href="${apiRefUrl}" class="api-link">View in API Reference</a>
          </div>
        </div>
        ${htmlContent}
      </body>
      </html>
    `);
    } catch (err) {
        res.status(404).send('Documentation not found');
    }
});

// Serve the markdown file directory listing
app.get('/docs/:service', async (req, res) => {
    const {service} = req.params;
    const serviceDir = path.join(ENDPOINTS_DIR, service);

    try {
        // Check if the directory exists
        await fs.access(serviceDir);

        // Get all markdown files in this directory
        const files = await fs.readdir(serviceDir);
        const mdFiles = files.filter(file => file.endsWith('.md'));

        // Get server description
        const serverDescriptions = {
            '3030': 'Matchmaking Service',
            '9110': 'Arbiter Service',
            '9111': 'Key Distribution Service',
            '9120': 'Instance Authority',
            '9130': 'Authentication Service',
            '9140': 'Profile Authority',
            '9150': 'News Service'
        };

        const serviceDescription = serverDescriptions[service] || service;

        // Build the HTML
        let fileList = '';
        mdFiles.forEach(file => {
            const endpoint = file.replace('.md', '');
            fileList += `<li><a href="/docs/${service}/${endpoint}">${endpoint}</a></li>`;
        });

        res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${serviceDescription} - Endpoint Documentation</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
          }
          h1 {
            border-bottom: 1px solid #eaecef;
            padding-bottom: 0.3em;
          }
          ul {
            padding-left: 20px;
          }
          li {
            margin-bottom: 8px;
          }
          .back-link {
            margin-bottom: 20px;
            display: block;
          }
        </style>
      </head>
      <body>
        <a href="/docs" class="back-link">← Back to Services</a>
        <h1>${serviceDescription} Endpoints</h1>
        <ul>
          ${fileList}
        </ul>
      </body>
      </html>
    `);
    } catch (err) {
        res.status(404).send('Service not found');
    }
});

// List all available service directories
app.get('/docs', async (req, res) => {
    try {
        // Get all directories in the endpoints folder
        const dirs = await fs.readdir(ENDPOINTS_DIR);
        const services = [];

        for (const dir of dirs) {
            const fullPath = path.join(ENDPOINTS_DIR, dir);
            const stats = await fs.stat(fullPath);
            if (stats.isDirectory() && !isNaN(dir)) {
                services.push(dir);
            }
        }

        // Sort services numerically
        services.sort((a, b) => parseInt(a) - parseInt(b));

        // Server descriptions
        const serverDescriptions = {
            '3030': 'Matchmaking Service',
            '9110': 'Arbiter Service',
            '9111': 'Key Distribution Service',
            '9120': 'Instance Authority',
            '9130': 'Authentication Service',
            '9140': 'Profile Authority',
            '9150': 'News Service'
        };

        // Build the HTML
        let serviceList = '';
        services.forEach(service => {
            const description = serverDescriptions[service] || service;
            serviceList += `<li><a href="/docs/${service}">${service} - ${description}</a></li>`;
        });

        res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>API Documentation - Services</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
          }
          h1 {
            border-bottom: 1px solid #eaecef;
            padding-bottom: 0.3em;
          }
          ul {
            padding-left: 20px;
          }
          li {
            margin-bottom: 8px;
          }
          .back-link {
            margin-bottom: 20px;
            display: block;
          }
        </style>
      </head>
      <body>
        <a href="/" class="back-link">← Back to Home</a>
        <h1>API Documentation</h1>
        <h2>Available Services</h2>
        <ul>
          ${serviceList}
        </ul>
      </body>
      </html>
    `);
    } catch (err) {
        res.status(500).send('Error loading services');
    }
});

// Serve the Swagger file
app.get('/swagger.yaml', async (req, res) => {
    try {
        const swaggerPath = path.join(__dirname, 'swagger.yaml');
        const swaggerContent = await fs.readFile(swaggerPath, 'utf8');
        res.setHeader('Content-Type', 'text/yaml');
        res.send(swaggerContent);
    } catch (err) {
        res.status(500).send('Error loading Swagger file');
    }
});

// Setup Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(null, {
    swaggerUrl: '/swagger.yaml',
    explorer: true
}));

// Serve a simple index page
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Friday the 13th Backend Documentation</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          max-width: 800px;
          margin: 0 auto;
          padding: 40px 20px;
          line-height: 1.6;
        }
        h1, h2 {
          border-bottom: 1px solid #eaecef;
          padding-bottom: 0.3em;
        }
        .button {
          display: inline-block;
          background-color: #4CAF50;
          color: white;
          padding: 12px 20px;
          margin: 10px 10px 10px 0;
          text-decoration: none;
          border-radius: 4px;
          font-weight: bold;
        }
        .blue {
          background-color: #2196F3;
        }
        .orange {
          background-color: #FF9800;
        }
        .card {
          border: 1px solid #e1e4e8;
          border-radius: 6px;
          padding: 16px;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <h1>Friday the 13th Backend Documentation</h1>
      <p>Welcome to the documentation server for the Friday the 13th Backend project.</p>
      
      <div class="card">
        <h2>API Reference</h2>
        <p>Interactive API reference with all endpoints, parameters, and responses.</p>
        <a href="/api-docs" class="button">API Reference</a>
        <a href="/reload" class="button orange">Reload Swagger</a>
      </div>
      
      <div class="card">
        <h2>Markdown Documentation</h2>
        <p>Detailed documentation for individual endpoints with examples and explanations.</p>
        <a href="/docs" class="button blue">Browse Documentation</a>
      </div>
    </body>
    </html>
  `);
});

// Add a route to reload Swagger
app.get('/reload', async (req, res) => {
    try {
        await bundleSwagger();
        res.redirect('/api-docs');
    } catch (err) {
        res.status(500).send(`Error reloading Swagger: ${err.message}`);
    }
});

// Start the server
async function startServer() {
    try {
        // Bundle Swagger files on startup
        await bundleSwagger();

        // Start the Express server
        app.listen(port, () => {
            console.log(`Documentation server running at http://localhost:${port}`);
            console.log(`- API Reference: http://localhost:${port}/api-docs`);
            console.log(`- Markdown Documentation: http://localhost:${port}/docs`);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
    }
}

startServer();