module.exports = function(passport){
  var route = require('express').Router();
  var bkfd2Password = require("pbkdf2-password");
  var hasher = bkfd2Password();
  var db = require('../../config/orientdb/db')();
  route.get('/login', function(req, res){
    var sql = 'SELECT FROM topic';
    db.query(sql).then(function(_topics){
      res.render('auth/login', {topics:_topics});
    });
  });
  route.get('/register', function(req, res){
    var sql = 'SELECT FROM topic';
    db.query(sql).then(function(_topics){
      res.render('auth/register', {topics:_topics});
    });
  });
  route.get('/logout', function(req, res){
      req.logout();
      req.session.save(function(){
        res.redirect('/topic');
      });
  });
  route.get(
    '/facebook',
    passport.authenticate(
      'facebook'
    )
  );
  route.get(
    '/facebook/callback',
    passport.authenticate(
      'facebook',
      {
        successRedirect: '/topic',
        failureRedirect: '/auth/login'
      }
    )
  );
  var users =[
    {
      authId : 'local:chosm',
      username:'chosm',
      password:'NKujiefwfyP2Ey0FwO1M+BxMe+NCoig6EmJGgLf5wD2i4ZtZyMVssWAURcFg3nVgW/VIRiHwB5pitzPmN6soqWnAN4eLTl9dpSdhNT/dlmGqjBhovSiEcQUJ7B2fVVyxNAzoN89p6HO3U1pECAp4m0/iploJXRUdcZQ8IHkuJi8=',
      salt:'RlB1Fgarez9PLNHcb/+8Y0QKKWBUEMVZrIDVp9v6Nw9VdGCcP6q9xD62/g/YlfTy8+RYMpR71tyMw4N/arINjQ==',
      displayName:'Sungmin Cho'
    }
  ];
  route.post('/register', function(req, res){
    hasher({password:req.body.password}, function(err, pass, salt, hash){
      var user = {
        authId:'local:'+req.body.username,
        username:req.body.username,
        password:hash,
        salt:salt,
        displayName:req.body.displayName
      };
      var sql = 'INSERT INTO user (authId, username, password, salt, displayName) VALUES(:authId, :username, :password, :salt, :displayName)';
      db.query(sql,{
        params:user
      }).then(function(results){
        console.log('sueccess regist');
        req.login(user, function(err){
         req.session.save(function(){
            res.redirect('/topic');
          });
        });
      }, function(error){
        console.log(error);
        res.status(500);
      });
    });
  })
  route.post(
    '/login',
    passport.authenticate(
      'local',
      {
        successRedirect: '/topic',
        failureRedirect:'/auth/login',
        failureFlash: false
      }
    )
  );
  return route;
}
