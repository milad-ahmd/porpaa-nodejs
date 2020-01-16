var pm2Config = {
    "apps":
    [
        {
            "name": "api",
            "script": "./dist/app.js",
            "exec_mode": "cluster_mode",
            "instances": "2"
        },
        {
            "name": "smsWorker",
            "script": "./dist/workers/smsWorker.js",
            "instances": 1
        },
        {
            "name": "notificationWorker",
            "script": "./dist/workers/notificationWorker.js",
            "instances": 1
        },
        {
            "name": "challengeWorker",
            "script": "./dist/workers/challengeWorker.js",
            "instances": 1
        }
    ]
};

module.exports = pm2Config;
