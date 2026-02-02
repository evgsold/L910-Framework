import http from 'http';
import EventEmitter from 'events';

export class Application extends EventEmitter {
    constructor() {
        super();
        this.middlewares = [];
        this.routes = {
            GET: [],
            POST: [],
            PUT: [],
            PATCH: [],
            DELETE: []
        };
    }

    /**
     * Registers a middleware function to be executed for every incoming request.
     * @param {Function} middleware - The middleware function. (req, res, next) => {}
     * @returns {void}
     */
    use(middleware) {
        this.middlewares.push(middleware);
    }

    /**
     * Starts the HTTP server and listens for incoming requests on the specified port.
     * @param {number} port - The port number to listen on.
     * @param {Function} [callback] - An optional callback function to be executed when the server starts listening.
     * @returns {void}
     */
    listen(port, callback) {
        const server = http.createServer((req, res) => {
            this._handleRequest(req, res);
        });
        server.listen(port, callback);
    }

    /**
     * Registers a route handler for a specific HTTP method and path.
     * @param {string} method - The HTTP method (e.g., 'GET', 'POST').
     * @param {string} path - The URL path for the route. Can include parameters like '/users/:id'.
     * @param {Function} handler - The route handler function. (req, res) => {}
     * @returns {void}
     */
    _registerRoute(method, path, handler) {
        this.routes[method].push({
            path,
            handler,
            isRegex: path.includes(':'),
            regex: this._pathToRegex(path)
        });
    }

    /**
     * Registers a GET route handler.
     * @param {string} path - The URL path for the route.
     * @param {Function} handler - The route handler function.
     * @returns {void}
     */
    get(path, handler) { this._registerRoute('GET', path, handler); }

    /**
     * Registers a POST route handler.
     * @param {string} path - The URL path for the route.
     * @param {Function} handler - The route handler function.
     * @returns {void}
     */
    post(path, handler) { this._registerRoute('POST', path, handler); }

    /**
     * Registers a PUT route handler.
     * @param {string} path - The URL path for the route.
     * @param {Function} handler - The route handler function.
     * @returns {void}
     */
    put(path, handler) { this._registerRoute('PUT', path, handler); }

    /**
     * Registers a PATCH route handler.
     * @param {string} path - The URL path for the route.
     * @param {Function} handler - The route handler function.
     * @returns {void}
     */
    patch(path, handler) { this._registerRoute('PATCH', path, handler); }

    /**
     * Registers a DELETE route handler.
     * @param {string} path - The URL path for the route.
     * @param {Function} handler - The route handler function.
     * @returns {void}
     */
    delete(path, handler) { this._registerRoute('DELETE', path, handler); }

    /**
     * Converts a path with parameters (e.g., /users/:id) into a regular expression.
     * @param {string} path - The URL path.
     * @returns {RegExp} A regular expression for matching the path and extracting parameters.
     */
    _pathToRegex(path) {
        const pattern = path.replace(/:([^\/]+)/g, '(?<$1>[^/]+)');
        return new RegExp(`^${pattern}$`);
    }

    /**
     * Handles an incoming HTTP request, running middlewares and routing to the appropriate handler.
     * @param {http.IncomingMessage} req - The incoming request object.
     * @param {http.ServerResponse} res - The server response object.
     * @returns {Promise<void>}
     */
    async _handleRequest(req, res) {
        this._augmentRequest(req);
        this._augmentResponse(res);

        try {
            await this._runMiddlewares(req, res);

            const route = this._findRoute(req.method, req.url);
            
            if (route) {
                req.params = route.params;
                await route.handler(req, res);
            } else {
                res.status(404).send('Not Found');
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    }

    /**
     * Augments the request object with additional properties like pathname, query, and params.
     * @param {http.IncomingMessage} req - The incoming request object.
     * @returns {void}
     */
    _augmentRequest(req) {
        const url = new URL(req.url, `http://${req.headers.host}`);
        req.pathname = url.pathname;
        req.query = Object.fromEntries(url.searchParams);
        req.params = {};
    }

    /**
     * Augments the response object with convenience methods like send, json, and status.
     * @param {http.ServerResponse} res - The server response object.
     * @returns {void}
     */
    _augmentResponse(res) {
        res.send = (data) => {
            if (typeof data === 'object') {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(data));
            } else {
                res.end(data);
            }
        };

        res.json = (data) => {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
        };

        res.status = (code) => {
            res.statusCode = code;
            return res;
        };
    }

    /**
     * Runs the registered middleware functions in sequence.
     * @param {http.IncomingMessage} req - The incoming request object.
     * @param {http.ServerResponse} res - The server response object.
     * @returns {Promise<void>}
     */
    async _runMiddlewares(req, res) {
        let index = 0;
        
        const next = async (err) => {
            if (err) throw err;
            if (index < this.middlewares.length) {
                const middleware = this.middlewares[index++];
                try {
                    await middleware(req, res, next);
                } catch (e) {
                    throw e;
                }
            }
        };

        await next();
    }

    /**
     * Finds a matching route for the given HTTP method and URL.
     * @param {string} method - The HTTP method of the request.
     * @param {string} url - The URL of the request.
     * @returns {{handler: Function, params: Object}|null} An object containing the handler and extracted parameters, or null if no route is found.
     */
    _findRoute(method, url) {
        const pathname = new URL(url, `http://dummy.com`).pathname;
        const methodRoutes = this.routes[method] || [];

        for (const route of methodRoutes) {
            if (route.isRegex) {
                const match = pathname.match(route.regex);
                if (match) {
                    return {
                        handler: route.handler,
                        params: match.groups || {}
                    };
                }
            } else if (route.path === pathname) {
                return {
                    handler: route.handler,
                    params: {}
                };
            }
        }
        return null;
    }
}
