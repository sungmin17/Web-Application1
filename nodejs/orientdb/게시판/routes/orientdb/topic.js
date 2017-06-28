module.exports = function(){
  var route = require('express').Router();
  var db = require('../../config/orientdb/db')();
  route.get('/:id/edit', function(req, res){
    var sql = 'SELECT FROM topic';
    db.query(sql).then(function(_topics){
      var sql = 'SELECT FROM topic WHERE @rid=:rid';
      var id = req.params.id;
      db.query(sql, {params:{rid:id}}).then(function(topic){
        res.render('topic/edit', {topics:_topics, topic:topic[0], user:req.user});
      });
    });
  });
  route.get('/:id/delete', function(req, res){
    var sql = 'SELECT FROM topic';
    db.query(sql).then(function(_topics){
      var sql = 'SELECT FROM topic WHERE @rid=:rid';
      var id = req.params.id;
      db.query(sql, {params:{rid:id}}).then(function(topic){
        res.render('topic/delete', {topics:_topics, topic:topic[0], user:req.user});
      });
    });
  });
  route.post('/:id/edit', function(req, res){
    var sql = 'UPDATE topic SET title=:title, description=:desc, author=:author WHERE @rid=:rid';
    var id = req.params.id;
    var title = req.body.title;
    var desc = req.body.description;
    var author = req.body.author;
    db.query(sql, {
      params:{
        rid:id,
        title:title,
        desc:desc,
        author:author
      }
    }).then(function(topics){
      res.redirect('/topic/'+encodeURIComponent(id));
    });
  });
  route.post('/:id/delete', function(req, res){
    var sql = 'DELETE FROM topic WHERE @rid=:rid';
    var id = req.params.id;
    db.query(sql, {
      params:{
        rid:id
      }
    }).then(function(topics){
      res.redirect('/topic');
    });
  });
  route.get(['', '/:id'], function(req, res){
    var sql = 'SELECT FROM topic';
    db.query(sql).then(function(_topics){
      var sql = 'SELECT FROM topic WHERE @rid=:rid';
      var id = req.params.id;
      if(id){
        if(id === 'add'){
          res.render('topic/add', {topics:_topics, user:req.user});
        }else{
          db.query(sql, {params:{rid:id}}).then(function(topic){
            res.render('topic/view', {topics:_topics, topic:topic[0], user:req.user});
          });
        }
      }else{
        res.render('topic/view', {topics:_topics, user:req.user});
      }
    });
  });
  route.post('/add', function(req, res){
    var title = req.body.title;
    var description = req.body.description;
    var author = req.body.author;
    var sql = 'INSERT INTO topic (title, description, author) VALUES(:title, :desc, :author)'
    db.query(sql, {
      params:{
        title:title,
        desc:description,
        author:author
      }
    }).then(function(results){
      res.redirect('/topic/'+encodeURIComponent(results[0]['@rid']));
    });
  });
  return route;
}
