var config = require('../config');
var pool = require('./base');

module.exports = {
  /**
   * @param examiners {Array<number>}
   * @param examinees {Array<number>}
   * @param callback {function}
   */
  DistributeTask: function(examiners, examinees, callback) {
    let relation_table = {};
    let sql_examiners = examiners;
    for (let i = 0; i < sql_examiners.length; ++i) {
      sql_examiners[i] = 'examiner = ' + sql_examiners[i];
    }
    let sql_condition = sql_examiners.join(' or ');

    let sql = `select * from scholar_task where ${sql_condition}`;
    pool.query(sql, (err, res, fields)=>{
      if (err) {
        callback(err);
        return;
      }

      // build relation table
      for (let i = 0; i < res.length; ++i) {
        if (res[i]['examiner'] in relation_table) {
          relation_table[res[i]['examiner']] = [];
        }

        // check if examinee is already in the relations
        let index = 0;
        if ((index = examinees.indexOf(res[i]['examinee'])) != -1) {
          examinees.splice(index, 1);
        }

        relation_table[res[i]['examiner']].push(res[i]['examinee']);
      }

      function findMinExaminer() {
        let min_examiner = res[0]['examiner'];
        let min = relation_table[res[0]['examiner']].length;

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
      for (let i = 0; i < examinees; ++i) {
        let min_examiner = findMinExaminer();
        relation_table[min_examiner].push(examinees[i]);
        relation_to_insert.push([min_examiner, examinees[i]]);
      }

      // write to db
      let insert_sql = 'insert into scholar_task (`examiner`, `examinee`, `finished`) values ?'
      pool.query(insert_sql, relation_to_insert, (err, res, fields)=>{
        callback(err, res);
      });
    });
  }
};
