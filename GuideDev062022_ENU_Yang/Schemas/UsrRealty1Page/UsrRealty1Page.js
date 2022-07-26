define("UsrRealty1Page", ["RightUtilities","ServiceHelper"], function(RightUtilities,ServiceHelper) {
	return {
		entitySchemaName: "UsrRealty",
		attributes: {
			"HasAccessToManager": {
				"dataValueType": Terrasoft.DataValueType.BOOLEAN,
				"type": Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN,
				"value": false
			},
			"CommissionUSD": {
				"dataValueType": Terrasoft.DataValueType.FLOAT,
				"type": Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN,
				"value": 0.00,
				dependencies: [
                    {
                        /* The [Commission] column value depends on the [Price, USD] and [Offer type] column values. */
                        columns: ["UsrPriceUSD", "UsrOfferType"],
                        /* The handler method that is called when the [Price, USD] or [Offer type] column value changes. */
                        methodName: "calculateCommission"
                    }
                ]
			},
			"UsrOfferType":{
				lookupListConfig: {
						columns: ["UsrCommissionCoeff"]
			    },
			},
			"UsrManager": {
				dataValueType: Terrasoft.DataValueType.LOOKUP,
				lookupListConfig: {
					filter: function() {
						const filter =  this.Terrasoft.createColumnFilterWithParameter(this.Terrasoft.ComparisonType.EQUAL,
							"[SysAdminUnit:Contact:Id].Active", true);
						return filter;
					}
				}				
			},
		},
		modules: /**SCHEMA_MODULES*/{}/**SCHEMA_MODULES*/,
		details: /**SCHEMA_DETAILS*/{
			"Files": {
				"schemaName": "FileDetailV2",
				"entitySchemaName": "UsrRealtyFile",
				"filter": {
					"masterColumn": "Id",
					"detailColumn": "UsrRealty"
				}
			},
			"UsrSchema5269bfd4Detaile6fe50f6": {
				"schemaName": "UsrRealtyVisitDetail",
				"entitySchemaName": "UsrRealtyVisit",
				"filter": {
					"detailColumn": "UsrParentRealty",
					"masterColumn": "Id"
				}
			}
		}/**SCHEMA_DETAILS*/,
		businessRules: /**SCHEMA_BUSINESS_RULES*/{
			"UsrComment": {
				"5f340cb2-474c-452f-8d3e-6de76bb90207": {
					"uId": "5f340cb2-474c-452f-8d3e-6de76bb90207",
					"enabled": true,
					"removed": false,
					"ruleType": 0,
					"property": 0,
					"logical": 0,
					"conditions": [
						{
							"comparisonType": 2,
							"leftExpression": {
								"type": 1,
								"attribute": "UsrOfferType"
							}
						}
					]
				},
				"4d4b2b2c-9aa9-495d-a852-917c4a7bf929": {
					"uId": "4d4b2b2c-9aa9-495d-a852-917c4a7bf929",
					"enabled": true,
					"removed": false,
					"ruleType": 0,
					"property": 2,
					"logical": 0,
					"conditions": [
						{
							"comparisonType": 5,
							"leftExpression": {
								"type": 0,
								"value": 100000,
								"dataValueType": 4
							},
							"rightExpression": {
								"type": 1,
								"attribute": "UsrPriceUSD"
							}
						}
					]
				}
			},
			"UsrManager": {
				"fdbd12d6-0768-4a01-a29c-1dbe8b5ccb16": {
					"uId": "fdbd12d6-0768-4a01-a29c-1dbe8b5ccb16",
					"enabled": true,
					"removed": false,
					"ruleType": 0,
					"property": 1,
					"logical": 0,
					"conditions": [
						{
							"comparisonType": 3,
							"leftExpression": {
								"type": 1,
								"attribute": "HasAccessToManager"
							},
							"rightExpression": {
								"type": 0,
								"value": true,
								"dataValueType": 12
							}
						}
					]
				}
			}
		}/**SCHEMA_BUSINESS_RULES*/,
		/** messages publisher */
		messages: {
			"MyMessageCode": {
				mode: Terrasoft.MessageMode.PTP,
				direction: Terrasoft.MessageDirectionType.PUBLISH
			},
		},
		/** messages **/
		methods: {
			init: function() {
				this.callParent(arguments);
				// Registering of messages
				this.sandbox.registerMessages(this.messages);
			},
			/** onEntityInitialized **/
			onEntityInitialized: function(){
				this.callParent(arguments);/* Parent: BaseEntityPage*/
				this.getOperationAccessData();
				this.calculateCommission();
			},
			/**Validation**/
			setValidationConfig: function() {
                /* Call the initialization of the parent view model's validators. */
                this.callParent(arguments);
                /* Add the dueDateValidator() validator method for the [DueDate] column. */
                this.addColumnValidator("UsrPriceUSD", this.positiveValueValidator);
                this.addColumnValidator("UsrAreaSqM", this.positiveValueValidator);				
            },
			positiveValueValidator: function(value, column){
				/* The variable that stores the validation error message. */
                var msg = "";
                if (value < 0) {
                    msg = this.get("Resources.Strings.ValueMustBeGreaterThanZero");
                }
                /* The object whose property contains the validation error message. If the validation is successful, returns an empty string. */
                return {
                    /* The validation error message. */
                    invalidMessage: msg
                };
			},
			/**Validation End**/
			/**about Operation permissions_CanChangeRealtyManager**/
			getOperationAccessData: function(){
				/*..\Terrasoft.WebApp\Terrasoft.Configuration\Autogenerated\Src\RightUtilities.NUI.js*/
				RightUtilities.checkCanExecuteOperation({
					operation: "CanChangeRealtyManager"
				}, this.onGetOperationResult, this);
			},
			onGetOperationResult:function(result){
				this.set("HasAccessToManager",result);
				this.console.log("HasAccessToManager = " + result);
			},
			// calculate commission action
			calculateCommission: function(){
				var price = this.get("UsrPriceUSD");
				if(!price){
					price = 0;
				}
				var offerTypeObject = this.get("UsrOfferType");
				var coeff = 0;
				if(offerTypeObject){
					coeff = offerTypeObject.UsrCommissionCoeff;
				}
				var result = price * coeff;
				this.set("CommissionUSD", result);
			},
			//about MyButton action
			onMyButtonClick: function() {
				this.showInformationDialog("My button was pressed!");
				this.console.log("Yes, it's true. Our button was pressed.");
				
				/*Assigning lookup column value*/
				var obj = {
					value: "3c4294fa-0c09-46bc-9ff3-1a865baf53f4",
					displayValue: "3. Parking Lot"
				};
				this.set("UsrType", obj);
				
				/**sandbox publish result*/
				this.console.log("Message published.");
				var result = this.sandbox.publish("MyMessageCode", null, []);
				this.console.log("Subscriber responded: " + result);

			},
			getMyButtonEnabled: function() {
				var result = true;
				var name = this.get("UsrName");
				if(!name){
					return false;
				}
				return result;
			},
			//RunWebServiceButton
			runWebServiceButtonClick: function(){
				//
				var typeObject = this.get("UsrType");
				if (!typeObject) {
					return;
				}
				var typeId = typeObject.value;

				var offerTypeObject = this.get("UsrOfferType");
				if (!offerTypeObject) {
					return;
				}
				var offerTypeId = offerTypeObject.value;

				var serviceData = {
					realtyTypeId: typeId,
					realtyOfferTypeId: offerTypeId
				};                      
				this.console.log("1");
				ServiceHelper.callService("RealtyService", "GetTotalAmountByTypeId", this.getWebServiceResult, serviceData, this);
				this.console.log("2");
			},
			getWebServiceResult: function(response, success) {
				this.console.log("3");
				this.Terrasoft.showInformation("Total amount by typeId: " + response.GetTotalAmountByTypeIdResult);
			},
			/** asyncValidate */
			asyncValidate: function(callback, scope) {
				this.callParent([
					function(response) {
						if (!this.validateResponse(response)) {
							return;
						}
						this.validateRealtyData(function(response) {
							if (!this.validateResponse(response)) {
								return;
							}
							callback.call(scope, response);
						}, this);
					}, this]);
			},
			validateRealtyData: function(callback, scope) {
				// create query for server side
				var esq = this.Ext.create("Terrasoft.EntitySchemaQuery", {
					rootSchemaName: "UsrRealty"
				});
				esq.addAggregationSchemaColumn("UsrPriceUSD", Terrasoft.AggregationType.SUM, "PriceSum");
				// get values
				var typeObject = this.get("UsrType");
				if (!typeObject) {
					return;
				}
				var typeId = typeObject.value;
				var offerTypeObject = this.get("UsrOfferType");
				if (!offerTypeObject) {
					return;
				}
				var offerTypeId = offerTypeObject.value;
				var id = this.get("Id");
				// set filters
				var typeFilter = esq.createColumnFilterWithParameter(this.Terrasoft.ComparisonType.EQUAL,"UsrType", typeId);
				var offerTypeFilter = esq.createColumnFilterWithParameter(this.Terrasoft.ComparisonType.EQUAL,"UsrOfferType", offerTypeId);
				esq.filters.addItem(typeFilter);
				esq.filters.addItem(offerTypeFilter);
				if (id) {
					esq.filters.addItem(this.Terrasoft.createColumnFilterWithParameter(this.Terrasoft.ComparisonType.NOT_EQUAL, "Id", id));
				}
				// run query
				esq.getEntityCollection(function(response) {
					if (response.success && response.collection) {
						var sum = 0;
						var items = response.collection.getItems();
						if (items.length > 0) {
							sum = items[0].get("PriceSum");
						}
						var price = this.get("UsrPriceUSD");
						if (!price) {
							price = 0;
						}
						sum = sum + price;
						var max = 500000;
						if (sum > max) {
							if (callback) {
								callback.call(this, {
									success: false,
									message: "You cannot save, because sum = " + sum + " is bigger than " + max
								});
							}
						} else if (callback) {
							callback.call(scope, {
								success: true
							});
						}
					}
				}, this);
			},
			/* async */
		},
		dataModels: /**SCHEMA_DATA_MODELS*/{}/**SCHEMA_DATA_MODELS*/,
		diff: /**SCHEMA_DIFF*/[
			{
				"operation": "insert",
				"name": "UsrName67192044-486e-45c3-841f-4dc908fd9256",
				"values": {
					"layout": {
						"colSpan": 24,
						"rowSpan": 1,
						"column": 0,
						"row": 0,
						"layoutName": "ProfileContainer"
					},
					"bindTo": "UsrName",
					"enabled": true
				},
				"parentName": "ProfileContainer",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "FLOAT348cd735-b177-431c-b86e-bea110f78aeb",
				"values": {
					"layout": {
						"colSpan": 24,
						"rowSpan": 1,
						"column": 0,
						"row": 1,
						"layoutName": "ProfileContainer"
					},
					"bindTo": "UsrPriceUSD",
					"enabled": true
				},
				"parentName": "ProfileContainer",
				"propertyName": "items",
				"index": 1
			},
			{
				"operation": "insert",
				"name": "FLOATce583b58-5205-4717-890e-9458f66ba1b9",
				"values": {
					"layout": {
						"colSpan": 24,
						"rowSpan": 1,
						"column": 0,
						"row": 2,
						"layoutName": "ProfileContainer"
					},
					"bindTo": "UsrAreaSqM",
					"enabled": true
				},
				"parentName": "ProfileContainer",
				"propertyName": "items",
				"index": 2
			},
			{
				"operation": "insert",
				"name": "CommissionControl",
				"values": {
					"layout": {
						"colSpan": 24,
						"rowSpan": 1,
						"column": 0,
						"row": 3,
						"layoutName": "ProfileContainer"
					},
					"bindTo": "CommissionUSD",
					"enabled": false,
					"caption": {
						"bindTo": "Resources.Strings.CommissionCaption"
					}
				},
				"parentName": "ProfileContainer",
				"propertyName": "items",
				"index": 3
			},
			{
				"operation": "insert",
				"name": "MyButton",
				"values": {
					"layout": {
						"colSpan": 12,
						"rowSpan": 1,
						"column": 0,
						"row": 4,
						"layoutName": "ProfileContainer"
					},
					"itemType": 5,
					"caption": {
						"bindTo": "Resources.Strings.MyButtonCaption"
					},
					"click": {
						"bindTo": "onMyButtonClick"
					},
					"enabled": {
						"bindTo": "getMyButtonEnabled"
					},
					"style": "red"
				},
				"parentName": "ProfileContainer",
				"propertyName": "items",
				"index": 4
			},
			{
				"operation": "insert",
				"name": "RunWebServiceButton",
				"values": {
					"layout": {
						"colSpan": 12,
						"rowSpan": 1,
						"column": 12,
						"row": 4,
						"layoutName": "ProfileContainer"
					},
					"itemType": 5,
					"caption": {
						"bindTo": "Resources.Strings.RunWebServiceButtonCaption"
					},
					"click": {
						"bindTo": "runWebServiceButtonClick"
					},
					"style": "green"
				},
				"parentName": "ProfileContainer",
				"propertyName": "items",
				"index": 5
			},
			{
				"operation": "insert",
				"name": "UsrTyped45c84d5-2801-4544-9a50-8b803570c99f",
				"values": {
					"layout": {
						"colSpan": 12,
						"rowSpan": 1,
						"column": 0,
						"row": 0,
						"layoutName": "Header"
					},
					"bindTo": "UsrType",
					"enabled": true,
					"contentType": 3
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "LOOKUP0f26ac1f-5853-41bf-970a-8aec8a6cde4b",
				"values": {
					"layout": {
						"colSpan": 12,
						"rowSpan": 1,
						"column": 12,
						"row": 0,
						"layoutName": "Header"
					},
					"bindTo": "UsrOfferType",
					"enabled": true,
					"contentType": 3
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 1
			},
			{
				"operation": "insert",
				"name": "STRING4d13aecf-72e7-4534-84c8-230109d91bbf",
				"values": {
					"layout": {
						"colSpan": 24,
						"rowSpan": 2,
						"column": 0,
						"row": 1,
						"layoutName": "Header"
					},
					"bindTo": "UsrComment",
					"enabled": true,
					"contentType": 0
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 2
			},
			{
				"operation": "insert",
				"name": "LOOKUPe318ddfe-c13d-4cc5-87b2-c35fdf4b2c8e",
				"values": {
					"layout": {
						"colSpan": 12,
						"rowSpan": 1,
						"column": 0,
						"row": 3,
						"layoutName": "Header"
					},
					"bindTo": "UsrManager",
					"enabled": true,
					"contentType": 5
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 3
			},
			{
				"operation": "insert",
				"name": "TabVisits",
				"values": {
					"caption": {
						"bindTo": "Resources.Strings.TabVisitsTabCaption"
					},
					"items": [],
					"order": 0
				},
				"parentName": "Tabs",
				"propertyName": "tabs",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "UsrSchema5269bfd4Detaile6fe50f6",
				"values": {
					"itemType": 2,
					"markerValue": "added-detail"
				},
				"parentName": "TabVisits",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "NotesAndFilesTab",
				"values": {
					"caption": {
						"bindTo": "Resources.Strings.NotesAndFilesTabCaption"
					},
					"items": [],
					"order": 1
				},
				"parentName": "Tabs",
				"propertyName": "tabs",
				"index": 1
			},
			{
				"operation": "insert",
				"name": "Files",
				"values": {
					"itemType": 2
				},
				"parentName": "NotesAndFilesTab",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "NotesControlGroup",
				"values": {
					"itemType": 15,
					"caption": {
						"bindTo": "Resources.Strings.NotesGroupCaption"
					},
					"items": []
				},
				"parentName": "NotesAndFilesTab",
				"propertyName": "items",
				"index": 1
			},
			{
				"operation": "insert",
				"name": "Notes",
				"values": {
					"bindTo": "UsrNotes",
					"dataValueType": 1,
					"contentType": 4,
					"layout": {
						"column": 0,
						"row": 0,
						"colSpan": 24
					},
					"labelConfig": {
						"visible": false
					},
					"controlConfig": {
						"imageLoaded": {
							"bindTo": "insertImagesToNotes"
						},
						"images": {
							"bindTo": "NotesImagesCollection"
						}
					}
				},
				"parentName": "NotesControlGroup",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "merge",
				"name": "ESNTab",
				"values": {
					"order": 2
				}
			}
		]/**SCHEMA_DIFF*/
	};
});
