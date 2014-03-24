/**
 * Created by rest on 12.03.14.
 */


$(function () {

// Model

    var Task = Backbone.Model.extend({
        defaults: {
            title: '',
            description: '',
            assignedto:'',
            cost:'1',
            state: 'Todo'
        }
    });

    var TasksCollection = Backbone.Collection.extend({
        model: Task,
        url: '/tasks'
    });

    var tasks = new TasksCollection();

    var TaskView = Backbone.View.extend({


        template: _.template($('#item-template').html()),

        initialize: function() {
            this.listenTo(this.model, 'change', this.render);
        },

        events: {
            'sortupdate' : 'updateState',
            'click .portlet-delete': "deleteTask",
            'click .portlet-edit': "editTask"
        },
        updateState: function(event, index) {

            var parentcolumn = this.$el.closest('.column').attr('id');

            if (parentcolumn =="todo" && this.model.get('state')!=='Todo'){
                this.model.save('state', 'Todo');
            }else if (parentcolumn =='inprogress' && this.model.get('state')!=='In Progress'){
                this.model.save('state', 'In Progress');
            }else if (parentcolumn =='done' && this.model.get('state')!=='Done'){
                this.model.save('state', 'Done');
            }
            //this.$el.trigger('update-task', [this.model, index]);
        },
        deleteTask: function(event,index){
            var thatmodel = this.model;
            var thatel = this.el;
            var callback = function(value){
                // if Yes
                if(value){
                    thatmodel.destroy();
                    $(thatel).remove();
                }
            };
            //Open the Confirmdialog
            fnOpenConfirmDialog('Delete Task','Do you really want to delete this task?', callback);


        },
    editTask: function(event,index){
        console.log('in editTask');
        var thatmodel = this.model;

        var thatel = this.el;
        var callback = function(task,value){
            if(value){
                console.log('task edited');
                // if Edit
                //thatmodel.save(data);
                thatmodel.save(task);
                $(thatel).detach();
//                $(thatel).remove();
//                var state = thatmodel.get('state');

                if (task.state =="Todo"){
                    $('#todo').append(thatel);
                }else if (task.state =='In Progress'){
                    $('#inprogress').append(thatel);

                }else if (task.state =='Done'){
                    $('#done').append(thatel);
                }

                }
            };

            fnOpenEditDialog(this.model,callback);


        },

        render: function () {

            var card = $(this.template(this.model.toJSON()));
            card.addClass( "ui-widget ui-widget-content ui-helper-clearfix ui-corner-all" )
                .find( ".portlet-header" )
                .addClass( "ui-widget-header ui-corner-all" )
                .prepend( "<span class='ui-icon ui-icon-pencil portlet-edit'></span><span class='ui-icon ui-icon-trash portlet-delete'></span>");


            this.$el.html(card);

            return this;
        }
    });

    var TaskList = Backbone.View.extend({
        el: $('#task-list'),
//        el: $('#srumboard'),
        render: function () {
//            console.log('called render');
        },

        events: {
            'click #add-item': 'createItem',
            'keypress #new-task': 'createItemOnEnter'/*,
            //'update-task': 'updateTask'
            'click .portlet-toggle': 'deleteItem'*/
        },

        initialize: function () {
            this.delegateEvents(this.events);
            this.title = $('#new-task-title'),
            this.description = $('#new-task-description'),
            this.state = $('#new-task-state'),
            this.cost = $('#new-task-cost'),
            this.assignedto = $('#new-task-assignto');

            this.listenTo(tasks, 'add', this.addItem);
            this.listenTo(tasks, 'reset', this.addAll);
            this.listenTo(tasks, 'all', this.render);
            //this.listenTo(tasks, 'destroy', this.deleteItem);
            tasks.fetch({reset: true});
        },

        addItem: function (item) {
            var taskView = new TaskView({ model: item });
            var state = item.get('state');
//            console.log(state);
            if (state =="Todo"){
                $('#todo').append(taskView.render().el);
            }else if (state =='In Progress'){
                $('#inprogress').append(taskView.render().el);

            }else if (state =='Done'){
                $('#done').append(taskView.render().el);
            }
        },

        addAll: function() {
            tasks.each(this.addItem, this);
        },

        createItemOnEnter: function(e) {
            if (e.keyCode != 13) return;
            this.createItem();
        },
        createItem: function() {
            if(!this.title.val()){
                this.title.effect('highlight');
                return;
            }
            tasks.create({ title: this.title.val(), description:this.description.val(),state: this.state.val(), cost:this.cost.val(), assignedto: this.assignedto.val() });
            this.title.val('');
            this.description.val('');
            this.state.val('Todo');
            this.assignedto.val('');
            this.cost.val('1');
        }
    });

    var taskList = new TaskList;

    //$( "#sortable1, #sortable2, #sortable3" ).disableSelection();

/*    $( "#sortable1, #sortable2" ).sortable({
        connectWith: ".connectedSortable"
    }).disableSelection();*/


    // Jquery UI Sortable Portlet
    $( ".column" ).sortable({
        connectWith: ".column",
        handle: ".portlet-header",
        cancel: ".portlet-delete",
        placeholder: "portlet-placeholder ui-corner-all",
        stop : function(event, ui){
//            console.log(event, ui)
            ui.item.trigger('sortupdate',ui.item.index());
        }
    });

});




//    $("#dialog-confirm").html(htmlString);

// Define the Dialog and its properties.

function fnOpenConfirmDialog(title, htmlString, callback) {


    $("#dialog-confirm").html(htmlString);
    // Define the Dialog and its properties.
    $("#dialog-confirm").dialog({
        resizable: false,
        modal: true,
        draggable:false,
        title: title,
        height: 250,
        width: 400,
        buttons: {
            "Yes": function () {
                $(this).dialog('close');
                callback(true);
            },
            "No": function () {
                $(this).dialog('close');
                callback(false);
            }

        }
    });
}

function fnOpenEditDialog(model, callback) {
    var title = model.get('title'),
        state = model.get('state'),
        description = model.get('description'),
        assignedto = model.get('assignedto'),
        cost = model.get('cost');

    var htmlString = ' \
        <form> \
            <fieldset> \
                <p><label for="title">Title:</label> \
                <input type="text" name="title" id="title" class="text ui-widget-content ui-corner-all"><\p>\
                <p><label for="state">State:</label> \
                <select id="state" > \
                    <option value="Todo">Todo</option> \
                    <option value="In Progress">In Progress</option> \
                    <option value="Done">Done</option> \
                </select><\p> \
                <p><label for="csot">Cost:</label> \
                <select id="cost"> \
                    <option value="1">1</option> \
                    <option value="2">2</option> \
                    <option value="3">3</option> \
                    <option value="5">5</option> \
                    <option value="8">8</option> \
                </select><\p> \
                <p><label for="assigendto">Assigend to:</label> \
                <input type="text" name="assignedto" id="assignedto" class="text ui-widget-content ui-corner-all"><\p> \
                <p><label for="description">Description:</label>\
                <textarea name="description" id="description" rows="3" cols="40" maxlength="100" class="text ui-widget-content ui-corner-all"></textarea><\p> \
            </fieldset> \
            </form>';

    $("#dialog-edit").html(htmlString);
    $("#title").val(title);
    $("#assignedto").val(assignedto);
    $("#state option[value='"+state+"']").attr('selected',true);
    $("#cost option[value='"+cost+"']").attr('selected',true);
    $("#description").val(description);

    $("#dialog-edit").dialog({
//        autoOpen: false,
        resizable: false,
        modal: true,
        draggable:false,
        title: 'Edit Task',
        height: 500,
        width: 500,
        buttons: {
            "Edit": function () {
                var task = { title:  $("#title").val(),
                    description: $('#description').val(),
                    assignedto: $('#assignedto').val(),
                    cost: $('#cost').val(),
                    state: $('#state').val()};

                    console.log(task);
                    $(this).dialog('close');

                    callback(task,true);
            },
            "Cancel": function () {
                $(this).dialog('close');
//                callback(false);
            }

        }
    });

}