const agentModel = require("../models/agentModel");
const cityModel = require("../models/cityModel");
const policyModel = require("../models/policyModel");
const zoneModel = require("../models/zoneModel");
const userModel = require('../models/userModel')
const async = require('async')

const MAP_COL_TO_KEY = {
  agent: {key: "name", collection: "agentModel" },

  userType: {key: "type", collection: "userModel" },
  hasActive_ClientPolicy: {key: "active_policy", collection: "userModel" },
  producer: {key: "producer", collection: "userModel" },
  csr: {key: "csr", collection: "userModel" },
  account_name: {key: "account_name", collection: "userModel" },
  email: {key: "email", collection: "userModel" },
  gender: {key: "gender", collection: "userModel" },
  firstname: {key: "firstname", collection: "userModel" },
  phone: {key: "phone", collection: "userModel" },
  address: {key: "address", collection: "userModel" },
  dob: {key: "dob", collection: "userModel" },

  policy_mode: {key: "mode", collection: "policyModel" },
  policy_number: {key: "pnumber", collection: "policyModel" },
  premium_amount_written: {key: "", collection: "policyModel" },
  premium_amount: {key: "premium_amount", collection: "policyModel" },
  policy_type: {key: "ptype", collection: "policyModel" },
  policy_start_date: {key: "pstart", collection: "policyModel" },
  account_type: {key: "account_type", collection: "policyModel" },
  policy_end_date: {key: "pend", collection: "policyModel" },
  company_name: {key: "company_name", collection: "policyModel" },
  category_name: {key: "company_cat", collection: "policyModel" },

  zip: {key: "zip", collection: "zoneModel" },
  
  city: {key: "name", collection: "cityModel" },
  state: {key: "state", collection: "cityModel" },
};

module.exports = {
  processRow: (row, headers) => {
    const user = {}
    const agent = {}
    const policy = {}
    const city = {}
    const zone = {}

    row.forEach((rowData, index) => {
        const collectionName = MAP_COL_TO_KEY[headers[index]] && MAP_COL_TO_KEY[headers[index]].collection || false;
        const key = MAP_COL_TO_KEY[headers[index]] && MAP_COL_TO_KEY[headers[index]].key || false;

        if (!collectionName || !key) {
            return;
        }

        if (collectionName === 'userModel') {
            user[key] = rowData;
        }
        if (collectionName === 'agentModel') {
            agent[key] = rowData;
        }
        if (collectionName === 'policyModel') {
            policy[key] = rowData;
        }
        if (collectionName === 'zoneModel') {
            zone[key] = rowData;
        }
        if (collectionName === 'cityModel') {
            city[key] = rowData;
        }
    });

    // console.log('agent: ', agent);
    // console.log('city: ', city);
    // console.log('zone: ', zone);
    // console.log('user: ', user);
    // console.log('policy: ', policy);

    user.gender = user.gender ? user.gender.toLowerCase() : '';
    user.active_policy = !!(user.active_policy);

    if (policy && !policy.pnumber) {
        return false;
    }
    if (user && !user.email) {
        return false;
    }

    // return callBack(null, true);
    
    async.auto({
        agentExists: (cb) => {
            agentModel.findOne({name: agent.name}).then(agentDoc => {
                if (!agentDoc) {
                    return cb(null, false);
                }
                return cb(null, agentDoc);
            }).catch(err => {
                if (err) {
                    return cb(err);
                }
            });
        },
        createAgent: ['agentExists', (results, cb) => {
            if (results.agentExists) {
                return cb(null, results.agentExists);
            }
            agentModel.create(agent).then((agentDoc) => {
                console.log('agent created successfully');
                return cb(null, agentDoc);
            }).catch((err) => {
                if (err) {
                    return cb(err);
                }
            });
        }],
        cityExists: (cb) => {
            if (!city.name) {
                return cb(null, false);
            }
            cityModel.findOne({name: city.name}).then(cityDoc => {
                if (!cityDoc) {
                    return cb(null, false);
                }

                return cb(null, cityDoc);
            }).catch(err => {
                if (err) {
                    return cb(err);
                }
            });;
        },
        createCity: ['cityExists', (results, cb) => {
            if (results.cityExists) {
                return cb(null, results.cityExists);
            }
            if (city.name) {
                return cb(null, false);
            }
            cityModel.create(city).then((cityDoc) => {
                console.log('city created successfully');
                return cb(null, cityDoc);
            }).catch(err => {
                console.log('error: ', err);
                return cb(err);
            });
        }],
        zoneExists: ['createCity', (results, cb) => {
            if (!results.createCity) {
                return cb(null, false);
            }
            zoneModel.findOne({zip: zone.zip}).then(cityDoc => {
                if (!cityDoc) {
                    return cb(null, false);
                }

                return cb(null, true);
            }).catch(err => {
                if (err) {
                    return cb(err);
                }
            });;
        }],
        createZone: ['createCity', 'zoneExists', (results, cb) => {
            if (results.zoneExists) {
                return cb(null, results.zoneExists);
            }
            if (zone.zip) {
                return cb(null, false);
            }
            zone.city = results.createCity.id;
            zoneModel.create(zone).then((zoneDoc) => {
                console.log('Zone created successfully');
                return cb(null, zoneDoc);
            }).catch(err => {
                console.log('error: ', err);
                return cb(err);
            });
        }],
        policyExists: (cb) => {
            policyModel.findOne({pnumber: policy.pnumber}).then(policyDoc => {
                if (!policyDoc) {
                    return cb(null, false);
                }

                return cb(null, policyDoc);
            }).catch(err => {
                if (err) {
                    return cb(err);
                }
            });;
        },
        createPolicy: ['policyExists', (results, cb) => {
            if (results.policyExists) {
                return cb(null, results.policyExists);
            }
            if (policy.pstart) {
                policy.pstart = new Date(Date.parse(policy.pstart))
            }
            if (policy.pend) {
                policy.pend = new Date(Date.parse(policy.pend))
            }
            policyModel.create(policy).then((policyDoc) => {
                console.log('policy created successfully');
                return cb(null, policyDoc);
            }).catch(err => {
                console.log('error: ', err);
                return cb(err);
            });
        }],
        userExists: (cb) => {
            userModel.findOne({account_name: user.account_name}).then(userDoc => {
                if (!userDoc) {
                    return cb(null, false);
                }

                return cb(null, userDoc);
            }).catch(err => {
                if (err) {
                    return cb(err);
                }
            });;
        },
        createUser: ['userExists', 'createAgent', 'createPolicy', 'createZone', (results, cb) => {
            if (results.userExists) {
                return cb(null, results.userExists);
            }
            if (user.dob) {
                user.dob = new Date(Date.parse(user.dob))
            }
            user.policy = results.createPolicy.id;
            user.agent = results.createAgent.id;
            user.zone = results.createZone.id;
            userModel.create(user).then((userDoc) => {
                console.log('user created successfully');
                return cb(null, userDoc);
            }).catch(err => {
                console.log('error: ', err);
                return cb(err);
            });
        }],
    }, (err, results) => {
        if (err) {
            return false;
        }
        return true;
    })
  },
};
