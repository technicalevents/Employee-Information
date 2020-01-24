/*global location*/
sap.ui.define([
		"test/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/routing/History",
		"test/model/formatter",
		"sap/m/MessageBox"
	],
	function (
		BaseController,
		JSONModel,
		History,
		formatter,
		MessageBox
	) {
		"use strict";

		return BaseController.extend("test.controller.Object", {
			formatter: formatter,

			onInit: function () {
				var oEmployeeDetailModel = new JSONModel();
				oEmployeeDetailModel.setProperty("/", {
					"EmployeeTable": {
						"EmpId": "",
						"FirstName": "",
						"LastName": "",
						"EmailId": "",
						"Gender": "",
						"Designation": ""
					}
				});
				this.getView().setModel(oEmployeeDetailModel, "TestModel1");
				this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);
			},

			onPressDeleteMultiple: function (oTableHeaderDelete) {

				MessageBox.show(
					"Please confirm if you want to Delete the Selected Entries", {
						icon: MessageBox.Icon.WARNING,
						title: "Warning",
						actions: [MessageBox.Action.YES, MessageBox.Action.NO],
						initialFocus: "NO",
						onClose: function (oAction) {

							if (oAction === 'YES') {
								var selectedRow = this.byId("idTable1").getSelectedContexts();
								var aPromise = [];
								//Put for loop
								for (var i = 0; i < selectedRow.length; i++) {
									var indSelectedRow = selectedRow[i].getObject("EmpId");
									aPromise.push(this.removemultiple(indSelectedRow));

								}
								this.submitBatchReq().done(function () {
									debugger;
								}.bind(this, aPromise))

								.fail(function () {
									debugger;
								}.bind(this));
								// var path = "/ZEMPLOYEE_ANUSet('" + this.getSelectedRowData.getCells()[0].getText() + "')";

								// this._onObjectMatched();
							}
						}.bind(this)
					});

				// debugger;
			},

			submitBatchReq: function () {

				var oSubmitBatchDefObj = jQuery.Deferred();

				this.getOwnerComponent().getModel().submitChanges({

					batchGroupId: 'MultipleDelete',

					success: oSubmitBatchDefObj.resolve,

					error: oSubmitBatchDefObj.reject

				});

				return oSubmitBatchDefObj.promise();

			},
			removemultiple: function (indSelectedRow) {

				var odeferred = jQuery.Deferred();

				var path = "/ZEMPLOYEE_ANUSet('" + indSelectedRow + "')";
				this.getOwnerComponent().getModel().remove(path, {
					success: function (oSuccessDelete) {
						// this._onObjectMatched();
						MessageBox.show(
							"Selected Entries Deleted", {
								icon: MessageBox.Icon.WARNING,
								title: "Success",
								actions: ["Cool"],
								initialFocus: "Cool"
							});
						odeferred.resolve();
					}.bind(this),
					error: function (oErrorDelete) {
						// debugger;
						odeferred.reject();
					}.bind(this),
					groupId: 'MultipleDelete',
					changeSetId: jQuery.sap.uid()
				});
				return odeferred.promise();
			},

			handleEditPress: function (oEvent) {

				if (!this._getDialog1) {
					this._getDialog1 = sap.ui.xmlfragment("test.fragment.dialog1", this);
					this.getView().addDependent(this._getDialog1);
				}
				this._getDialog1.open();

				var getSelectedRowData = oEvent.getSource().getBindingContext().getObject();
				// oEvent.getSource().getParent().getParent();
				this.getView().getModel("TestModel1").setProperty("/empid", getSelectedRowData.EmpId);
				this.getView().getModel("TestModel1").setProperty("/firstName", getSelectedRowData.FirstName);
				this.getView().getModel("TestModel1").setProperty("/lastName", getSelectedRowData.LastName);
				this.getView().getModel("TestModel1").setProperty("/emailId", getSelectedRowData.EmailId);
				this.getView().getModel("TestModel1").setProperty("/designation", getSelectedRowData.Designation);
				this.getView().getModel("TestModel1").setProperty("/gender", getSelectedRowData.Gender);
			},
			closeDialog: function () {
				this._getDialog1.close();
			},

			handleDeletePress: function (oEvent) {

				this.getSelectedRowData = oEvent.getSource().getParent().getParent();

				MessageBox.show(
					"Please confirm if you want to Delete the Entry", {
						icon: MessageBox.Icon.WARNING,
						title: "Warning",
						actions: [MessageBox.Action.YES, MessageBox.Action.NO],
						initialFocus: "NO",
						onClose: function (oAction) {

							if (oAction === 'YES') {
								// var getSelectedRowData = this.oDelete.getSource().getParent().getParent();

								var path = "/ZEMPLOYEE_ANUSet('" + this.getSelectedRowData.getCells()[0].getText() + "')";
								this.getOwnerComponent().getModel().remove(path, {
									success: function (oSuccessDelete) {
										// this._onObjectMatched();
										MessageBox.show(
											"Selected Entry Deleted", {
												icon: MessageBox.Icon.WARNING,
												title: "Success",
												actions: ["Cool"],
												initialFocus: "Cool"
											});
									}.bind(this),
									error: function (oErrorDelete) {
										// debugger;
									}.bind(this)
								});
								// this._onObjectMatched();
							}
						}.bind(this)
					});

			},

			onSave: function (oEvent) {
				// var getSelectedRowData = oEvent.getSource().getParent().getParent();
				var odataUpdate = {};
				odataUpdate.EmpId = this.getView().getModel("TestModel1").getProperty("/empid");
				odataUpdate.FirstName = this.getView().getModel("TestModel1").getProperty("/firstName");
				odataUpdate.LastName = this.getView().getModel("TestModel1").getProperty("/lastName");
				odataUpdate.EmailId = this.getView().getModel("TestModel1").getProperty("/emailId");
				odataUpdate.Gender = this.getView().getModel("TestModel1").getProperty("/gender");
				odataUpdate.Designation = this.getView().getModel("TestModel1").getProperty("/designation");

				// 	"EmpId": this.getView().getModel("TestModel1").getProperty("/empid"),
				// 	"FirstName": this.getView().getModel("TestModel1").getProperty("/firstName"),
				// 	"LastName": this.getView().getModel("TestModel1").getProperty("/lastName"),
				// 	"EmailId": this.getView().getModel("TestModel1").getProperty("/emailId"),
				// 	"Gender": this.getView().getModel("TestModel1").getProperty("/gender"),
				// 	"Designation": this.getView().getModel("TestModel1").getProperty("/designation")
				// }];
				var path = "/ZEMPLOYEE_ANUSet('" + this.getView().getModel("TestModel1").getProperty("/empid") + "')";
				this.getOwnerComponent().getModel().update(path, odataUpdate, {
					success: function (oSuccessUpdate) {
						this._getDialog1.close();
						// this._onObjectMatched();
						MessageBox.show(
							"Selected Entry Updated Successfully", {
								icon: MessageBox.Icon.WARNING,
								title: "Success",
								actions: ["Cool"],
								initialFocus: "Cool"
							});
					}.bind(this),
					error: function (oErrorUpdate) {
						// debugger;
					}.bind(this)
				});
			},

			_onObjectMatched: function (oEvent) {

				// var parameters = oEvent.getParameters().arguments;

				// var table = this.byId("idTable1");

				// this.getOwnerComponent().getModel().read("/ZEMPLOYEE_ANUSet", {
				// 	success: function (oSuccessRead) {
				// 		this.getView().getModel("TestModel1").setProperty("/EmployeeTable", oSuccessRead.results);
				// 	}.bind(this),
				// 	error: function (oErrorRead) {
				// 		debugger;
				// 	}.bind(this)
				// });

				// var oData = [{
				// 	// "firstName": parameters.firstName,
				// 	// "lastName": parameters.lastName,
				// 	// "designation": parameters.designation,
				// 	// "gender": parameters.gender,
				// 	// "emailId": parameters.emailId
				// 	// }, {
				// 	"firstName": "shilpa",
				// 	"lastName": "gupta",
				// 	"designation": "Manager",
				// 	"gender": "Female",
				// 	"emailId": "abc@abc.com"
				// }];
				// table.setModel(json);

				// MessageBox.show(
				// 	"Details saved Successfully", {
				// 		icon: MessageBox.Icon.WARNING,
				// 		title: "Success",
				// 		actions: ["Cool"],
				// 		initialFocus: "Cool"
				// 	}

				// );
			}
		});

	});