Ext.define('MyApp.store.MyStore', {
	extend:'Ext.data.Store',
	config:{
		storeId:'myStore',
		model:'MyApp.model.MyModel',
		autoLoad:true,
		proxy:{
			type:'ajax',
			url:'app/resources/json/dataSource.json',
			reader:{
				type:'json',
				rootProperty:'root'
			}
		}
	}
});