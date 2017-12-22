//--------------------------------------------------
//  Commons
//--------------------------------------------------
const _headers = [
    {
        key: "Accept",
        value: "application/json",
        description: ""
    },
    {
        key: "Content-Type",
        value: "application/json",
        description: ""
    }
];
const _infos = {
    name: "Project",
    description: "",
    schema: "https://schema.getpostman.com/json/collection/v2.0.0/collection.json"
};

//--------------------------------------------------
//  Methods
//--------------------------------------------------
function __defaultValue(f) {
    if (f.type === "boolean") return true;
    if (f.type === "string") return `${f.names.wordsUpper}`;
    if (f.type === "number") return 2;
    if (f.type === "entity") return `{{${f.model.names.lowerCamel}Id}}`;
    return "null";
}
function __defaultUpdatedValue(f) {
    if (f.type === "boolean") return false;
    if (f.type === "string") return `New ${f.names.wordsUpper}`;
    if (f.type === "number") return 3;
    if (f.type === "entity") return `{{${f.model.names.lowerCamel}Id}}`;
    return "null";
}

/**
 * Generate a create
 *
 * @param model
 * @private
 */
function __create(model) {

    const payload = model.fields.list.reduce((p, f) => {
        if (f.internal) return p;
        p[f.names.underscore] = __defaultValue(f);
        return p;
    }, {});

    const setVar = `    postman.setGlobalVariable("${model.names.lowerCamel}Id", jsonData._id);`;

    return {
        name: `Create ${model.names.lowerCamel}`,
        event: [
            {
                listen: "test",
                script: {
                    type: "text/javascript",
                    exec: [
                        "if (responseCode.code === 201) {",
                        "    var jsonData = JSON.parse(responseBody);",
                        setVar,
                        "}"
                    ]
                }
            }
        ],
        request: {
            url: `{{apiUrl}}/{{apiVersion}}/${model.names.hyphen}`,
            method: "POST",
            header: _headers,
            body: {
                mode: "raw",
                raw: JSON.stringify(payload, null, 2)
            },
            description: ""
        },
        response: []
    };
}

/**
 * Generate a read
 *
 * @param model
 * @private
 */
function __read(model) {
    return {
        name: `Read ${model.names.lowerCamel}`,
        request: {
            url: `{{apiUrl}}/{{apiVersion}}/${model.names.hyphen}/{{${model.names.lowerCamel}Id}}`,
            method: "GET",
            header: _headers,
            body: {
                mode: "raw",
                raw: ""
            },
            description: ""
        },
        response: []
    };
}

/**
 * Generate a delete
 *
 * @param model
 * @private
 */
function __delete(model) {
    return {
        name: `Delete ${model.names.lowerCamel}`,
        request: {
            url: `{{apiUrl}}/{{apiVersion}}/${model.names.hyphen}/{{${model.names.lowerCamel}Id}}`,
            method: "DELETE",
            header: _headers,
            body: {
                mode: "raw",
                raw: ""
            },
            description: ""
        },
        response: []
    };
}

/**
 * Generate an update
 *
 * @param model
 * @private
 */
function __update(model) {

    const payload = model.fields.list.reduce((p, f) => {
        if (f.internal) return p;
        p[f.names.underscore] = __defaultUpdatedValue(f);
        return p;
    }, {});

    return {
        name: `Update ${model.names.lowerCamel}`,
        request: {
            url: `{{apiUrl}}/{{apiVersion}}/${model.names.hyphen}/{{${model.names.lowerCamel}Id}}`,
            method: "PATCH",
            header: _headers,
            body: {
                mode: "raw",
                raw: JSON.stringify(payload, null, 2)
            },
            description: ""
        },
        response: []
    };
}

/**
 * Generate a model
 *
 * @param model
 * @private
 */
function __model(model) {
    return {
        name: model.names.wordsUpper,
        description: "",
        item: [
            __create(model),
            __read(model),
            __update(model),
            __delete(model)
        ]
    };
}

//--------------------------------------------------
//  Output
//--------------------------------------------------
const _output = {
    variables: [],
    info: _infos,
    item: models.map(__model)
};

module.export = JSON.stringify(_output, null, 4);

