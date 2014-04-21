
var controller = require('../../controllers/tasks_controller');

module.exports = function(app) {

// List all Tasks
  app.get('/tasks', function(req, res) {
      controller.index(app, req, res);
    }
  );

// List the task with the requested id
  app.get('/tasks/:id', function(req,res) {
    controller.show(app, req, res);
  });

// Update the task with the requested id
  app.put('/tasks/:id', function(req,res) {
    controller.update(app, req, res);
  });

// Create a new Task
  app.post('/tasks', function(req,res) {
    controller.create(app, req, res);
  });

// Delete the task with the requested id
  app.delete('/tasks/:id', function(req,res) {
    controller.remove(app, req, res)
  })
}