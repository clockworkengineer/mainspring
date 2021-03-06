'use strict';
/* 
 * The MIT License
 *
 * Copyright 2016 Robert Tizzard.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

// File handling module

var fs = require('fs');

// Contact database SQLite module

var sqlite3 = require('sqlite3');

// Database connection

var db;

var contactSQL = {
    
    // Open contacts database. If it does not exist
    // create db file and issue CREATE TABLE command
    // For simplicity all fields are 255 char and 
    // can be edited.

    initSQL: function () {

        var dbfile = 'contacts_db.db';
        var exists = fs.existsSync(dbfile);
        var dbCreateTable = "CREATE TABLE contacts (" +
                "'contactID' INTEGER PRIMARY KEY  AUTOINCREMENT," +
                "'firstName' VARCHAR(255) NULL DEFAULT NULL," +
                "'lastName' VARCHAR(255) NULL DEFAULT NULL," +
                "'phoneNumber' VARCHAR(255) NULL DEFAULT NULL," +
                "'emailAddress' VARCHAR(255) NULL DEFAULT NULL," +
                "'webSiteAddress' VARCHAR(255) NULL DEFAULT NULL," +
                "'comments' VARCHAR(255) NULL DEFAULT NULL);";

        console.log("Database support with SQLITE3");

        if (!exists) {
            console.log("Creating DB file.");
            fs.closeSync(fs.openSync(dbfile, "w"));
        }

        db = new sqlite3.Database(dbfile);

        if (!exists) {
            db.all(dbCreateTable, function (err, rows) {
                if (err) {
                    console.log(err);
                    process.exit(1);
                } else {
                    console.log("Contacts Table Created...");
                }

            });
        }
    },
    // Handle SQLite query. Note Delete and update return no error and [] for rows
    // so fake success by sending back {"affectedRows": 1} to client.

    handleSQLQuery: function (query, req, res, jsonModifier) {

        db.all(query, function (err, rows) {
            if (!err) {
                if (rows.length) {
                  res.json(jsonModifier(rows));
                } else {
                    res.json({"affectedRows": 1});
                }
            } else {
                res.json(err);
            }

            res.statusCode = 200;

        });

    },
    // Not used at present but call when exit handling put in.

    termSQL: function () {
        db.close();
    }

};

module.exports = contactSQL;


