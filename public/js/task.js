/**
 * Created by rest on 12.03.14.
 */


$(function () {


// Model

    var Task = Backbone.Model.extend({
        defaults: {
            title: '',
            description: '',
            state: 'Todo'
        }
    });

    var TasksCollection = Backbone.Collection.extend({
        model: Task,
        url: '/tasks'
    });

    var tasks = new TasksCollection();

    var TaskView = Backbone.View.extend({

//        tagName: 'li',
//        className: 'ui-state-default',
        //tagName: 'div',
      //  el:$('#todo'),

        template: _.template($('#item-template').html()),

        initialize: function() {
            this.listenTo(this.model, 'change', this.render);
        },

        events: {
            'update' : 'updateTask',
            'click .portlet-delete': "deleteTask"
        },
        updateTask: function(event, index) {
            /*console.log('in drop function');
            console.log(this.$el);
            console.log(this.model, index);*/
            var parentcolumn = this.$el.closest('.column').attr('id');
//            console.log(parentcolumn);
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
            this.model.destroy();
            console.log(this)
            $(this.el).remove();

        },

        render: function () {

            var card = $(this.template(this.model.toJSON()));
            card.addClass( "ui-widget ui-widget-content ui-helper-clearfix ui-corner-all" )
                .find( ".portlet-header" )
                .addClass( "ui-widget-header ui-corner-all" )
                .prepend( "<span class='ui-icon ui-icon-trash portlet-delete'></span>");


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
            this.input = $('#new-task-title');

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
            if(!this.input.val()){
                this.input.effect('highlight');
                return;
            }

            tasks.create({ title: this.input.val(), description:$('#new-task-description').val(),state: $('#new-task-state').val() });
            this.input.val('');
            $('#new-task-description').val('');
            $('#new-task-state').val('Todo');
        }/*,
        deleteItem: function(e){
            console.log('in deleteItem');
            console.log(tasks);
            tasks.remove(this);
            console.log(tasks);
            //this.remove();

        }*/
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
            ui.item.trigger('update',ui.item.index());
        }
    });

//    $( ".portlet" )
//        .addClass( "ui-widget ui-widget-content ui-helper-clearfix ui-corner-all" )
//        .find( ".portlet-header" )
//        .addClass( "ui-widget-header ui-corner-all" )
//        .prepend( "<span class='ui-icon ui-icon-minusthick portlet-toggle'></span>");

/*    $( ".portlet-toggle" ).click(function() {
        var icon = $( this );
        icon.toggleClass( "ui-icon-minusthick ui-icon-plusthick" );
        icon.closest( ".portlet" ).find( ".portlet-content" ).toggle();
    });*/


});
