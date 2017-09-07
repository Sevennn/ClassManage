var crypto = require('crypto');
var config = require('../config');
var pool = require('./base');

const columns_name = ['userid', 'student_id', 'password', 'username', 'role', 'class'];

module.exports = {
  UserLogin: function(student_id, password, callback) {
    let password_cry = crypto.createHash('sha256').update(config.PASSWORD_SALT + password).digest('hex');
    pool.query('select * from user where ? and ?', [{'student_id': student_id}, {'password': password_cry}], function(err, res, fields) {
      if (err) {
        callback(err);
        return;
      }
      if (res.length == 1) {
        callback(err, res[0]['userid']);
      }
    });
  },
  UpdatePsw: function(student_id, old_password, new_password, callback) {
    let old_password_cry = crypto.createHash('sha256').update(CONFIG.PASSWORD_SALT + old_password).digest('hex');
    let new_password_cry = crypto.createHash('sha256').update(CONFIG.PASSWORD_SALT + new_password).digest('hex');

    pool.query('select * from user where ? and ?', [{'student_id': student_id}, {'password': old_password_cry}], function(err, res, fields) {
      if (err) {
        callback(err);
        return;
      }
      if (res.length > 0) {
        let userid = res[0].userid;
        pool.query('update user set ? where ?', [{'password': new_password_cry}, {'userid': userid}], function(err, res, fields) {
          if (err) {
            callback(err);
            return;
          }
          callback(err, res);
        });
      }
    });
  },
  /**
   * @param filter_obj {Object<string,number>}
   * @param callback {function}
   */
  UserSearch: function(filter_obj, callback) {
    // throw err when password in search condition
    if ('password' in filter_obj) {
      callback('password can NOT be in the filter!');
      return;
    }
    // check if the key is not a column name
    let keys = Object.keys(filter_obj);
    let err_col_name = [];
    for (let key in keys) {
      if (!(key in columns_name)) {
        err_col_name.push(key);
      }
    }
    if (err_col_name.length > 0) {
      err_col_name = err_col_name.join(' ');
      callback(`Columns ${err_col_name} not exists!`);
    }

    let condition = Object.keys(filter_obj).join(' and ');
    let sql = `select * from user where ${condition}`;
    pool.query(sql, (err, res, fields)=>{
      if (err) {
        callback(err);
        return;
      }
      callback(err, res);
    });
  },
  UserUpdate: function(filter_obj, update_obj, callback) {
    // throw err when password in search condition
    if ('password' in filter_obj) {
      callback('password can NOT be in the filter!');
      return;
    }
    // check if the key is not a column name
    let keys = Object.keys(filter_obj);
    let err_col_name = [];
    for (let key in keys) {
      if (!(key in columns_name)) {
        err_col_name.push(key);
      }
    }
    if (err_col_name.length > 0) {
      err_col_name = err_col_name.join(' ');
      callback(`Columns ${err_col_name} not exists!`);
    }

    // throw err when password, student_id, userid in update_obj
    if ('password' in update_obj || 'student_id' in update_obj || 'userid' in update_obj) {
      callback('password, student_id, userid can NOT be in the update_obj!');
    }
    // check if the key is not a column name
    let keys = Object.keys(update_obj);
    let err_col_name = [];
    for (let key in keys) {
      if (!(key in columns_name)) {
        err_col_name.push(key);
      }
    }
    if (err_col_name.length > 0) {
      err_col_name = err_col_name.join(' ');
      callback(`Columns ${err_col_name} not exists!`);
    }

    let condition = Object.keys(filter_obj).join(' and ');
    let sql = `update user set ? where ${condition}`;
    pool.query(sql, update_obj, (err, res, fields)=>{
      if (err) {
        callback(err);
        return;
      }
      callback(err, res);
    });
  }
}
