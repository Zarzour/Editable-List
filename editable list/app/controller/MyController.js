Ext.define('MyApp.controller.MyController', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
			usersList:    'main',
            btnEdit:      '#editButton'
        },
		control:{
			btnEdit:{
				tap:'buttonTapped'	
			}
		}
    },

		
	buttonTapped: function( btn, event){
		console.log('edit button is tapped');
		var list = this.getUsersList();
		
		if(btn.getText()=='Edit'){
			btn.setText('Done');
			list.edit();	
		
			}else{
			list.editCompleted();
			btn.setText('Edit');
		}
		
	}
});