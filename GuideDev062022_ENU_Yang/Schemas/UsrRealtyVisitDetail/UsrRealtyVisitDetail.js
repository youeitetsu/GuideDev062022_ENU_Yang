define("UsrRealtyVisitDetail", [], function() {
	return {
		entitySchemaName: "UsrRealtyVisit",
		details: /**SCHEMA_DETAILS*/{}/**SCHEMA_DETAILS*/,
		diff: /**SCHEMA_DIFF*/[]/**SCHEMA_DIFF*/,
		/*subscriber*/
		messages: {
			"MyMessageCode": {
				mode: Terrasoft.MessageMode.PTP,
				direction: Terrasoft.MessageDirectionType.SUBSCRIBE
			},
		},
		methods: {
			init: function() {
				this.callParent(arguments);
				this.subscribeForWebsocketEvents();

				// Registering of messages
				this.sandbox.registerMessages(this.messages);
				this.sandbox.subscribe("MyMessageCode", this.myMessageMethod, this, []);
			},
			myMessageMethod: function() {
				this.console.log("Message subscriber called.");
				this.reloadGridData();
				return "ok!";
			},
			destroy: function() {
				this.callParent(arguments);
				this.unsubscribeForWebsocketEvents();
			},
			subscribeForWebsocketEvents: function() {
				this.Terrasoft.ServerChannel.on(this.Terrasoft.EventName.ON_MESSAGE,
												this.onWebsocketMessage, this);
			},
			unsubscribeForWebsocketEvents: function() {
				this.Terrasoft.ServerChannel.un(this.Terrasoft.EventName.ON_MESSAGE,
												this.onWebsocketMessage, this);
			},
			onWebsocketMessage: function(scope, message) {
				if (!message) {
					return;
				}
				if (!message.Header) {
					return;
				}
				if (message.Header.Sender !== "AutoAddVisits") {
					return;
				}
				this.reloadGridData();
			},
		}
	};
});
