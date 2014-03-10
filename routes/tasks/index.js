
var controller = require('../../controllers/tasks_controller');

module.exports = function(app) {

  app.get('/tasks', function(req, res) {
      controller.index(app, req, res);
    }
  );

  app.get('/tasks/:id', function(req,res) {
    controller.show(app, req, res);
  });

  app.put('/tasks/:id', function(req,res) {
    controller.update(app, req, res);
  });

  app.post('/tasks', function(req,res) {
    controller.create(app, req, res);
  });

  app.delete('/tasks/:id', function(req,res) {
    controller.remove(app, req, res)
  })
}