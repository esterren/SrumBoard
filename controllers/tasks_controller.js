// Export the Task Controller functions

// List all Tasks
exports.index = function(app, req, res) {
  var tasks = app.models.task.getAllEntries();
  res.json( tasks );
};

// show the task with the given id
exports.show = function(app, req, res) {
  var task = app.models.task.find(req.params.id);
  res.json( task );
};

// Create a new task
exports.create = function(app, req, res) {
  console.log('Creating new task');
  var task = app.models.task.create(req.body);
  res.json( task );
};

// Update a task
exports.update = function(app, req, res) {
  var task = app.models.task.update(req.body);
  res.json( task );
};

// delete a task
exports.remove = function(app, req, res) {
  var task = app.models.task.remove(req.params.id);
  res.json( task );
};