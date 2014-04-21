// Export all modules
module.exports = function(app) {

  app.models = {}
  app.models.task = require('./task.js');

};
