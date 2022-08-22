const FormData = require('form-data');
const axios = require('axios');
const AuthHelper = require('../helpers/auth-helper');

// to read env files
require('dotenv').config()

exports.process_logs = (req, res, next) => {
    try {
        if (!req.files || !req.files["logs"]) {
            res.status(417).json({
                message: "log files not found to process"
            });
        }
        else {
            //request body will have other form-data paramss
            console.log(req.body);
            var axiosRequests = [];

            var logFiles = [];
            // check number of log files uploaded.. if 1 file type will be object, if more than 1 it will be array
            if (req.files["logs"].length == null) {
                logFiles.push(req.files["logs"]);
            }
            else {
                logFiles = req.files["logs"];
            }

            logFiles.forEach(file => {
                var bodyFormData = new FormData();
                // to read text file
                // var textContent = req.files["txt_file"].data.toString();

                // to read json file as object
                // var jsonObject = JSON.parse(req.files["json_file"].data.toString());

                bodyFormData.append("dumpstate", file.data, file.name);
                bodyFormData.append("tag_descriptor", req.files["json_file"].data, req.files["json_file"].name);
                bodyFormData.append("arguments", file.data, file.name);
                bodyFormData.append("profile", "e2e");
                bodyFormData.append("device_os", "android");
                bodyFormData.append("set_id", "1661183445");
                bodyFormData.append("is_final", 'false');
                bodyFormData.append("utterance", "show_all_pictures");

                axiosRequests.push(
                    axios({
                        method: "POST",
                        url: process.env.EXTERNAL_API_END_POINT + `/logs/process_dummy_api`,
                        data: bodyFormData,
                        headers: { "Content-Type": "multipart/form-data", "access_token": AuthHelper.getAccessToken() },
                    })
                );
            });

            axios.all(axiosRequests).then(axios.spread((...responses) => {
                console.log(responses);
                var responseList = [];
                responses.forEach(response => {
                    responseList.push(response.data);
                })
                res.status(200).json({
                    message: "successfully uploaded files",
                    data: responseList
                });
                // if token expiry error, re-genrate token
                // AuthHelper.getAccessToken();
                // this.process_logs(req, res, next);
            })).catch(errors => {
                // if token expiry error, re-genrate token
                // AuthHelper.getAccessToken();
                // this.process_logs(req, res, next);
                console.log(errors);
            })
        }
    }
    catch (err) {
        res.status(500).json({
            error: err
        });
    }
};


exports.process_log_dummy_api = (req, res, next) => {
    try {
        res.status(200).json({
            message: "successfully processed file",
            data: new Date()
        });
    }
    catch (err) {
        res.status(500).json({
            error: err
        });
    }
};
