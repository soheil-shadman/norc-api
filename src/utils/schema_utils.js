// const Schema = require('schema-js');

import { compareSync } from "bcryptjs";


export function simple_validate_schema(data, schema)
{
    return new Promise(async (resolve, reject) =>
    {
        try
        {
            // var sch = new Schema(schema);
            // //console.log(sch);
            // var result = sch.validate(data);
            // if (!result) {
            //     reject(result);
            //     return;
            // }
            var schemaKeys = Object.keys(schema);
            var objKeys = Object.keys(data);
            for (var i = 0; i < objKeys.length; i++)
            {
                var validKey = false;
                for (var j = 0; j < schemaKeys.length; j++)
                {
                    if (schemaKeys[j] == objKeys[i])
                    {
                        validKey = true;
                        break;
                    }
                }
                if (!validKey)
                    delete (data[objKeys[i]]);
            }
            resolve(data);
        } catch (err)
        {
            reject(err);
        }
    });
}
/*
    You can define a schema:
    const UserType = new SchemaChecker({
        id : Number,
        username : String,
        info : Object
        friends : Array,
        extraInfo : {

        }
    });
    data = await UserType.validate(data);
    -if any of above fields are missing they will be undefined.
    -extra fields from object are removed!
    -You can use both 'Number'/Number or 'String'/String
    but what if we want to make sure a field  is not missing?
    id : {type : Number : required : true}
    what if we want to assign a default value to missing fields?
    username : {type : String ,  default : ''}
    Note: default overrides required so you usually dont wanna use them together
    You can make complicated data types too but dont use Number use 'Number' instead!
    const UserType = new SchemaChecker({
        id : Number,
        username : String,
        info : Object
        friends : {
            type : ['Number'],
            required : true,
        },
        ownedShit : [{id:'Number',count:'Number'}]
        extraInfo : {
            type : Object,
            default : {
                'fuck':'you',
            }
        }
    });
*/
export class SchemaChecker
{
    constructor(schema, checkerFunction = (data) => { return true; })
    {
        this.schema = schema;
        this.keys = Object.keys(schema);
    }
    _isValidType = (val, type, keyName) =>
    {
        // console.log(`isValidType=>${val}=>${type}=>${keyName}`);
        if (type == typeof (Number) || type == 'float' || type == 'int')
        {
            let iVal = parseInt(val);
            if (isNaN(iVal))
                return false;
            if (type == 'int')
                return iVal == Math.floor(val);
        }
        else if (type == String || type == 'String' || type == 'string')
        {
            return typeof (val) == 'string';
        }
        else
            return typeof (val) == type;
    }
    validate = (data) =>
    {
        return new Promise((resolve, reject) =>
        {
            try
            {
                // console.log(`input is`, data);
                let dataKeys = Object.keys(data);
                //remove extra keys:
                for (var i = 0; i < dataKeys.length; i++)
                {
                    let k = dataKeys[i];
                    let kIndex = this.keys.findIndex(t => t == k);
                    if (kIndex == -1)
                        delete (data[k]);
                }
                //validate each key by type:
                for (var i = 0; i < this.keys.length; i++)
                {
                    let keyName = this.keys[i];
                    let keyInfo = this.schema[keyName];
                    if (data[keyName] == undefined)
                    {
                        if (keyInfo.required)
                            throw new Error(`required parameter ${keyName} is missing`);
                        else
                            data[keyName] = keyInfo.default;
                    }
                    else
                    {
                        let okType = this._isValidType(data[keyName], keyInfo.type, keyName);
                        if (!okType)
                            throw new Error(`invalid type for ${keyName} expected ${keyInfo.type}`);
                    }
                }
                resolve(data);
                // console.log(`output is`, data);
            } catch (err)
            {
                reject(err);
            }
        });
    }
}
export class SchemaCheckerOld
{
    constructor(schema, checkerFunction = (data) => { return true; })
    {
        this.schema = schema;
        this.keys = Object.keys(schema);
        this._isValidKey = this._isValidKey.bind(this);
        this._validateValue = this._validateValue.bind(this);
        this.validate = this.validate.bind(this);
        this.checkerFunction = checkerFunction;
    }
    _isValidKey(keyName)
    {
        for (var i = 0; i < this.keys.length; i++)
            if (this.keys[i] == keyName)
                return true;
        return false;
    }
    _validateByType(value, key, type, defaultValue = undefined, required = false)
    {
        console.log(`check schema ${key}=>${value}`);
        if (value == undefined)
        {
            //console.log(`undefined value required=${required} default=>${defaultValue}`);
            if (required && defaultValue == undefined)
                throw new Error(`required ${key} field is missing!`);
            else
                return defaultValue;
        }
        if (type == Number || type == 'Number' || type == 'int' || type == 'float')
        {
            var iVal = parseInt(value);
            var fVal = parseFloat(value);
            if (fVal == iVal)
                return iVal;
            else
                return fVal;
        }
        else if (type == String || type == 'String' || type == 'string')
        {
            // console.log(`type=string , value=${value} , key=${key}`)
            return value.toString();
            // return `${value}`;
        }
        else if (type == Boolean || type == 'boolean')
        {
            return value;
        }
    }
    _validateValue(value, keyName, schemaField, defaultValue = undefined, required = false)
    {
        var schemaFieldSTR = typeof (schemaField) != 'object' ? schemaField : JSON.stringify(schemaField);
        var valueSTR = typeof (value) != 'object' ? value : JSON.stringify(value);
        //console.log(`key ${keyName} => ${(schemaFieldSTR)} => ${valueSTR} default=${defaultValue} required=${required}`);
        if (schemaField == undefined)
            return value;
        if (schemaField == Number || schemaField == 'Number' || schemaField == 'string' || schemaField == 'int' || schemaField == 'float' || schemaField == 'String' || schemaField == String
            || schemaField == 'boolean' || schemaField == Boolean)
            return this._validateByType(value, keyName, schemaField, defaultValue, required);
        else
        {
            if (Array.isArray(schemaField) || schemaField == [] || schemaField == Array)
            {
                //console.log('array field');
                if (schemaField == Array || schemaField.length == 0)
                {
                    if (value == undefined)
                    {
                        if (required && defaultValue == undefined)
                            throw new Error(`required ${keyName} field is missing!`)
                        else
                            return defaultValue;
                    }
                    //console.log('empty array schema!');
                    return value;
                }
                else
                {
                    if (value == undefined)
                    {
                        if (required && defaultValue == undefined)
                            throw new Error(`required ${keyName} field is missing!`)
                        else
                            return defaultValue;
                    }
                    var arrSchema = schemaField[0];
                    for (var i = 0; i < value.length; i++)
                    {
                        //console.log(value[i]);
                        value[i] = this._validateValue(value[i], `${keyName}[${i}]`, arrSchema);
                        //console.log(JSON.stringify(value[i]));
                    }
                    return value;
                }
            }
            else
            {
                if (schemaField['type'] !== undefined)
                {
                    //console.log('this is more info field!');
                    //console.log(JSON.stringify(schemaField));
                    return this._validateValue(value, keyName, schemaField['type'], schemaField['default'], schemaField['required']);
                }
                else
                {
                    //console.log('this field is just an object :))');
                    if (value == undefined)
                    {
                        if (required)
                            throw new Error(`required ${keyName} field is missing!`)
                        else
                            return defaultValue;
                    }
                    var keys = Object.keys(schemaField);
                    for (var i = 0; i < keys.length; i++)
                    {
                        value[keys[i]] = this._validateValue(value[keys[i]], keys[i], schemaField[keys[i]]);
                    }
                    return value;
                }
            }
        }
    }
    validateSync(oldData)
    {
        if (oldData == undefined)
        {
            throw new Error('undefined object was passed!');
            return;
        }
        var data = Object.assign({}, oldData);
        var dataKeys = Object.keys(data);
        //remove invalid keys:
        for (var i = 0; i < dataKeys.length; i++)
        {
            if (!this._isValidKey(dataKeys[i]))
            {
                delete (data[dataKeys[i]]);
            }
        }
        // console.log(`removed extra shit success!`);
        // console.log(this.keys);
        //validate remaining keys:
        for (var i = 0; i < this.keys.length; i++)
        {
            // console.log(`${i}=>${this.keys[i]}`);
            var val = this._validateValue(data[this.keys[i]], this.keys[i], this.schema[this.keys[i]]);
            //console.log(this.keys[i] + "=>" + val);
            data[this.keys[i]] = val;
        }
        return data;
    }
    validate(oldData)
    {
        return new Promise(async (resolve, reject) =>
        {
            try
            {
                if (oldData == undefined)
                {
                    reject('undefined object was passed!');
                    return;
                }
                var data = Object.assign({}, oldData);
                var dataKeys = Object.keys(data);
                //remove invalid keys:
                for (var i = 0; i < dataKeys.length; i++)
                {
                    if (!this._isValidKey(dataKeys[i]))
                    {
                        delete (data[dataKeys[i]]);
                    }
                }
                // console.log(`removed extra shit success!`);
                // console.log(this.keys);
                //validate remaining keys:
                for (var i = 0; i < this.keys.length; i++)
                {
                    // console.log(`${i}=>${this.keys[i]}`);
                    var val = this._validateValue(data[this.keys[i]], this.keys[i], this.schema[this.keys[i]]);
                    //console.log(this.keys[i] + "=>" + val);
                    data[this.keys[i]] = val;
                }
                var result = this.checkerFunction(data);
                if (!result)
                {
                    throw new Error('invalid parameters');
                }
                resolve(data);
            }
            catch (err)
            {
                reject(err.toString());
            }
        });

    }
}