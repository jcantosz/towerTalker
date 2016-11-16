# Tower Talker
A project to leverage Ansible Tower's APIs to create a project, org, inventory, credentials, and job template, then run the job template as a job. If any of these items already exist (based on their name), they will not be created.

This has been tested with the unlimited trial version of Ansible Tower: https://www.ansible.com/tower-trial

**NOTE:** This is demo code to show the use of ansible tower rest apis, it should be treated as such

## Configuration

### Important Note
This code is for testing purposes only. Get a signed certificate for your ansible tower install and remove line 6: `process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';`

### Installing
Download the project and run **npm install**

### ENV Vars
 - **PROJECT_NAME** - the name of your project in tower, creates it if DNE. Default: `my-project`
 - **PROJECT_PATH** - the path/folder to your project `/var/lib/awx/projects/PROJECT_PATH`. Default: `my-project`
 - **TOWER_API** - the tower server's api path. Default: `https://localhost/api/v1`
 - **TOWER_USER** or **TOWER_USERNAME** - the username for the tower frontend/api. Default: `admin`
 - **TOWER_PASS** or **TOWER_PASSWORD** - the password for the tower frontend/api. Default: `password`
 - **TOWER_ORG_NAME** or **TOWER_ORGANIZATION_NAME** - the tower org we are using. Default: `Default`
 - **TOWER_INV_NAME** or **TOWER_INVENTORY_NAME** - the name of the inventory we are using (or making) in tower. Default: `my-project-inventory`
 - **TOWER_CRED_NAME** or **TOWER_CREDENTIAL_NAME** - the credentail store name we are using (or making). Default: `my-project-credentials`
 - **TOWER_JOB_TEMP_NAME** or **TOWER_JOB_TEMPLATE_NAME** - the job template name we are using/creating. Default: `my-project-job-template`
 - **TOWER_JOB_TEMP_PLAYBOOK** or **TOWER_JOB_TEMPLATE_PLAYBOOK** - the playbook we are running for our job. Default: `playbook.yml`

### Running
You must have a folder at the specified **PROJECT_PATH** that is not in use by another project, and a playbook of the specified name/location.

Run: **npm start**


## TODO
 - Cleanup
 - More configuration
 - Better error handling
 - Automated tests