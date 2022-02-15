export const logMiddleWare = (req, res, next) =>
{
    if (req.method == 'POST')
        console.log(`Logger ${req.method} ${req.originalUrl} body=${JSON.stringify(req.body)}`);
    else
        console.log(`Logger ${req.method} ${req.originalUrl} query=` + JSON.stringify(req.query));
    next();
};