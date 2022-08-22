const FormData = require('form-data');
const axios = require('axios');

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
            req.files["logs"].forEach(file => {
                var bodyFormData = new FormData();
                bodyFormData.append("json_file", req.files["json_file"].data);
                bodyFormData.append("txt_file", req.files["txt_file"].data);
                bodyFormData.append("log", file.data);
                axiosRequests.push(
                    axios({
                        method: "POST",
                        url: `http://localhost:3000/logs/process_dummy_api`,
                        data: bodyFormData,
                        headers: { "Content-Type": "multipart/form-data" },
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
            })).catch(errors => {
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
