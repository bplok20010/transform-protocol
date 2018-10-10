import express from 'express';
import { parseString } from 'xml2js';
import TPT from 'transform-protocol-template';
import log from './utils/logger';
import { find } from './db';

function fail(status = 1, message = 'fail') {
    return JSON.stringify({
        status,
        message,
        data: null
    });
}

function success(data) {
    return JSON.stringify({
        status: 0,
        message: 'success',
        data,
    });
}

function parseData(data, type) {
    if (type === 'json') {
        return JSON.parse(data);
    } else if (type === 'xml') {
        let result;
        parseString(data, function (err, ret) {
            if (err) throw err;
            result = ret;
        });
        return result;
    } else {
        return data;
    }
}

module.exports = function (port) {
    const app = express();

    app.use(function (req, res, next) {
        var reqData = [];
        var size = 0;
        req.on('data', function (data) {
            reqData.push(data);
            size += data.length;
        });
        req.on('end', function () {
            req.rawBody = Buffer.concat(reqData, size) + '';
            next();
        });
    });

    app.post('/:tid', async function (req, res) {
        log(`${req.method} ${req.path}`);
        log(req.rawBody.slice(0, 520));

        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
        res.header("Content-Type", "application/json;charset=utf-8");

        const { tid } = req.params;
        let info;
        try {
            info = await find('select * from tp_template where id=?', [tid]);
        } catch (e) {
            log(e)
            res.send(fail(5001));
            return;
        }

        if (!info) {
            log(`目标[${tid}]不存在`)
            res.send(fail(1001, '目标不存在'));
            return;
        }

        if (!info.template) {
            log(`目标[${tid}]模版内容不存在`)
            res.send(fail(1002, '模版内容为空'));
            return;
        }

        let data;
        try {
            data = parseData(req.rawBody, info.data_type || 'json');
        } catch (e) {
            log(e);
            res.send(fail(1003, '转换数据不符合规范'));
            return;
        }

        try {
            res.send(success(TPT(info.template, data)))
        } catch (e) {
            log(e);
            res.send(fail(1004, '协议转换失败'));
            return;
        }

    })

    app.listen(port, err => {
        log('服务启动成功端口：' + port);
    });
}