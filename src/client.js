import express from 'express';
import React from 'react';
import ReactDOM from 'react-dom';

import request from 'request';
import apicache from 'apicache';

var app = express();
let cache = apicache.middleware

var getLatlng = function () {
    var promise = new Promise(function (resolve, reject) {
        setTimeout(function () {
            var geoUrl = "https://api.geonet.org.nz/intensity?type=measured";
            var allLatlng = [];

            request({url: geoUrl, json: true}, function (err, res, json) {
                if (err) {
                    throw err;
                } else {
                    console.log('called');
                    var jsonData = (json.features);

                    jsonData.forEach(function (value, index) {

                        Object.keys(value).forEach(function (prop) {
                            if (value.hasOwnProperty("geometry")) {
                                if (value[prop].hasOwnProperty("coordinates")) {
                                    var geoData = value[prop].coordinates;
                                    var location = geoData.toString().split(',').reverse().join(',');
                                    allLatlng.push(location);
                                }
                            }
                        })
                    });
                    resolve(allLatlng);

                }

            });


        }, 2000);
    });
    return promise;
};

app.get('/', cache('10 minutes'), function (req, res) {
    var allAddress = [];
    getLatlng().then(function (allLnglat) {
        allLnglat.reduce(function (p, lnglat) {

            return p.then(function () {
                return new Promise(function (resolve, reject) {

                    var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lnglat + "&location_type=ROOFTOP&result_type=street_address&key=AIzaSyAcnccCGHGJkq3VF6SWZNwyPV7mov8YRMU";
                    //
                    request({
                        url: url,
                        json: true
                    }, function (error, response, data) {

                        if (data.status == 'OK') {
                            var address = data.results[0].formatted_address;

                            allAddress.push(address);
                        }
                        resolve(allAddress)

                    });


                });
            });
        }, Promise.resolve()).then(function (result) {
            // res.render('users', {title: result});

            //
            var App = React.createClass({
                render: function () {
                    var names = result;
                    var namesList = names.map(function (name) {
                        return <li>{name}</li>;
                    })

                    return <ul>{ namesList }</ul>
                }
            });

            ReactDOM.render(<App />, document.getElementById('container'));
            //
        }, function (error) {
            res.render('users', {title: 'Oops,wait for a minute'});
        });

    });


})



