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

let attributesQueryModes = {
    none : 0,
    require : 1,
    exclude : 2 
}

/**
 * 
 * @returns {JFOHandler}
 */
var JFO = {

    /**
     * 
     * @param {Object, Object[]} data 
     * @param {int} queryMode 
     * @param {} fields 
     */
    filterProperties : function(data, queryMode, fields){
        if(queryMode === attributesQueryModes.none){
            return data;
        }

        let single = !Array.isArray(data);
        if(single){
            data = [data];
        }

        console.log("The query mode is: " + queryMode);
        console.log("And the fields are: " + fields);
        
        //Get each object
        data.forEach((d) => {
            //Get each property name
            for(let prop in d){
                if(queryMode == attributesQueryModes.exclude && fields.indexOf(prop) >= 0){
                    delete d[prop];
                }else if(queryMode == attributesQueryModes.require && fields.indexOf(prop) < 0){
                    delete d[prop];
                }
            }
        });

        if(single){
            return data[0];
        }else{
            return data;
        }
    }
}

/**
 * 
 * @param {Object} filter 
 */
function build(filter){
    return new JFOHandler(filter);
}

module.exports = build;