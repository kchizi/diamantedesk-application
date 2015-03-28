define(['app'], function(App){

  return App.module('Ticket.View.Comment.Create', function(Create, App, Backbone, Marionette, $, _){

    Create.Controller = function(options){
      require([
        'Comment/models/comment',
        'Comment/models/attachment',
        'Comment/views/form'], function(CommentModels, AttachmentModels, Form){

        var commentModel = new CommentModels.Model({},{ ticket : options.ticket }),
            commentCollection = options.collection,
            attachmentCollection = new AttachmentModels.Collection(),
            formView = new Form.LayoutView({ model: commentModel, attachmentCollection: attachmentCollection }),
            onSuccess = function(model){
              options.parentView.hideLoader();
              commentCollection.add(model);
              App.trigger('message:show', {
                status:'success',
                text: 'Comment was posted successfully'
              });
              Create.Controller(options);
            };

        formView.on('form:submit', function(data){
          options.parentView.showLoader();
          App.request('user:model:current').done(function(user){
            commentModel.set({
              'author': 'diamante_' + user.get('id'),
              'authorName' : user.get('first_name') + ' ' + user.get('last_name'),
              'authorEmail' : user.get('email')
            }, { 'silent': true });
            commentModel.save(data, {
              success : function(model){
                if(attachmentCollection.length){
                  attachmentCollection.save({
                    comment : commentModel,
                    success : function(data){
                      model.set('attachments', data);
                      onSuccess(model);
                    }
                  });
                } else {
                  onSuccess(model);
                }
              },
              error : function(model, xhr){
                options.parentView.hideLoader();
                App.alert({
                  title: "Create Comment Error",
                  xhr : xhr
                });
              }
            });
            if(!commentModel.isValid()){
              options.parentView.hideLoader();
            }
          });
        });
        formView.on('attachment:add', function(data){
          attachmentCollection.add(data);
        });
        formView.on('attachment:delete', function(model){
          attachmentCollection.remove(model);
        });

        options.parentView.formRegion.show(formView);

      });
    };

  });

});