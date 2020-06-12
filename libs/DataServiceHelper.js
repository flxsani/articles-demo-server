import {
    DataService
} from '../db';
import {
    CustomError
} from './pnkCustomError';
import {
    ObjectId
} from 'mongodb';

export async function AddNew(collectionName, dataObj) {

    try {
        const col = DataService.collection(collectionName);
        return await col.insertOne(dataObj).ops;
    } catch (error) {
        CustomError.PassErrorToParentHandler(error, "DB", "Record not saved for collection " + collectionName + '. Data:' + JSON.stringify(dataObj), "");
    }
}

export async function AddMany(collectionName, dataObj) {
    try {
        const col = DataService.collection(collectionName);
        return await col.insertMany(dataObj)
    } catch (error) {
        CustomError.PassErrorToParentHandler(error, "DB", "Record not saved for collection " + collectionName + '. Data:' + JSON.stringify(dataObj), "");
    }
}
export async function GetAll(collectionName, condition = {}, columns = []) {
    try {
        let selectedFileds = await GetFieldObject(columns);
        //console.log("SelectedFields::", selectedFileds);
        const col = DataService.collection(collectionName);
        //let count = await col.find(condition, selectedFileds).count();
        // console.log("Count:::", count);
        return await col.find(condition, {
            projection: selectedFileds
        }).toArray();
    } catch (error) {
        CustomError.PassErrorToParentHandler(error, "DB", "Something went wrong while fetching data from " + collectionName + '.', "");
    }
}
export async function GetAllWithLimit(collectionName, condition = {}, columns = [], sortAct = null, sortBy = null, limit = 0, skip = 0) {
    try {
        let selectedFileds = await GetFieldObject(columns);
        //console.log("SelectedFields::", selectedFileds);
        const col = DataService.collection(collectionName);
        //let count = await col.find(condition, selectedFileds).count();
        // console.log("Count:::", count);
        let query = col.find(condition, {
            projection: selectedFileds
        })
        let sortCondition = null;
        if (sortAct && sortBy) {
            if (sortAct == 'asc') {
                sortCondition = {}
                sortCondition[sortBy] = 1.0;
                console.log("Inside Asc : ", sortAct, sortBy);
            } else {
                sortCondition = {}
                sortCondition[sortBy] = -1.0;
                console.log("Inside desc", sortAct, sortBy)
            }
            query.sort(sortCondition);
        }
        if(skip >0){
            query.skip(skip);
        }

        if(limit >0){
            query.limit(limit);
        }
        return await query.toArray();
    } catch (error) {
        CustomError.PassErrorToParentHandler(error, "DB", "Something went wrong while fetching data from " + collectionName + '.', "");
    }
}

export async function GetCount(collectionName, condition = {}) {
    try {
        const col = DataService.collection(collectionName);
        let count = await col.find(condition).count();
        console.log("Count:::", count);
        return await col.find(condition).toArray();
    } catch (error) {
        CustomError.PassErrorToParentHandler(error, "DB", "Something went wrong while fetching data from " + collectionName + '.', "");
    }
}
export async function GetDataByPkey(collectionName, id, columns = []) {
    try {
        let selectedFileds = await GetFieldObject(columns);
        //console.log("SelectedFields::", selectedFileds);
        const col = DataService.collection(collectionName);
        return await col.findOne({
            _id: new ObjectId(id)
        }, {
                projection: selectedFileds
            });

    } catch (error) {
        CustomError.PassErrorToParentHandler(error, "DB", "Something went wrong while fetching data from " + collectionName + '.', "");
    }
}

export async function AllRecords(collectionName) {
    try {
        const col = DataService.collection(collectionName);
        return await col.find(collectionName).toArray();
    } catch (error) {
        CustomError.PassErrorToParentHandler(error, "DB", "something went wrong while fetching data from " + collectionName + '.', "");
    }
}


export async function GetAllByFkey(collectionName, condition = {}, localColumn, foreignCollection, foreignColumn, foreignResultFieldName, columns = [], sortAct, sortBy) {
    try {
        let selectedFileds = await GetFieldObject(columns);
        const col = DataService.collection(collectionName);
        let aggrArray = [];
        if (condition != '{}') {
            let conditionObj = {};
            conditionObj["$match"] = condition;
            aggrArray.push(conditionObj);
        }

        let lookupObj = {
            "$lookup": {
                "from": foreignCollection,
                "localField": localColumn,
                "foreignField": foreignColumn,
                "as": foreignResultFieldName
            }
        };

        aggrArray.push(lookupObj);

        if (columns.length > 0) {
            let projectionObj = {};
            projectionObj["$project"] = selectedFileds;
            aggrArray.push(projectionObj);
        }

        let sortCondition = null;
        if (sortAct && sortBy) {
            if (sortAct == 'asc') {
                sortCondition = {}
                sortCondition["$sort"] = {};
                sortCondition.$sort[sortBy] = 1.0;
                console.log("Inside Asc : ", sortAct, sortBy);
            } else {
                sortCondition = {}
                sortCondition["$sort"] = {};
                sortCondition.$sort[sortBy] = -1.0;
                console.log("Inside desc", sortAct, sortBy)
            }
            aggrArray.push(sortCondition);
        }
        //console.log("AggrigatArray:::", aggrArray);
        return await col.aggregate(
            aggrArray, {
                "allowDiskUse": false
            }
        ).toArray();


    } catch (error) {
        CustomError.PassErrorToParentHandler(error, "DB", "Something went wrong while fetching data from " + collectionName + '.', "");
    }
}
export async function DoesExist(collectionName, condition = {}) {
    try {
        
        const col = DataService.collection(collectionName);
        //console.log("SelectedCollection::::::::",col);
        let datalength = await col.find(condition).count();
        if (datalength > 0)
            return true
        else
            return false

    } catch (error) {
        CustomError.PassErrorToParentHandler(error, "DB", "Something went wrong while fetching data from " + collectionName + '.', "");
    }
}
export async function Update(collectionName, condition = {}, dataObj, upsertStatus = true) {

    try {
        const col = DataService.collection(collectionName);
        return await col.updateOne(condition, {
            $set: dataObj
        }, {
                upsert: upsertStatus
            })
        // return await col.updateOne( { "ProductName" : "HIJ" }, { $set: { "ProductDescription" : "This is latest technology" } })
    } catch (error) {
        CustomError.PassErrorToParentHandler(error, "DB", "Record not update for collection " + collectionName + '. Data:' + JSON.stringify(dataObj), "");
    }
}
export async function UpdateInEmbeddedField(collectionName, condition = {}, columnName, dataObj, upsertStatus = true) {

    try {
        const col = DataService.collection(collectionName);
        let pushObje = {};
        pushObje[columnName] = dataObj;
        return await col.updateOne(condition, {
            $push: pushObje
        }, {
                upsert: upsertStatus
            })
        // return await col.updateOne( { "ProductName" : "HIJ" }, { $set: { "ProductDescription" : "This is latest technology" } })
    } catch (error) {
        CustomError.PassErrorToParentHandler(error, "DB", "Record not update for collection " + collectionName + '. Data:' + JSON.stringify(dataObj), "");
    }
}

export async function Delete(collectionName, condition = {}) {
    try {
        const col = DataService.collection(collectionName);

        return await col.deleteOne(condition)
    } catch (error) {
        CustomError.PassErrorToParentHandler(error, "DB", "Record not delete from collection " + collectionName, "");
    }

}
export async function DeleteMultiple(collectionName, condition = {}) {
    try {
        const col = DataService.collection(collectionName);

        return await col.deleteMany(condition)
    } catch (error) {
        CustomError.PassErrorToParentHandler(error, "DB", "Record not delete from collection " + collectionName, "");
    }
}

async function GetFieldObject(fields) {
    let selectedFileds = {};
    if (fields.length > 0) {
        for (let i = 0; i < fields.length; i++) {
            selectedFileds[fields[i]] = 1;
        }
        return selectedFileds;
    } else {
        return {};
    }
}

export async function GetAllWithForeignData(collectionName, condition = {}, localColumn, foreignCollection, foreignColumn, foreignResultFieldName, columns = [], sortAct = null, sortBy = null, limit = 0, skip = 0) {
    try {
        let selectedFileds = await GetFieldObject(columns);
        const col = DataService.collection(collectionName);
        let aggrArray = [];
        if (condition != '{}') {
            let conditionObj = {};
            conditionObj["$match"] = condition;
            aggrArray.push(conditionObj);
        }

        let lookupObj = {
            "$lookup": {
                "from": foreignCollection,
                "localField": localColumn,
                "foreignField": foreignColumn,
                "as": foreignResultFieldName
            }
        };

        aggrArray.push(lookupObj);

        if (columns.length > 0) {
            let projectionObj = {};
            projectionObj["$project"] = selectedFileds;
            aggrArray.push(projectionObj);
        }

        let sortCondition = null;
        if (sortAct && sortBy) {
            if (sortAct == 'asc') {
                sortCondition = {}
                sortCondition["$sort"] = {};
                sortCondition.$sort[sortBy] = 1.0;
                console.log("Inside Asc : ", sortAct, sortBy);
            } else {
                sortCondition = {}
                sortCondition["$sort"] = {};
                sortCondition.$sort[sortBy] = -1.0;
                console.log("Inside desc", sortAct, sortBy)
            }
            aggrArray.push(sortCondition);
        }

        if (skip > 0) {
            let skipObj = {};
            skipObj['$skip'] = skip;
            aggrArray.push(skipObj);
        }

        if (limit > 0) {
            let limitObj = {};
            limitObj['$limit'] = limit;
            aggrArray.push(limitObj);
        }

        //console.log("AggrigatArray:::", JSON.stringify(aggrArray, null, 4));
        return await col.aggregate(
            aggrArray, {
                "allowDiskUse": false
            }
        ).toArray();
    } catch (error) {
        CustomError.PassErrorToParentHandler(error, "DB", "Something went wrong while fetching data from " + collectionName + '.', "");
    }
}