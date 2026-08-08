/**
 * Middleware factory that validates req.body against a Zod schema.
 * Returns 400 with structured field errors on failure.
 */
export const validate = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({
                error: 'Validation failed',
                details: result.error.flatten().fieldErrors,
            });
            return;
        }
        req.body = result.data;
        next();
    };
};
//# sourceMappingURL=validateMiddleware.js.map