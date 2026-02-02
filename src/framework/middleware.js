/**
 * Middleware to parse JSON request bodies.
 * Sets `req.body` with the parsed JSON object.
 * If the content-type is not application/json, `req.body` will be an empty object.
 * Handles invalid JSON by sending a 400 response.
 * @param {http.IncomingMessage} req - The incoming request object.
 * @param {http.ServerResponse} res - The server response object.
 * @param {Function} next - The next middleware function in the stack.
 * @returns {void}
 */
export const jsonParser = (req, res, next) => {
    if (req.headers['content-type'] !== 'application/json') {
        req.body = {};
        return next();
    }

    let body = '';

    req.on('data', (chunk) => {
        body += chunk.toString();
    });

    req.on('end', () => {
        try {
            if (body) {
                req.body = JSON.parse(body);
            } else {
                req.body = {};
            }
            next();
        } catch (error) {
            res.status(400).send('Invalid JSON');
        }
    });

    req.on('error', (err) => {
        next(err);
    });
};
