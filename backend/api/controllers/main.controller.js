var providers = require('../models/providers.models');
const Provider = require('../db/db');
const ObjectId = require('mongodb').ObjectId;

//Util functions

//Check if list is empty
function isEmptyList(obj) {
    return (!obj || obj.length == 0 || Object.keys(obj).length == 0);
}

//Check for existing provider
// function existsProvider(id){
//     return providers.find( provider => provider.id == id);
// }

//Generate unique provider id
// function getUniqueId(providers) {
//     //Create a random ID
//     let min = 100000;
//     let max = 999999;
//     do {
//         var id = Math.floor(Math.random() * (max - min) + min);
//     } while (existsProvider(id))
//     return id;
// }

// Handle error
function handleError(res, error) {
    return res.status(200).send('Something went wrong. \n' + error);
}
// function handleError(res, error) {
//     res.status(200);
//     res.send('Something went wrong. \n' + error);
// }

//CRUD - Create (Post), Read (Get), Update (Put), Delete

//POST
// uri: /api/providers
module.exports.create = function (req, res) {
    try {
        var provider = req.body;    //get new provider
        Provider.create(provider)
            .then(result => {
                res.status(201);
                res.send(result)
            })
            .catch(error => handleError(res, error));
    } catch (error) {
        handleError(res, error);
    }
}

//GET ALL
// uri: /api/providers
module.exports.readAll = function (req, res) {
    try {
        Provider.find()
            .then(result => {
                if (isEmptyList(providers)) {
                    return res.status(404).send('List is empty. Nothing to read.')
                }
                return res.status(200).send(result)
            })
            .catch(error => {
                return handleError(res, error);
            })
    }
    catch (error) {
        return handleError(res, error)
    }
}
// module.exports.readAll = function (req, res) {
//     try {
//         Provider.find()
//             .then(result => {
//                 if (isEmptyList(providers)) {
//                     res.status(404);
//                     res.send('List is empty. Nothing to read.')
//                 }
//                 res.status(200);
//                 res.send(result)
//             })
//             .catch(error => handleError(res, error))
//     }
//     catch (error) {
//         handleError(res, error)
//     }
// }

//GET ONE
// uri: /api/providers/123
module.exports.readOne = function (req, res) {
    try {
        // let id = new ObjectId(req.params.id);    // dataBase Mongo work in Express (change for Angular - down)
        let id = (req.params.id);                   // Angular

        // Provider.find({ '_id': id })             // dataBase Mongo work in Express (change for Angular - down)
        Provider.find({ 'id': id })                 // Angular
            .then(result => {
                if (isEmptyList(result)) {
                    res.status(404);
                    res.send('List is empty.');
                }
                // let provider = providers.find(provider => provider.id == id);
                res.status(200);
                res.send(result);
            })
            .catch(error => handleError(res, error))
    }
    catch (error) {
        handleError(res, error)
    }
}

//PUT
// uri: /api/providers/123
module.exports.update = function (req, res) {
    try {
        // let id = new ObjectId(req.params.id);      // dataBase Mongo work in Express (change for Angular - down)
        let id = (req.params.id);                    // Angular                     
        let provider = req.body;
        
        // Provider.findOneAndUpdate({ '_id': id }, provider, { new: true })   // dataBase Mongo work in Express (change for Angular - down)
        Provider.findOneAndUpdate({ 'id': id }, provider, { new: true })       // Angular
            .then(result => {
                if (isEmptyList(result)) {
                    res.status(404);
                    res.send('List is empty. Nothing to update.');
                }
                res.status(200);
                res.send(result);
            })
            .catch(error => handleError(res, error));
    }
    catch (error) {
        handleError(res, error);
    }
}

//DELETE ONE
// uri: /api/providers/123
module.exports.deleteOne = function (req, res) {
    try {
        let id = (req.params.id);
        Provider.findOneAndDelete({ 'id': id })
            .then(result => {
                if (isEmptyList(result)) {
                    return res.status(404).send('List is empty. Nothing to delete.');
                }
                return res.status(200).send(result);
            })
            .catch(error => {
                return handleError(res, error);
            });
    } catch (error) {
        return handleError(res, error);
    }
}
// module.exports.deleteOne = function (req, res) {
//     try {
//         // let id = new ObjectId(req.params.id);               // dataBase Mongo work in Express (change for Angular - down)
//         let id = (req.params.id);                              // Angular

//         // Provider.findOneAndDelete({ '_id': id })            // dataBase Mongo work in Express (change for Angular - down)
//         Provider.findOneAndDelete({ 'id': id })                // Angular
//             .then(result => {
//                 if (isEmptyList(result)) {
//                     res.status(404);
//                     res.send('List is empty. Nothing to delete.');
//                 }
//                 res.status(200);    //res.status(404)
//                 res.send(result);
//             })
//             .catch(error => handleError(res, error));
//     } catch (error) {
//         handleError(res, error);
//     }
// }

//DELETE ALL
// uri: /api/providers
module.exports.deleteAll = function (req, res) {
    try {
        Provider.deleteMany({})
            .then(result => {
                if (result.deletedCount === 0) {
                    res.status(404);
                    res.send('List is empty. Nothing to delete.');
                }
                res.status(200);
                res.send("All providers deleted.");
            })
            .catch(error => handleError(res, error));
    } catch (error) {
        handleError(res, error);
    }
}
