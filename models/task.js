// A blog post model


var Task = {
  tasks: [
    {
      id: '1',
      title: 'ScrumBoard entwickeln',
      description: 'Eine Scrum Board Applikation in NodeJS entwickeln!',
      status: 'Todo'
    },
    {
      id: '2',
      title: 'Jasmin Tests schreiben',
      description: 'Jasmin Tests für das ScrumBoard schreiben',
      status: 'In Progress'
    }
  ],
  last_id: 1,

  getNextId: function () {
    this.last_id += 1;
    return this.last_id;
  },

  clone: function (data) {
    // JavaScript doesn't have a real clone function
    // This is good enough for simple, data-only objects
    return JSON.parse(JSON.stringify(data));
  },

  // merges object with the attributes passed into this function
  //
  merge: function(object, attr) {
    for (var attrname in attr) {
      object[attrname] = attr[attrname];
    }
    return object;
  },

  add: function (data) {
    // poor mans 'dup' (ruby), otherwise we will be modifying the original object
    console.log('creating task with ' + data);
    var data = this.clone(data);
    var id = this.getNextId();
    data.id = id;
    this.tasks.push(data);
    return data;
  },

  update: function(data) {
    console.log('updating with ' + data);
    for (var i = 0; i < this.taks.length; i++) {
      if (this.tasks[i].id == data['id']) {
        Task.merge(this.tasks[i], data);
        return this.tasks[i];
      }
    }
    return void 0;
  },

  find: function (id) {
    for (var i = 0; i < this.tasks.length; i++) {
      if (this.tasks[i].id == id) {
        return this.tasks[i];
      }
    }
    return void 0;
  },

  remove: function (id) {
    for (var i = 0; i < this.tasks.length; i++) {
      if (this.tasks[i].id == id) {
        var task = this.tasks[i];
        this.tasks.splice(i, 1);
        return task; // remove element and return it
      }

    }
    return void 0;
  },

  all: function () {
    return this.tasks;
  },

  clearAllEntries: function () {
    this.tasks = [];
    this.last_id = 0;
  }
};


exports.getAllEntries = function () {
  return Task.all();
};

exports.clearAllEntries = function () {
  return Task.clearAllEntries();
};



exports.create = function (data) {
  return Task.add(data);

};


exports.update = function (data) {
  return Task.update(data);
};



exports.find = function (id) {
  return Task.find(id);
};

exports.remove = function (id) {
  return Task.remove(id);
}


