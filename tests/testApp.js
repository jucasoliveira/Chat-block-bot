let request = require('supertest');
describe('loading express', function () {
    let app, server, csrf;
    beforeEach(function () {
        app = require('../app');
        server = app.listen(3000);
    });
    afterEach(function (done) {
        server.close(done);
        setTimeout(done, 1000);
    });
    it('responds to /', function testSlash(done) {
        request(server)
            .get('/')
            .expect(200, done);
    });
    it('404 everything else', function testPath(done) {
        request(server)
            .get('/foo/bar')
            .expect(404, done);
    });
    it('access to /login', function testPath(done) {
        request(server)
            .get('/login')
            .expect(200)
            .end(function(e, res){
                //console.log(res)
                done();
            });
    });
    it('aceess to /user/dashboard', function testPath(done) {
        request(server)
            .get('/user/dashboard')
            .expect(404)
            .end(function(e, res){
                done();
            });
    });
});