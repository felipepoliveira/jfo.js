/**
 * 
 */
class JFOHandler{
    constructor(filter){
        //Validate query mode
        if(filter["require"] && filter["exclude"]){
            throw 'The filter object can not have "require" and "exclude" simultaneously.';
        }

        //Check witch attribute query mode was defined
        this.attributeQueryMode =   (filter["require"]) ? attributesQueryModes.require 
                                    : (filter["exclude"]) ? attributesQueryModes.exclude :
                                    attributesQueryModes.none;

        //Get the attributes from the query mode
        switch(this.attributeQueryMode){
            case attributesQueryModes.require:
                this.fields = filter.require;
            break;
            case attributesQueryModes.exclude:
                this.fields = filter.exclude;
            break;
        }
    }

    filter(obj){
        obj = JFO.filterProperties(obj, this.attributeQueryMode, this.fields);
        return obj;
    }
}

/**
 * Enumeration of all possible query modes:
 * {
 *  none : 0,
 *  require : 1,
 *  exclude : 2
 * }
 */
let attributesQueryModes = {
    none : 0,
    require : 1,
    exclude : 2 
}

/**
 * Internal object that contains the logic used in the JFOHandler class object
 */
var JFO = {

    /**
     * Extract the name of an subproperty.
     * Example: prop : "foo.bar", it returns "foo";
     * @param {string} prop - The property name
     */
    extractPropertyObjectName : function(prop){
        return prop.substring(0, prop.indexOf('.'));
    },

    /**
     * Extract the name of an subproperty.
     * Example: prop : "foo.bar", it returns "bar";
     * Another Example: prop : "foo.bar.zip", it returns "bar.zip"
     * @param {string} prop - The property name
     */
    extractPropertyObjectField : function(prop){
        return prop.substring(prop.indexOf('.') + 1, prop.length);
    },

    /**
     * @param {Object, Object[]} data 
     * @param {int} queryMode 
     * @param {Array[string]} fields 
     */
    filterProperties : function(data, queryMode, fields){
        if(queryMode === attributesQueryModes.none){
            return data;
        }

        //Verify if the data is not an array
        let single = !Array.isArray(data);
        if(single){
            data = [data];
        }

        //Get each required/excluded field
        fields.forEach((field) => {

            //Get each object from the input data
            data.forEach((object) => {

                let filteredFields = [];

                /*
                Check if the field is a property of a property. If true, call this method recursively 
                passing the property as the current object parameter
                */
                if(this.isSubProperty(field)){
                    let propName = this.extractPropertyObjectName(field);
                    let subPropName = this.extractPropertyObjectField(field);

                    //Mark the field as an already filtered field
                    filteredFields.push(propName);

                    this.filterProperties(object[propName], queryMode, [subPropName]);
                }
                
            
                //Get each property of the current object
                for(let prop in object){

                    //If the field is already filtered skip to another
                    if(filteredFields.indexOf(prop) >= 0){
                        continue;
                    }
                    
                    /*
                    * If the query mode is 'exclude' it deletes the property from the object
                    * if its property name is inside the fields array.
                    * if the query mode is 'require' it only deletes the property from the object
                    * if its property is NOT inside the fields array.
                    */
                    if(queryMode == attributesQueryModes.exclude && fields.indexOf(prop) >= 0){
                        delete object[prop];
                    }else if(queryMode == attributesQueryModes.require && fields.indexOf(prop) < 0){
                        delete object[prop];
                    }

                }

            });
        });

        //If the object was is in single mode, return the first element of the array
        if(single){
            return data[0];
        }else{
            return data;
        }
    },

    /**
     * 
     * Return an flag indicating if the property is an sub property
     * @param {string} prop - The name of the property
     * @returns {boolean}
     */
    isSubProperty : function(prop){
        return prop.indexOf('.') >= 0;
    }
}

/**
 * Return an instance of the JFOHandler object
 * @param {JFOHandler} filter 
 */
function build(filter){
    return new JFOHandler(filter);
}

module.exports = build;