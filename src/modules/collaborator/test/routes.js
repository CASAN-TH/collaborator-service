'use strict';
var request = require('supertest'),
    assert = require('assert'),
    config = require('../../../config/config'),
    _ = require('lodash'),
    jwt = require('jsonwebtoken'),
    mongoose = require('mongoose'),
    app = require('../../../config/express'),
    Collaborator = mongoose.model('Collaborator');

var credentials,
    token,
    _collaborator,
    mockup;

describe('Collaborator CRUD routes tests', function () {

    before(function (done) {
        _collaborator = new Collaborator({
            email : "tt2@gmail.com",
            role : "member",
            status :"invite",
            schoolid : "4567"
        });
        _collaborator.save();
        mockup = {
            email:"porapot2@gmail.com"

        };
        credentials = {
            username: 'username',
            password: 'password',
            firstname: 'first name',
            lastname: 'last name',
            email: 'test@email.com',
            roles: ['user'],
            ref1: "1234"
        };
        token = jwt.sign(_.omit(credentials, 'password'), config.jwt.secret, {
            expiresIn: 2 * 60 * 60 * 1000
        });
        done();
    });

    it('should be Collaborator get use token', (done)=>{

        request(app)
            .post('/api/collaborators')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                .get('/api/collaborators')
                .set('Authorization', 'Bearer ' + token)
                .expect(200)
                .end((err, res)=>{
                    if (err) {
                        return done(err);
                    }
                    var resp = res.body;
                    assert.equal(resp.data.length,1);
                    done();
                });
            });
    });

    it('should be Collaborator get by id', function (done) {

        request(app)
            .post('/api/collaborators')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .get('/api/collaborators/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        assert.equal(resp.status, 200);
                        assert.equal(resp.data.email, mockup.email);
                        assert.equal(resp.data.role,"member");
                        assert.equal(resp.data.status,"invite");
                        assert.equal(resp.data.link,"localhost");
                        assert.equal(resp.data.schoolid,"1234");
                        
                        
                        
                        done();
                    });
            });

    });

    it('should be Collaborator post use token', (done)=>{
        request(app)
            .post('/api/collaborators')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                assert.equal(resp.data.email, mockup.email);
                done();
            });
    });

    it('should be collaborator put use token', function (done) {

        request(app)
            .post('/api/collaborators')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                var update = {
                    email: 'email update'
                }
                request(app)
                    .put('/api/collaborators/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .send(update)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        assert.equal(resp.data.email, update.email);
                        done();
                    });
            });

    });

    it('should be collaborator delete use token', function (done) {

        request(app)
            .post('/api/collaborators')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .delete('/api/collaborators/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200)
                    .end(done);
            });

    });

    it('should be collaborator get not use token', (done)=>{
        request(app)
        .get('/api/collaborators')
        .expect(403)
        .expect({
            status: 403,
            message: 'User is not authorized'
        })
        .end(done);
    });

    it('should be collaborator post not use token', function (done) {

        request(app)
            .post('/api/collaborators')
            .send(mockup)
            .expect(403)
            .expect({
                status: 403,
                message: 'User is not authorized'
            })
            .end(done);

    });

    it('should be collaborator put not use token', function (done) {

        request(app)
            .post('/api/collaborators')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                var update = {
                    name: 'name update'
                }
                request(app)
                    .put('/api/collaborators/' + resp.data._id)
                    .send(update)
                    .expect(403)
                    .expect({
                        status: 403,
                        message: 'User is not authorized'
                    })
                    .end(done);
            });

    });

    it('should be collaborator delete not use token', function (done) {

        request(app)
            .post('/api/collaborators')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .delete('/api/collaborators/' + resp.data._id)
                    .expect(403)
                    .expect({
                        status: 403,
                        message: 'User is not authorized'
                    })
                    .end(done);
            });

    });

    afterEach(function (done) {
        Collaborator.remove().exec(done);
    });

});