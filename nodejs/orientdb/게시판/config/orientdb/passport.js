module.exports = function(app){
  var passport = require('passport');
  var LocalStrategy = require('passport-local').Strategy;
  var FacebookStrategy = require('passport-facebook').Strategy;
  var bkfd2Password = require("pbkdf2-password");
  var hasher = bkfd2Password();
  var db = require('./db')();
  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser(function(user, done){
    console.log('serializeUser', user);
    done(null, user.authId);
  });
  passport.deserializeUser(function(id, done){
    console.log('deserializeUser', id);
    var sql = "SELECT displayName FROM user WHERE authId=:authId";
    db.query(sql, {params:{authId:id}}).then(function(res){
      if(res.length === 0){
        done('There is no user.');
      }else{
        done(null, res[0]);
      }
    });
  });
  passport.use(new LocalStrategy(
    function(username, password, done){
      var uname = username;
      var pwd = password;
      var sql = 'SELECT * FROM user WHERE authId=:authId';
      db.query(sql, {params:{authId:'local:'+uname}}).then(function(res){
        if(res.length === 0){
          return done(null, false);
        }
        var user = res[0];
        return hasher({password:pwd, salt:user.salt}, function(err, pass, salt, hash){
          if(hash === user.password){
            console.log('LocalStrategy', user);
            done(null, user);
          }else{
            done(null, false);
          }
        });
      })
    }
  ));
  passport.use(new FacebookStrategy({
      clientID: '137724430124785',
      clientSecret: 'b6959aaf014579340cdd6a8d21de3249',
      callbackURL: "/auth/facebook/callback",
      profileFields:['id', 'email', 'gender', 'link', 'locale', 'name', 'displayName']
    },
    function(accessToken, refreshToken, profile, done) {
      console.log(profile);
      var authId = 'facebook:'+profile.id;
      var sql = 'SELECT FROM user WHERE authId=:authId';
      db.query(sql, {params:{authId:authId}}).then(function(res){
        if(res.length === 0){
          var newUser = {
            'authId':authId,
            'displayName':profile.displayName
          };
          var sql = 'INSERT INTO user (authId, displayName) VALUES (:authId, :displayName)';
          db.query(sql, {params:newUser}).then(function(){
            done(null, newUser);
          }, function(err){
            console.log(err);
            done('Error');
          });
        }else{
          return done(null, res[0]);
        }
      });
    }
  ));

  return passport;
}
