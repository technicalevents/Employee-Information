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
				// var oEmployeeDetailModel = new JSONModel();
				// oEmployeeDetailModel.setProperty("/", {
				// 	"EmployeeTable": {
				// 		"EmpId": "",
				// 		"FirstName": "",
				// 		"LastName": "",
				// 		"EmailId": "",
				// 		"Gender": "",
				// 		"Designation": ""
				// 	}
				// });
				// this.getView().setModel(oEmployeeDetailModel, "TestModel1");
				this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);

				var CmbxData = [{
					"key": "CN",
					"text": "Consultant"
				}, {
					"key": "SCN",
					"text": "Sr.Consultant"
				}, {
					"key": "AT",
					"text": "Architect"
				}, {
					"key": "OT",
					"text": "Others"
				}];

				var oUIstate = new JSONModel();
				oUIstate.setProperty("/", {
					"visibleUser": false,
					"visibleOthers": false,
					"editable": false
				});
				this.getView().setModel(oUIstate, "UIstate");

				var oEmployeeDetailModel = new JSONModel();
				oEmployeeDetailModel.setProperty("/", {
					"DesignationCollection": CmbxData,
					"EmployeeDetailfrag": {
						"EmpId": "",
						"FirstName": "",
						"LastName": "",
						"EmailId": "",
						"Gender": "",
						"Designation": "",
						"Others": "",
						"User": ""
					}
				});
				this.getView().setModel(oEmployeeDetailModel, "EmpDetailDialogModel");
				sap.ui.getCore().getMessageManager("message").removeAllMessages();
			},

			onPressDeleteMultiple: function (oTableHeaderDelete) {

				var selectedRow = this.byId("idTable1").getSelectedIndices();

				if (this.byId("idTable1").getSelectedIndices().length < 1) {
					MessageBox.show(
						"Please Select an Entry", {
							icon: MessageBox.Icon.ERROR,
							title: "ERROR",
							actions: ["OK"],
							initialFocus: "OK"
						}
					);
					return;
				}

				MessageBox.show(
					"Please confirm if you want to Delete the Selected Entries", {
						icon: MessageBox.Icon.WARNING,
						title: "Warning",
						actions: [MessageBox.Action.YES, MessageBox.Action.NO],
						initialFocus: "NO",
						onClose: function (oAction) {

							if (oAction === 'YES') {
								var aPromise = [];
								//Put for loop
								for (var i = 0; i < selectedRow.length; i++) {
									var indSelectedRow = this.byId("idTable1").getContextByIndex(selectedRow[i]).getObject("EmpId");
									aPromise.push(this.removemultiple(indSelectedRow));

								}
								this.submitBatchReq().done(function () {

								}.bind(this, aPromise))
								.fail(function () {
									debugger;
								}.bind(this, aPromise));
								// var path = "/ZEMPLOYEE_ANUSet('" + this.getSelectedRowData.getCells()[0].getText() + "')";
								// this._onObjectMatched();
							}
						}.bind(this)
					});
				// debugger;
			},

			onPressRefresh: function () {
				// this.getView().getModel().refresh(true);
				this.byId("idTable1").getBinding("rows").refresh(true);
				sap.ui.getCore().getMessageManager("message").removeAllMessages();
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

				sap.ui.getCore().getMessageManager("message").removeAllMessages();
				this.getOwnerComponent().getModel().remove(path, {
					success: function (oSuccessDelete, oResponse) {
						// this._onObjectMatched();
						// MessageBox.show(
						// 	"Selected Entries Deleted", {
						// 		icon: MessageBox.Icon.WARNING,
						// 		title: "Success",
						// 		actions: ["Cool"],
						// 		initialFocus: "Cool"
						// 	});
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

				if (!this._getDialog) {
					this._getDialog = sap.ui.xmlfragment("test.fragment.dialog", this);
					this.getView().addDependent(this._getDialog);
				}
				this._getDialog.open();

				var getSelectedRowData = oEvent.getSource().getBindingContext().getObject();
				// oEvent.getSource().getParent().getParent();
				// this.getView().getModel("EmpDetailDialogModel").setProperty("/EmployeeDetailfrag/EmpId", getSelectedRowData.EmpId);
				// this.getView().getModel("EmpDetailDialogModel").setProperty("/EmployeeDetailfrag/FirstName", getSelectedRowData.FirstName);
				// this.getView().getModel("EmpDetailDialogModel").setProperty("/EmployeeDetailfrag/LastName", getSelectedRowData.LastName);
				// this.getView().getModel("EmpDetailDialogModel").setProperty("/EmployeeDetailfrag/EmailId", getSelectedRowData.EmailId);
				// this.getView().getModel("EmpDetailDialogModel").setProperty("/EmployeeDetailfrag/Designation", getSelectedRowData.Designation);
				// this.getView().getModel("EmpDetailDialogModel").setProperty("/EmployeeDetailfrag/Gender", getSelectedRowData.Gender);
				this.getView().getModel("EmpDetailDialogModel").setProperty("/EmployeeDetailfrag", getSelectedRowData);

				this.getView().getModel("UIstate").setProperty("/visibleUser", false);
				this.getView().getModel("UIstate").setProperty("/editable", true);
			},
			closeDialog: function () {
				this._getDialog.close();
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
				odataUpdate.EmpId = this.getView().getModel("EmpDetailDialogModel").getProperty("/EmployeeDetailfrag/EmpId");
				odataUpdate.FirstName = this.getView().getModel("EmpDetailDialogModel").getProperty("/EmployeeDetailfrag/FirstName");
				odataUpdate.LastName = this.getView().getModel("EmpDetailDialogModel").getProperty("/EmployeeDetailfrag/LastName");
				odataUpdate.EmailId = this.getView().getModel("EmpDetailDialogModel").getProperty("/EmployeeDetailfrag/EmailId");
				odataUpdate.Gender = this.getView().getModel("EmpDetailDialogModel").getProperty("/EmployeeDetailfrag/Gender");
				if (this.getView().getModel("EmpDetailDialogModel").getProperty("/EmployeeDetailfrag/Designation") === "Others") {
					odataUpdate.Designation = this.getView().getModel("EmpDetailDialogModel").getProperty("/EmployeeDetailfrag/Others");
				} else {
					odataUpdate.Designation = this.getView().getModel("EmpDetailDialogModel").getProperty("/EmployeeDetailfrag/Designation");
				}
				// 	"EmpId": this.getView().getModel("TestModel1").getProperty("/empid"),
				// 	"FirstName": this.getView().getModel("TestModel1").getProperty("/firstName"),
				// 	"LastName": this.getView().getModel("TestModel1").getProperty("/lastName"),
				// 	"EmailId": this.getView().getModel("TestModel1").getProperty("/emailId"),
				// 	"Gender": this.getView().getModel("TestModel1").getProperty("/gender"),
				// 	"Designation": this.getView().getModel("TestModel1").getProperty("/designation")
				// }];
				var path = "/ZEMPLOYEE_ANUSet('" + odataUpdate.EmpId + "')";
				this.getOwnerComponent().getModel().update(path, odataUpdate, {
					success: function (oSuccessUpdate) {
						this._getDialog.close();
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
				this.getView().getModel("UIstate").setProperty("/visibleOthers", false);
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
			},

			DesignationtextChange: function (oEvent) {

					var Designation = this.getView().getModel("EmpDetailDialogModel").getProperty("/EmployeeDetailfrag/Designation");

					if (Designation === "Others") {
						this.getView().getModel("UIstate").setProperty("/visibleOthers", true);
					} else {
						this.getView().getModel("UIstate").setProperty("/visibleOthers", false);
					}
				}
				// }
		});

	});