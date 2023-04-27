const express = require('express')
const fs = require("fs");
const async = require('async')
const { parse } = require("csv-parse");
const body_parser = require('body-parser')
const userModel = require('./models/userModel')
const databaseServer = require('./services/mongodb')
const agentModel = require('./models/agentModel')
const policyModel = require('./models/policyModel')
const csvReaderService = require('./services/csvReaderService');

require('dotenv').config()

const PORT = process.env.PORT;

databaseServer.start();
app = express()

// middlewares
app.use(body_parser.urlencoded({extended: false}))
app.use(body_parser.json())

// services

// GET: root
app.get('/', (req, res) => {
    res.send({result: 'OK'});
});

// GET: find all users
app.get('/api/v1/users/', (req, res) => {
    userModel.find().exec().then(userDocs => {
        return res.send({results: userDocs})
    }).catch(err => {
        console.log('error: ', err);
        return res.badRequest("Unable to fetch docs");
    });
});

// POST: create user
app.post('/api/v1/user/create', (req, res) => {
    const body = req.body || false;
    if (!body) {
        return res.status(403).send("Missing params: (body)");
    }
    const user = {}
    user.firstname = body.firstname || false;
    user.account_name = body.account_name || false;
    user.city_name = body.city || false;
    user.gender = body.gender || false;
    user.email = body.email || false;
    user.dob = body.dob && new Date(Date.parse(body.dob)) || false;

    userModel.create(user).then((userDoc) => {
        return res.send({result: 'User created successfully.'})
    }).catch(error => {
        console.log('error: ', error);
        return res.status(403).send({error: 'Unable to create user.'})
    })
})

// POST: create agent
app.post('/api/v1/agent/create', (req, res) => {
    const body = req.body || false;
    const agent = {}
    agent.name = body.agent || false;
    
    if (!body) {
        return res.status(403).send("Missing params: (body)");
    }
    if (!name) {
        return res.status(403).send("Missing params: name");
    } 
    
    agentModel.create(agent).then((agentDoc) => {
        return res.send({result: 'Agent created successfully.'})
    }).catch(error => {
        console.log('error: ', error);
        return res.status(403).send({error: 'Unable to create agent.'})
    })
});

// POST: create policy
app.post('/api/v1/policy/create', (req, res) => {
    const body = req.body || false;
    const policy = {};

    policy.user = body.user || false;
    policy.pstart = body.pstart || false;
    policy.pend = body.pend || false;
    policy.pnumber = body.pnumber || false;
    policy.premium_amount = body.premium_amount || false;
    policy.account_type = body.account_type || false;
    policy.mode = body.mode || false;
    policy.company = body.company || false;

    if (!body) {
        return res.badRequest('Missing params: (body)');
    }

    policyModel.create(policy).then((policyDoc) => {
        return res.send({result: policyDoc});
    }).catch((error) => {
        return res.status(403).send('Unable to create policy.');
    });
});

// POST: create create
app.post('/api/v1/user/create', (req, res) => {
    const body = req.body || false;
    const user = {};

    user.policy = body.policy || false;
    user.gender = body.gender || false;
    user.active_policy = body.active_policy || false;
    user.dob = body.dob && new Date(Date.parse(body.dob)) || false;
    user.phone = body.phone || false;
    user.address = body.address || false;
    user.producer = body.producer || false;
    user.csr = body.csr || false;
    user.type = body.type || false;
    user.email = body.email || false;
    user.agent = body.agent || false;
    user.zone = body.zone || false;
    user.active_policy = body.active_policy || false;

    if (!body) {
        return res.badRequest('Missing params: (body)');
    }

    userModel.create(user).then((userDoc) => {
        return res.send({result: userDoc});
    }).catch((error) => {
        return res.status(403).send('Unable to create policy.');
    });
})

// GET: read single agent
app.get('/api/v1/agent/:id', (req, res) => {
    const params = req.params.all() || false;
    const agent_id = params.id || false;
    
    if (!body) {
        return res.status(403).send("Missing params: (body)");
    }
    if (!agent_id) {
        return res.status(403).send("Missing params: agent_id");
    }
    
    agentModel.findOne({id: agent_id}).then((policyDoc) => {
        if (!policyDoc) {
            return res.send({result: "agent with id doesn\'t exists"})
        }
        return res.send({result: policyDoc})
    }).catch(error => {
        console.log('error: ', error);
        return res.status(403).send({error: 'Unable to find agent.'})
    })
})

// GET: read single user
app.get('/api/v1/user/:id', (req, res) => {
    const params = req.params.all() || false;
    const user_id = params.id || false;
    
    if (!body) {
        return res.status(403).send("Missing params: (body)");
    }
    if (!user_id) {
        return res.status(403).send("Missing params: user_id");
    } 
    
    userModel.findOne({id: user_id}).then((userDoc) => {
        if (!userDoc) {
            return res.send({result: "user with id doesn\'t exists"})
        }
        return res.send({result: userDoc})
    }).catch(error => {
        console.log('error: ', error);
        return res.status(403).send({error: 'Unable to find user.'})
    })
});

// GET: read single policy
app.get('/api/v1/policy/:id', (req, res) => {
    const params = req.params.all() || false;
    const policy_id = params.id || false;
    
    if (!body) {
        return res.status(403).send("Missing params: (body)");
    }
    if (!policy_id) {
        return res.status(403).send("Missing params: policy_id");
    }
    
    policyModel.findOne({id: policy_id}).then((policyDoc) => {
        if (!policyDoc) {
            return res.send({result: "policy with id doesn\'t exists"})
        }
        return res.send({result: policyDoc})
    }).catch(error => {
        console.log('error: ', error);
        return res.status(403).send({error: 'Unable to find agent.'})
    })
});

// POST: delete sing;e agent
app.post('/api/v1/agent/delete/:id', (req, res) => {
    const params = req.params.all() || false;
    const agent_id = params.id || false;
    
    if (!body) {
        return res.status(403).send("Missing params: (body)");
    }
    if (!agent_id) {
        return res.status(403).send("Missing params: agent_id");
    }
    
    agentModel.deleteOne({id: agent_id}).then((policyDoc) => {
        if (!policyDoc) {
            return res.send({result: "agent with id doesn\'t exists"})
        }
        return res.send({result: "agent deleted successfully"})
    }).catch(error => {
        console.log('error: ', error);
        return res.status(403).send({error: 'Unable to find agent.'})
    })
})

// POST: delete single user
app.post('/api/v1/user/delete/:id', (req, res) => {
    const params = req.params.all() || false;
    const user_id = params.id || false;
    
    if (!body) {
        return res.status(403).send("Missing params: (body)");
    }
    if (!user_id) {
        return res.status(403).send("Missing params: user_id");
    } 
    
    userModel.deleteOne({id: user_id}).then((userDoc) => {
        if (!userDoc) {
            return res.send({result: "user with id doesn\'t exists"})
        }
        return res.send({result: userDoc})
    }).catch(error => {
        console.log('error: ', error);
        return res.status(403).send({error: 'Unable to find user.'})
    })
});

// POST: delete single policy
app.post('/api/v1/policy/delete/:id', (req, res) => {
    const params = req.params.all() || false;
    const policy_id = params.id || false;
    
    if (!body) {
        return res.status(403).send("Missing params: (body)");
    }
    if (!policy_id) {
        return res.status(403).send("Missing params: policy_id");
    }
    
    policyModel.deleteOne({id: policy_id}).then((policyDoc) => {
        if (!policyDoc) {
            return res.send({result: "policy with id doesn\'t exists"})
        }
        return res.send({result: "Policy deleted successfully"})
    }).catch(error => {
        console.log('error: ', error);
        return res.status(403).send({error: 'Unable to find agent.'})
    })
});



app.get('/api/v1/create/sheetdata', (req, res) => {
    const headers = []
    let cnt = 0;
    let row_cnt = 0;
    let is_header_row = true;
    const FILE_PATH = './data/data-sheet.csv';
    async.auto({
        readFile: (callBack) => {
            fs.createReadStream(FILE_PATH)
            .pipe(parse({ delimiter: ",", from_line: 1 }))
            .on("data", function (row) {
                if (is_header_row) {
                    row.forEach((rowData) => {
                        const formatedCol = rowData.split(' ').join('_');
                        headers.push(formatedCol);
                    });
                    is_header_row = false;
                    return
                }
                row_cnt += 1;
                async.auto({
                    processRow: (cb) => {
                        csvReaderService.processRow(row, headers, (err, result) => {
                            if (err) {
                                console.log('error: ', err);
                                return cb(err);
                            }
                            cnt += !!(result) ? 1 : 0;
                            return cb(null, cnt);
                        }) 
                    } 
                }, (err, results) => {
                    if (err) {
                        return `error: unable to process this row: ${row[13]}`
                    }
                    return cnt;
                });
            })
            .on("end", function () {
                console.log(`finished. OK\nRead: ${cnt} rows`);
                return callBack(null, `finished. OK\nRead: ${cnt} rows`);
            })
            .on("error", function (error) {
                console.log(error.message);
                return callBack(error);
            });
        }
    }, (err, results) => {
        if (err) {
            console.log('error: ', err);
            return res.status(403).send({error: `unable to process this csv file: ${FILE_PATH}`});
        }
        return res.send({result: "OK", "rowCount": row_cnt})
    });
})

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}/`);
})