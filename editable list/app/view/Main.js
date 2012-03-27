Ext.define('MyApp.view.Main',{
	extend:'Ext.List',
	xtype:'main',
	
	deleteIcons: Ext.create('Ext.CompositeElement'),
	
	sortIcons: Ext.create('Ext.CompositeElement'),
	
	deleteButtons: Ext.create('Ext.CompositeElement'),
	
	tappedEl:null,
	
	config:{
		cls:'x-editable-list',
		itemTpl:'{firstName} {lastName}',
		store:Ext.create('MyApp.store.MyStore'),
		id:'myList',
		listeners:{
			refresh: function(){
				this.deleteIcons.fill(Ext.query('.x-list-left-icon'));
				this.deleteButtons.fill(Ext.query('.x-button-delete'));
				console.log('I am painted');

				
			},
			itemtap: 'onItemTap'
		},
		items:[
		{
			title:'Users',
			xtype:'toolbar',
			docked:'top',
			items:[{
				xtype:'button',
				docked:'left',
				text:'Edit',
				ui:'dark',
				id:'editButton'
			}]
		}],
		
		 editTpl : ['<div class="x-list-left-icon x-icon-delete x-list-left-hidden-icon"></div>',
				  '<div class="x-list-content">{tpl}</div>',
				  '<div class="x-button x-button-{deleteButtonUI} x-button-hidden" >',
					 '<span class="x-button-label">{deleteButtonText}</span>',
				  '</div>',
				  '<tpl if="allowSort">',
					 '<div class="x-icon-sort"></div>',
				  '</tpl>'].join(''),
		
		/*instance variables*/

		
		deleteAnimationCls: 'x-list-item-deleted',

		editItemCls: '',
			
		deleteButtonUI: 'delete',

		deleteButtonText: 'Delete',
			
		allowSort: false,

		editing: false,

		deleting: false,

		deleteSectionCount: 0,
			
	},
	
	initialize:function(){

		this.callParent();	
		
			var me 		  		= this,
				itemtpl 		= me.getItemTpl(),
			   	editTpl   	  	= me.getEditTpl();
			//Overriding the itemTpl appling the params
			var params = {
						  tpl:itemtpl.html,
						  deleteButtonUI:me.getDeleteButtonUI(),
						  deleteButtonText:me.getDeleteButtonText()
						};
			editTpl = editTpl.apply(params);

			var editTpl = '<tpl for="."><div class="x-list-item x-animated"><div class="x-list-item-body">' + editTpl + '</div></div></tpl>';
			editTpl = new Ext.XTemplate(editTpl);
			this.setItemTpl(editTpl);
			
	//	this.setItemTplWhenEditing(editTpl);
	//	this.init();
			
	},
	edit:function(){
		console.log('editing');
		var editingState = this.getEditing(); 
		if(!editingState){
			editingState = true;
			this.setEditing(editingState);	
		}
		//console.log('editing: '+this.getEditing());
		this.setNeedsDisplay(editingState);

	},
	editCompleted:function(){
		var editingState = this.getEditing();
		if(editingState){
			editingState = false;
			this.setEditing(editingState);
			this.setNeedsDisplay(editingState);
		}
	},

	onItemTap: function(list, target, index, e, record ){
		var editingState = this.getEditing();
		if(editingState){
			var onDeleteIcon = 'x-list-left-icon x-icon-delete x-left-icon-slide-in',
			    onDeleteButton = 'x-button-label',
					className = e.target.className,
					el = target.down('.x-list-left-icon');
					
					var listItem ,deleteBtn, record;
					this.exitDeleteMode();
					switch(className){
						case 'x-list-left-icon x-icon-delete':
						
						listItem= target;
						deleteBtn = listItem.down('.x-button-delete');
						el.addCls('x-icon-rotate-start');
						deleteBtn.addCls('x-button-slide-in');
						deleteBtn.on('animationend',function(event){
							deleteBtn.removeCls('x-button-hidden');
							deleteBtn.removeCls('x-button-slide-in');
						});
						
						this.tappedEl = listItem;
						this.setDeleting(true);
						break;
					//	case 'x-button x-button-delete':
						case 'x-button-label':
						record = this.getStore().getAt(index);
						this.deleteItem(index,this.tappedEl);
						
						break;
			}
		}
	},
	exitDeleteMode: function(){
		var isDeleting = this.getDeleting();
		if(isDeleting){
			var listItem = this.tappedEl;
			var deleteIcon = listItem.down('.x-icon-delete');
			
			deleteBtn = listItem.down('.x-button');
			
			deleteIcon.removeCls('x-icon-rotate-start');
			
			deleteIcon.addCls('x-icon-rotate-end');
			
			deleteIcon.on('animationend',function(){
				deleteIcon.removeCls('x-icon-rotate-end');
			});
			deleteBtn.addCls('x-button-slide-out');
			deleteBtn.on('animationend',function(){
				deleteBtn.removeCls('x-button-slide-out');
				deleteBtn.addCls('x-button-hidden');	
			});
			this.setDeleting(false);
		}
	},
	deleteItem: function(index, el){

			el.addCls('x-list-item-deleted');
			var store = this.getStore();

		//el.addCls('x-list-item-deleted');
		el.on('animationend',function(event){
			if(event.browserEvent.animationName == 'x-list-item-deleted-animation'){
				el.removeCls('x-list-item-deleted');
				store.removeAt(index);
			}
		});
		
	},
	applyEditTpl: function(config) {
        return (Ext.isObject(config) && config.isTemplate) ? config : new Ext.XTemplate(config);
    },
	setNeedsDisplay: function(editState){
		this.refresh();
	
		if(editState){
			this.element.addCls('x-list-editing');	
		}else{
			this.element.removeCls('x-list-editing');
		}
		this.setIconCls(this.deleteIcons, 'left', editState)
		
	},
	setIconCls:function(icons,pos,edit){
		var direction = (edit? 'in' : 'out');
		
		var animationCls = Ext.util.Format.format('x-{0}-icon-slide-{1}',pos, direction);
		
		var iconHiddenCls = Ext.util.Format.format('x-list-{0}-hidden-icon', pos);
		
		icons.addCls(animationCls);
		
		Ext.each(icons, function(icon){
			icon.on('animationend', function(event){
				if(edit){
					icon.removeCls(iconHiddenCls);
					
				}else{
					icon.addCls(animationCls);
				}
				icon.removeCls(animationCls);
				
			});
		});
	}
		
});