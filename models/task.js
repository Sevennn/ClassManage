var config = require('../config');
var pool = require('./base');

module.exports = {
    /**
     * @param examiners {Array<number>}
     * @param examinees {Array<number>}
     * @param callback {function}
     */
    DistributeTask: function(examiners, examinees, callback) {
        console.log(examinees, examiners);
        if (examinees.length <= 0 || examiners.length <= 0) {
            callback('neither examiners nor examinees can be empty!');
        }
        let relation_table = {};
        let sql_examiners = examiners.slice(0);
        for (let i = 0; i < sql_examiners.length; ++i) {
            sql_examiners[i] = 'examiner = ' + sql_examiners[i];
        }
        let sql_condition = sql_examiners.join(' or ');

        let sql = `select * from scholar_task where ${sql_condition}`;
        console.log(sql);
        pool.query(sql, (err, res, fields) => {
            if (err) {
                callback(err);
                return;
            }

            // build relation table
            for (let i = 0; i < res.length; ++i) {
                if (!(res[i]['examiner'] in relation_table)) {
                    relation_table[res[i]['examiner']] = [];
                }

                // check if examinee is already in the relations
                let index = 0;
                if ((index = examinees.indexOf(res[i]['examinee'])) != -1) {
                    examinees.splice(index, 1);
                }
                console.log(relation_table);
                relation_table[res[i]['examiner']].push(res[i]['examinee']);
            }
            for (let i = 0; i < examiners.length; ++i) {
                if (!(examiners[i] in relation_table)) {
                    relation_table[examiners[i]] = [];
                }
            }

            console.log(relation_table);

            function findMinExaminer() {
                let first_key = Object.keys(relation_table)[0];
                let min_examiner = first_key;
                let min = relation_table[first_key].length;

                for (let key in relation_table) {
                    if (relation_table[key].length < min) {
                        min_examiner = key;
                        min = relation_table[key].length;
                    }
                }
                return min_examiner;
            }

            // distribute
            let relation_to_insert = [];
            for (let i = 0; i < examinees.length; ++i) {
                let min_examiner = findMinExaminer();
                relation_table[min_examiner].push(examinees[i]);
                relation_to_insert.push([min_examiner, examinees[i]]);
            }
            console.log("relation to insert: ", relation_to_insert);
            // write to db

            let temp_str_list = [];
            for (let i = 0; i < relation_to_insert.length; ++i) {
                temp_str_list.push(`(${relation_to_insert[i].toString()},0)`);
            }
            let insert_sql = `insert into scholar_task (examiner, examinee, finished) values ${temp_str_list.join(',')}`;
            pool.query(insert_sql, relation_to_insert, (err, res, fields) => {
                let asyn_cnt = 0;
                let case_list = '';
                for (let i = 0; i < relation_to_insert.length; ++i) {
                    case_list += ` when ${relation_to_insert[i][1]} then ${relation_to_insert[i][0]} `;
                }
                let sql = `update doc set comment_by = case userid ${case_list} end where userid in (${examinees.join(',')})`;
                console.log(sql);
                pool.query(sql, examinees, (err, res, fields) => {
                    // ++asyn_cnt;
                    // if (asyn_cnt == relation_to_insert.length) callback(err, res);
                    callback(err, res);
                });
                // callback(err, res);
            });
        });
    }
};