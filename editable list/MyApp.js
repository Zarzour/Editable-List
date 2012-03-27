Ext.Loader.setConfig({enabled:true});
Ext.application({
    name: 'MyApp',
	views:['Main'],
	controllers:['MyController'],
	stores:['MyStore'],
	models:['MyModel'],
	

    launch: function() {
		var mainPanel = Ext.create('MyApp.view.Main');
		Ext.Viewport.add(mainPanel);
        
    }

});