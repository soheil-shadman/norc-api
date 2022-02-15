import { Controller } from "./controller";
export class ModelController extends Controller {
    constructor(catSocketEvents, model, modelName, requireSystemTokenForRead = false) {
        super(catSocketEvents);
        this.model = model;
        this.requireSystemTokenForRead = requireSystemTokenForRead;
        //bind functions:
        this.find = this.find.bind(this);
        this.getOne = this.getOne.bind(this);
        this.insert = this.insert.bind(this);
        this.editOne = this.editOne.bind(this);
        this.deleteOne = this.deleteOne.bind(this);
        //http express:
        this.expressRouter.all('/', async (req, res) => {
            try {
                if (this.requireSystemTokenForRead && !req.api.isSystem()) {
                    res.sendError('access denied', 401);
                    return;
                }
                var response = await this.find(req.method == 'GET' ? req.query : req.body, !req.api.isSystem());
                res.sendResponse(response);
            } catch (err) {
                console.log(err);
                res.sendError(err.error, err.code);
            }
        });
        this.expressRouter.get('/:id', async (req, res) => {
            try {
                if (this.requireSystemTokenForRead && !req.api.isSystem()) {
                    res.sendError('access denied', 401);
                    return;
                }
                var response = await this.getOne(req.params.id, !req.api.isSystem());
                res.sendResponse(response);
            }
            catch (err) {
                res.sendError(err.error, err.code);
            }
        });
        this.expressRouter.post('/new', async (req, res) => {
            try {
                if (!req.api.hasUser()) {
                    res.sendUserMissing();
                    return;
                }
                // if (!req.api.isSystem())
                // {
                //     res.sendError('access denied', 401);
                //     return;
                // }
                var response = await this.insert(req.body);
                res.sendResponse(response);
            } catch (err) {
                res.sendError(err.error, err.code);
            }
        });
        this.expressRouter.post('/:id/edit', async (req, res) => {
            try {
                if (!req.api.isSystem())
                {
                    res.sendError('access denied', 401);
                    return;
                }
                var response = await this.editOne(req.params.id, req.body);
                res.sendResponse(response);
            } catch (err) {
                res.sendError(err.error, err.code);
            }
        });
        this.expressRouter.all('/:id/delete', async (req, res) => {
            try {
                if (!req.api.isSystem()) {
                    res.sendError('access denied', 401);
                    return;
                }
                var response = await this.deleteOne(req.params.id);
                res.sendResponse(response);
            } catch (err) {
                res.sendError(err.error, err.code);
            }
        });
        //ws listeners:
        this.catSocketEvents.listenOnMessage(modelName, 'find', async (req, res) => {
            try {
                if (this.requireSystemTokenForRead && !req.api.isSystem()) {
                    res.sendError('access denied', 401);
                    return;
                }
                var response = await this.find(req.parameters, !req.api.isSystem());
                res.sendResponse(response);
            } catch (err) {
                res.sendError(err.error, err.code);
            }
        });
        this.catSocketEvents.listenOnMessage(modelName, 'getOne', async (req, res) => {
            try {
                if (this.requireSystemTokenForRead && !req.api.isSystem()) {
                    res.sendError('access denied', 401);
                    return;
                }
                var response = await this.getOne(req.parameters.id, !req.api.isSystem());
                res.sendResponse(response);
            } catch (err) {
                res.sendError(err.error, err.code);
            }
        });
        this.catSocketEvents.listenOnMessage(modelName, 'new', async (req, res) => {
            try {
                if (!req.api.isSystem()) {
                    res.sendError('access denied', 401);
                    return;
                }
                var response = await this.insert(req.parameters);
                res.sendResponse(response);
            } catch (err) {
                res.sendError(err.error, err.code);
            }
        });
        this.catSocketEvents.listenOnMessage(modelName, 'edit', async (req, res) => {
            try {
                if (!req.api.isSystem()) {
                    res.sendError('access denied', 401);
                    return;
                }
                var response = await this.editOne(req.parameters.id, req.parameters);
                res.sendResponse(response);
            } catch (err) {
                res.sendError(err.error, err.code);
            }
        });
        this.catSocketEvents.listenOnMessage(modelName, 'delete', async (req, res) => {
            try {
                if (!req.api.isSystem()) {
                    res.sendError('access denied', 401);
                    return;
                }
                var response = await this.deleteOne(req.parameters.id);
                res.sendResponse(response);
            } catch (err) {
                res.sendError(err.error, err.code);
            }
        });

    }
    find(query, publicLevel = true) {
        return new Promise(async (resolve, reject) => {
            try {

                var limit = query.limit ? query.limit : 20;
                var offset = query.offset ? query.offset : 0;
                var sort = query.sort;
                if (sort == undefined)
                    sort = [['id', 'DESC']];
                else {
                    if (sort.indexOf('-') != -1)
                        sort = [[sort.replace('-', ''), 'DESC']];
                    else
                        sort = [[sort.replace('-', ''), 'ASC']];
                }
                if (this.model.Helpers.hasDraft()) {
                    if (query._draft == 'all')
                        delete (query._draft);
                    else if (query._draft == undefined)
                        query._draft = false;
                }
                else
                    delete (query._draft);
                if (typeof (query.id) == 'string' && query.id.indexOf(',') != -1) {
                    query.id = query.id.split(',');
                }
                delete (query.limit);
                delete (query.offset);
                delete (query.sort);
                if (query.ids != undefined && typeof (query.ids) == 'string') {
                    query.id = query.ids.split(',');
                    delete (query.ids);
                }
                var results = await this.model.findAll({ where: query, limit: limit, offset: offset, order: sort });
                if (publicLevel) {
                    for (var i = 0; i < results.length; i++)
                        results[i] = this.model.Helpers.public(results[i]);
                }
                resolve(results);
            } catch (err) {
                reject({ code: 500, error: err });
            }
        });
    }
    getOne(id, publicLevel = true) {
        return new Promise(async (resolve, reject) => {
            try {
                var result = await this.model.findByPk(id);
                if (result == undefined) {
                    reject({ code: 404, error: 'object not found' });
                    return;
                }
                if (publicLevel)
                    result = this.model.Helpers.public(result);
                resolve(result);
            }
            catch (err) {
                reject({ code: 500, error: err });
            }
        });
    }
    insert(doc) {
        return new Promise(async (resolve, reject) => {
            try {
                delete (doc.id);
                delete (doc.createdAt);
                delete (doc.updatedAt);
                var result = this.model.build(doc);
                result = await result.save();
                resolve(result);
            } catch (err) {
                reject({ code: 500, error: err });
            }
        });
    }
    editOne(id, doc) {
        return new Promise(async (resolve, reject) => {
            try {
                delete (doc.id);
                delete (doc.createdAt);
                delete (doc.updatedAt);
                var result = await this.model.findByPk(id);
                if (result == undefined) {
                    reject({ code: 404, error: 'object not found' });
                    return;
                }
                result = await result.update(doc);
                resolve(result);
            } catch (err) {
                reject({ code: 500, error: err });
            }
        });
    }
    deleteOne(id) {
        return new Promise(async (resolve, reject) => {
            try {
                var result = await this.model.findByPk(id);
                if (result == undefined) {
                    reject({ code: 404, error: 'object not found' });
                    return;
                }
                await result.destroy();
                resolve({ success: true, id: id });
            } catch (err) {
                reject({ code: 500, error: err });
            }
        });
    }
}