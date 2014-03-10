


exports.index = function(app, req, res) {
  var tasks = app.models.task.getAllEntries();
  res.json( tasks );
};

exports.show = function(app, req, res) {
  var task = app.models.task.find(req.params.id);
  res.json( task );
};

exports.create = function(app, req, res) {
  console.log('Creating new task');
  var task = app.models.task.create(req.body);
  res.json( task );
};

exports.update = function(app, req, res) {
  var task = app.models.task.update(req.body);
  res.json( task );
};

exports.remove = function(app, req, res) {
  var task = app.models.task.remove(req.params.id);
  res.json( task );
};