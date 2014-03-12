/**
 * Created by rest on 12.03.14.
 */


$(function () {


// Model

    var Task = Backbone.Model.extend({
        defaults: {
            title: '',
            description: '',
            status: 'Todo'
        }

    });

    var TasksCollection = Backbone.Collection.extend({
        model: Task,
        url: '/tasks'
    });

    var tasks = new TasksCollection();

    var TaskView = Backbone.View.extend({

        //tagName: 'li',

        template: _.template($('#item-template').html()),

        initialize: function() {
            this.listenTo(this.model, 'change', this.render);
        },

        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });

    var TaskList = Backbone.View.extend({
        el: $('#task-list'),

        render: function () {
            console.log('called render');
        },

        events: {
            'click #add-item': 'createItem',
            'keypress #new-task': 'createItemOnEnter'
        },

        initialize: function () {
            this.delegateEvents(this.events);
            this.input = $('#new-task');

            this.listenTo(tasks, 'add', this.addItem);
            this.listenTo(tasks, 'reset', this.addAll);
            this.listenTo(tasks, 'all', this.render);

            tasks.fetch({reset: true});
        },

        addItem: function (item) {
            var taskView = new TaskView({ model: item });
            this.$el.append(taskView.render().el);
        },

        addAll: function() {
            tasks.each(this.addItem, this);
        },

        createItemOnEnter: function(e) {
            if (e.keyCode != 13) return;
            this.createItem();
        },
        createItem: function() {
            if(!this.input.val()) return;
            tasks.create({ title: this.input.val() });
            this.input.val('');
        }
    });

    var taskList = new TaskList;


    // Jquery UI Sortable Lists
    $( "ul.droptrue" ).sortable({
        connectWith: "ul"
    });

    $( "ul.dropfalse" ).sortable({
        connectWith: "ul",
        dropOnEmpty: false
    });

    $( "#sortable1, #sortable2, #sortable3" ).disableSelection();

/*    $( "#sortable1, #sortable2" ).sortable({
        connectWith: ".connectedSortable"
    }).disableSelection();*/


    // Jquery UI Sortable Portlet
    $( ".column" ).sortable({
        connectWith: ".column",
        handle: ".portlet-header",
        cancel: ".portlet-toggle",
        placeholder: "portlet-placeholder ui-corner-all"
    });

    $( ".portlet" )
        .addClass( "ui-widget ui-widget-content ui-helper-clearfix ui-corner-all" )
        .find( ".portlet-header" )
        .addClass( "ui-widget-header ui-corner-all" )
        .prepend( "<span class='ui-icon ui-icon-minusthick portlet-toggle'></span>");

    $( ".portlet-toggle" ).click(function() {
        var icon = $( this );
        icon.toggleClass( "ui-icon-minusthick ui-icon-plusthick" );
        icon.closest( ".portlet" ).find( ".portlet-content" ).toggle();
    });

});
