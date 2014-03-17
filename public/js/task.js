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
            //'drop' : 'drop'
            'click .portlet-toggle': "togglePortlet"
        },
        togglePortlet: function(event,index){
            console.log('in togglePortlet')
/*            var icon = $(this);
            icon.toggleClass( "ui-icon-minusthick ui-icon-plusthick" );
            icon.closest( ".portlet" ).find( ".portlet-content" ).toggle();*/
        },
        /*drop: function(event, index) {
            this.$el.trigger('update-sort', [this.model, index]);
        },*/

        render: function () {

            var card = $(this.template(this.model.toJSON()));
            card.addClass( "ui-widget ui-widget-content ui-helper-clearfix ui-corner-all" )
                .find( ".portlet-header" )
                .addClass( "ui-widget-header ui-corner-all" )
                .prepend( "<span class='ui-icon ui-icon-minusthick portlet-toggle'></span>");

            //$(this.el).append(card);
            this.$el.html(card);

            return this;
        }
    });

    var TaskList = Backbone.View.extend({
        el: $('#task-list'),
//        el: $('#srumboard'),
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
            $('#todo').append(taskView.render().el);
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

    //$( "#sortable1, #sortable2, #sortable3" ).disableSelection();

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
