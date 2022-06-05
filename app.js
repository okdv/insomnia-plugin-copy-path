const jq = require("jsonpath"),
    {query: queryXPath} = require("insomnia-xpath");

const generateError = (error, message) => {
    throw new Error(`[copy-path] ${error}: ${message}`);
}


const copyJsonPath = (query,bodyStr,headerName) => {
    let results, body;
    try {
        body = JSON.parse(bodyStr);
    } catch(err) {
        generateError("Invalid JSON",err.message);
    }
    try {
        results = jq.query(body, query);
    } catch (err) {
        generateError("Invalid JSONPath Query",query);
    }
    if (results.length === 0) {
        generateError("Returned No Results",query);
    } else {
        if (headerName.includes("--first")) {
            results = [results[0]];
        } else if (headerName.includes("--last")) {
            results = [results[results.length - 1]];
        } 
        return JSON.stringify(results);
    }
}

const copyXPath = (query,bodyStr,headerName) => {
    let results;
    try {
        results = queryXPath(bodyStr, query);
    } catch(err) {
        generateError("Invalid XPath",query);
    }
    if (results.length === 0) {
        generateError("Returned No Results",query);

    } else {
        if (headerName.includes("--first")) {
            if (headerName.includes("--outer")) {
                results = [results[0].outer];
            } else results = [results[0].inner];
        } else if (headerName.includes("--last")) {
            if (headerName.includes("--outer")) {
                results = [results[results.length - 1].outer];
            } else results = [results[results.length - 1].inner];
        } else {
            if (headerName.includes("--outer")) {
                results = results.map(node => node.outer);
            } else results = results.map(node => node.inner);
        }
        return JSON.stringify(results);
    }

};

module.exports.responseHooks = [
    ({app, request, response}) => {
        const headers = request.getHeaders();
        headers.forEach(header => {
            if (header.name.startsWith("copy-path")) {
                const query = header.value,
                    bodyStr = response.getBody().toString(),
                    results = query.startsWith('$') ? copyJsonPath(query,bodyStr,header.name) : copyXPath(query,bodyStr,header.name);
                app.clipboard.writeText(results);
                return;
            }
        });
    }
];