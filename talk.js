var async = require('async'),
    request = require('request');

//Very bad, see linked solution from http://stackoverflow.com/questions/10888610/ignore-invalid-self-signed-ssl-certificate-in-node-js-with-https-request
// Link goes to http://stackoverflow.com/questions/20433287/node-js-request-cert-has-expired#answer-29397100
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

var ENV = process.env,
    project_name = ENV.PROJECT_NAME || 'my-project',
    project_path = ENV.PROJECT_PATH || 'my-project',
    server = ENV.TOWER_API || 'https://localhost/api/v1',
    username = ENV.TOWER_USER || ENV.TOWER_USERNAME || 'admin',
    password = ENV.TOWER_PASS || ENV.TOWER_PASSWORD || 'password',
    org_name = ENV.TOWER_ORG_NAME || ENV.TOWER_ORGANIZATION_NAME || 'Default',
    inv_name = ENV.TOWER_INV_NAME || ENV.TOWER_INVENTORY_NAME || 'my-project-inventory',
    cred_name = ENV.TOWER_CRED_NAME || ENV.TOWER_CREDENTIAL_NAME || 'my-project-credentials',
    job_temp_name = ENV.TOWER_JOB_TEMP_NAME || ENV.TOWER_JOB_TEMPLATE_NAME || 'my-project-job-template',
    job_temp_playbook = ENV.TOWER_JOB_TEMP_PLAYBOOK || ENV.TOWER_JOB_TEMPLATE_PLAYBOOK || 'playbook.yml',
    auth = {
        'username': username,
        'password': password
    },
    request_content = {'headers': {}},
    content = {
        'organization': {
            'name': org_name
        },
        'project': {
            'name': project_name,
            'path': project_path
        },
        'inventory': {
            'name': inv_name
        },
        'credential' : {
            'name': cred_name
        },
        'job_template': {
            'name': job_temp_name,
            'playbook':  job_temp_playbook
        }
    };


/**
 * Get the token
**/
function getToken(callback){
    console.log("Get Token");
    request.post(server + '/authtoken/', {json: auth}, function(req, res){
        request_content.headers['Authorization'] = 'Token ' + res.body.token;
        callback();
    });
}

/**
 * Handle GET requests
**/
function getRespond(req, res, callback){
    var i, body, results;
    try{
        body = JSON.parse(res.body);
    }catch (e){
        body = res.body;
    }
    if(res.statusCode != 200){
        return callback(res);
    }

    if(body && body.count != 0){
        results = body.results[0];
        content[results.type]['id'] = results.id;
    }

    callback();
}

/**
 * Handle POST requests
**/
function postRespond(req, res, callback){
    var i,
        body = res.body;

    if(res.statusCode != 201){
        return callback(res);
    }

    content[body.type]['id'] = body.id;

    callback();
}


//Only one org for trial tower license, so no createOrganization function
function getOrganization(callback){
    console.log("Get Organization");
    request.get(server + '/organizations/?name=' + content.organization.name, request_content, (req, res) => {
        getRespond(req, res, callback);
    });
}

function getProject(callback){
    console.log("Get Project");
    request.get(server + '/projects/?name=' + content.project.name, request_content, (req, res) => {
        getRespond(req, res, callback);
    });
}

function createProject(callback){
    console.log("Create Project");
    if(!content.project.id){
        var create_project_request = request_content;
        create_project_request['json'] = {
            "name": content.project.name,
            "description": "",
            "local_path": content.project.path,
            "scm_type": "",
            "scm_url": "",
            "scm_branch": "",
            "scm_clean": false,
            "scm_delete_on_update": false,
            "credential": null,
            "organization": content.organization.id,
            "scm_update_on_launch": false,
            "scm_update_cache_timeout": 0
        };
        request.post(server + '/projects/', create_project_request, (req, res) => {
            postRespond(req, res, callback);
        });
    }else{
        console.log("\tSkipped, project already exist");
        callback();
    }
}

function getInventory(callback){
    console.log("Get Inventory");
    request.get(server + '/inventories/?name=' + content.inventory.name, request_content, (req, res) => {
        getRespond(req, res, callback);
    });
}

function createInventory(callback){
    console.log("Create Inventory");
    if(!content.inventory.id){
        var create_inventory_request = request_content;
        create_inventory_request['json'] = {
            "name": content.inventory.name,
            "description": "",
            "organization": content.organization.id,
            "variables": ""
        };
        request.post(server + '/inventories/', create_inventory_request, (req, res) => {
            postRespond(req, res, callback);
        });
    }else{
        callback();
    }
}

function getCredential(callback){
    console.log("Get Credentials");
    request.get(server + '/credentials/?name=' + content.credential.name, request_content, (req, res) => {
        getRespond(req, res, callback);
    });
}

function createCredential(callback){
    console.log("Create Credentials");
    if(!content.credential.id){
        var create_credential_request = request_content;
        create_credential_request['json'] = {
            "name": content.credential.name,
            "description": "",
            "kind": "ssh",
            "host": "",
            "username": "",
            "password": "",
            "security_token": "",
            "project": "",
            "domain": "",
            "ssh_key_data": "",
            "ssh_key_unlock": "",
            "organization": content.organization.id,
            "become_method": "",
            "become_username": "",
            "become_password": "",
            "vault_password": "",
            "subscription": "",
            "tenant": "",
            "secret": "",
            "client": "",
            "authorize": false,
            "authorize_password": "",
            "user": null,
            "team": null
        };
        request.post(server + '/credentials/', create_credential_request, (req, res) => {
            postRespond(req, res, callback);
        });
    }else{
        console.log("\tSkipped, credentials already exist");
        callback();
    }
}

function getJobTemplate(callback){
    console.log("Get Job Template");
    request.get(server + '/job_templates/?name=' + content.job_template.name, request_content, (req, res) => {
        getRespond(req, res, callback);
    });
}

function createJobTemplate(callback){
    console.log("Create Job Template");
    if(!content.job_template.id){
        var create_job_template_request = request_content;
        create_job_template_request['json'] = {
            "name": content.job_template.name,
            "description": "",
            "job_type": "run",
            "inventory": content.inventory.id,
            "project": content.project.id,
            "playbook": content.job_template.playbook,
            "credential": content.credential.id,
            "cloud_credential": null,
            "network_credential": null,
            "forks": 0,
            "limit": "",
            "verbosity": 0,
            "extra_vars": "",
            "job_tags": "",
            "force_handlers": false,
            "skip_tags": "",
            "start_at_task": "",
            "host_config_key": "",
            "ask_variables_on_launch": false,
            "ask_limit_on_launch": false,
            "ask_tags_on_launch": false,
            "ask_skip_tags_on_launch": false,
            "ask_job_type_on_launch": false,
            "ask_inventory_on_launch": false,
            "ask_credential_on_launch": false,
            "survey_enabled": false,
            "become_enabled": false,
            "allow_simultaneous": false
        };
        request.post(server + '/job_templates/', create_job_template_request, (req, res) => {
            postRespond(req, res, callback);
        });
    }else{
        console.log("\tSkipped, job template already exist");
        callback();
    }
}

function runJobTemplate(callback){
    console.log("Run Job Template");
    request.post(server + '/job_templates/' + content.job_template.id + '/launch/', request_content, function(req, res){
        var i,
            body = res.body;
        if(res.statusCode != 201){
            return callback(res);
        }

        callback();
    });
}


async.series([
    getToken,
    getOrganization,
    getProject,
    createProject,
    getInventory,
    createInventory,
    getCredential,
    createCredential,
    getJobTemplate,
    createJobTemplate,
    runJobTemplate
], function(err){
    if(err){
        console.log("Error: " + JSON.stringify(err));
        process.exit(1);
    }
    console.log('done');
    process.exit(0);
});
