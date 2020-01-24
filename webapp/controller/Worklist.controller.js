sap.ui.define([
	"test/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/m/MessageBox"
], function (BaseController, JSONModel, MessageToast, MessageBox) {
	"use strict";

	return BaseController.extend("test.controller.Worklist", {

		onInit: function () {

			// this.EmpId = this.byId("idEmpId");
			this.FirstName = this.byId("idFirstName");
			this.LastName = this.byId("idLastName");
			this.EmailID = this.byId("idEmailId");
			this.Gender = this.byId("rbg1");
			this.Designation = this.byId("idCmbx");
			this.TnC = this.byId("idcheckbox");
			this.others = this.byId("idothers");
			this.User = this.byId("idUserCmbx");

			// var Designation = this.byId("idCmbx");
			var json = new JSONModel();

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
			var UserCmbxData = [{
				"key": "SU",
				"text": "S User"
			}, {
				"key": "IU",
				"text": "I User"
			}, {
				"key": "CU",
				"text": "C User"
			}];
			json.setProperty("/", {
				"DesignationCollection": CmbxData,
				"UserCollection": UserCmbxData,
				"EmployeeDetail": {
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
			this.getView().setModel(json, "TestModel");

			var oEmployeeDetailModel = new JSONModel();
			oEmployeeDetailModel.setProperty("/", {
				"EmployeeDetailfrag": {
					"EmpId": "",
					"FirstName": "",
					"LastName": "",
					"EmailId": "",
					"Gender": "",
					"Designation": "",
					"User": ""
				}
			});
			this.getView().setModel(oEmployeeDetailModel, "EmpDetailDialogModel");

			if (!this._getDialog) {
				this._getDialog = sap.ui.xmlfragment("test.fragment.dialog", this);
				this.getView().addDependent(this._getDialog);
			}

			this.others.setProperty("visible", false);
		},

		onSubmit: function () {

			var oEmployeeDetail = jQuery.extend(true, {}, this.getView().getModel("TestModel").getProperty("/EmployeeDetail"));

			var sGender = oEmployeeDetail['IsMale'] ? "Male" : (oEmployeeDetail['IsFemale'] ? "Female" : "Neutral");
			oEmployeeDetail.Gender = sGender;

			if (oEmployeeDetail.FirstName === "") {
				var checkInitial = "X";
				this.FirstName.setValueState(sap.ui.core.ValueState.Error);
			} else {
				this.FirstName.setValueState(sap.ui.core.ValueState.None);
			}

			if (this.LastName.getValue() === "") {
				checkInitial = "X";
				this.LastName.setValueState(sap.ui.core.ValueState.Error);
			} else {
				this.LastName.setValueState(sap.ui.core.ValueState.None);
			}

			if (this.EmailID.getValue() === "") {
				checkInitial = "X";
				this.EmailID.setValueState(sap.ui.core.ValueState.Error);
			} else {
				this.EmailID.setValueState(sap.ui.core.ValueState.None);
			}

			if (this.Gender.getSelectedIndex() < "0") {
				checkInitial = "X";
				this.Gender.setValueState(sap.ui.core.ValueState.Error);
			} else {
				this.Gender.setValueState(sap.ui.core.ValueState.None);
			}

			if (this.Designation.getValue() === "") {
				checkInitial = "X";
				this.Designation.setValueState(sap.ui.core.ValueState.Error);
			} else {
				this.Designation.setValueState(sap.ui.core.ValueState.None);
			}

			if (this.TnC.getSelected() === false) {
				checkInitial = "X";
				this.TnC.setValueState(sap.ui.core.ValueState.Error);
			} else {
				this.TnC.setValueState(sap.ui.core.ValueState.None);
			}

			// if (this.EmpId.getValue() === "") {
			// 	checkInitial = "X";
			// 	this.EmpId.setValueState(sap.ui.core.ValueState.Error);
			// } else {
			// 	this.EmpId.setValueState(sap.ui.core.ValueState.None);
			// }

			if (this.Designation.getValue() === "Others") {
				if (this.others.getValue() === "") {
					checkInitial = "X";
					this.others.setValueState(sap.ui.core.ValueState.Error);
				} else {
					this.others.setValueState(sap.ui.core.ValueState.None);
				}
			}

			if (checkInitial === "X") {
				MessageBox.show(
					"Enter All Mandatory Fields", {
						icon: MessageBox.Icon.ERROR,
						title: "Error",
						actions: ["OK"],
						initialFocus: "OK"
					}
				);
				return;
			}

			if (this.Designation.getSelectedKey() === "") {
				MessageBox.show(
					"Enter Correct Designation", {
						icon: MessageBox.Icon.ERROR,
						title: "Error",
						actions: ["OK"],
						initialFocus: "OK"
					}
				);
				return;
			}

			if (this.User.getSelectedKey() === "") {
				MessageBox.show(
					"Enter Correct User", {
						icon: MessageBox.Icon.ERROR,
						title: "Error",
						actions: ["OK"],
						initialFocus: "OK"
					}
				);
				return;
			}
			this._getDialog.open();

			this.getModel("EmpDetailDialogModel").setProperty("/EmployeeDetailfrag", oEmployeeDetail);
			if (this.Designation.getValue() === "Others") {
				this.getModel("EmpDetailDialogModel").setProperty("/EmployeeDetailfrag/Designation", this.others.getValue());
			}
		},

		textChange: function (oEvent) {

			// if (this.byId("idEmpId").getValue() === "") {
			// 	this.byId("idEmpId").setValueState(sap.ui.core.ValueState.Error);
			// } else {
			// 	this.byId("idEmpId").setValueState(sap.ui.core.ValueState.None);
			// 	var text = this.byId("idEmpId").getValue();
			// 	this.getView().getModel("TestModel").setProperty("/EmployeeDetail/EmpId", text);
			// }

			if (this.byId("idFirstName").getValue() === "") {
				this.byId("idFirstName").setValueState(sap.ui.core.ValueState.Error);
			} else {
				this.byId("idFirstName").setValueState(sap.ui.core.ValueState.None);
				var text = this.byId("idFirstName").getValue();
				this.getView().getModel("TestModel").setProperty("/EmployeeDetail/FirstName", text);
			}

			if (this.byId("idLastName").getValue() === "") {
				this.byId("idLastName").setValueState(sap.ui.core.ValueState.Error);
			} else {
				this.byId("idLastName").setValueState(sap.ui.core.ValueState.None);
				var text = this.byId("idLastName").getValue();
				this.getView().getModel("TestModel").setProperty("/EmployeeDetail/LastName", text);
			}

			if (this.byId("idEmailId").getValue() === "") {
				this.byId("idEmailId").setValueState(sap.ui.core.ValueState.Error);
			} else {
				this.byId("idEmailId").setValueState(sap.ui.core.ValueState.None);
				var text = this.byId("idEmailId").getValue();
				this.getView().getModel("TestModel").setProperty("/EmployeeDetail/EmailId", text);
			}

			if (this.byId("rbg1").getSelectedIndex() < "0") {
				this.byId("rbg1").setValueState(sap.ui.core.ValueState.Error);
			} else {
				this.byId("rbg1").setValueState(sap.ui.core.ValueState.None);
			}

			// if (this.byId("idCmbx").getValue() === "") {
			// 	this.byId("idCmbx").setValueState(sap.ui.core.ValueState.Error);
			// } else {
			// 	this.byId("idCmbx").setValueState(sap.ui.core.ValueState.None);
			// }

			if (this.byId("idcheckbox").getSelected() === false) {
				this.byId("idcheckbox").setValueState(sap.ui.core.ValueState.Error);
			} else {
				this.byId("idcheckbox").setValueState(sap.ui.core.ValueState.None);
			}

			if (this.others.getValue() === "") {
				this.others.setValueState(sap.ui.core.ValueState.Error);
			} else {
				this.others.setValueState(sap.ui.core.ValueState.None);
			}
		},

		DesignationtextChange: function (oEvent) {

			if (this.Designation.getValue() === "") {
				this.Designation.setValueState(sap.ui.core.ValueState.Error);
			} else {
				this.Designation.setValueState(sap.ui.core.ValueState.None);
			}

			if (this.Designation.getValue() === "Others") {
				this.others.setProperty("visible", true);
			} else {
				this.others.setProperty("visible", false);
			}
		},

		UserChange: function (oEvent) {

			if (this.User.getValue() === "") {
				this.User.setValueState(sap.ui.core.ValueState.Error);
			} else {
				this.User.setValueState(sap.ui.core.ValueState.None);
			}
		},

		onReset: function () {

			this.getModel("TestModel").setProperty("/EmployeeDetail/FirstName", "");
			// this.EmpId.setValue("");
			// this.FirstName.setValue("");
			this.LastName.setValue("");
			this.EmailID.setValue("");
			this.Gender.setSelectedIndex(-1);
			this.Designation.setValue("");
			this.TnC.setSelected(false);
			this.others.setValue("");
			this.User.setValue("");

			this.byId("idEmpId").setValueState(sap.ui.core.ValueState.None);
			this.byId("idFirstName").setValueState(sap.ui.core.ValueState.None);
			this.byId("idLastName").setValueState(sap.ui.core.ValueState.None);
			this.byId("idEmailId").setValueState(sap.ui.core.ValueState.None);
			this.byId("rbg1").setValueState(sap.ui.core.ValueState.None);
			this.byId("idCmbx").setValueState(sap.ui.core.ValueState.None);
			this.byId("idcheckbox").setValueState(sap.ui.core.ValueState.None);
			// this.others.setValueState(sap.ui.core.ValueState.None);
			this.others.setProperty("visible", false);
		},

		closeDialog: function () {
			this._getDialog.close();
		},

		onCreateSuccess: function (oResult) {

			// this.getRouter().navTo("object", {
			// 	"firstName": FirstName,
			// 	"lastName": LastName.getValue(),
			// 	"designation": Designation.getValue(),
			// 	"gender": Gender.getValue(),
			// 	"emailId": EmailID.getValue()
			// });
		},

		onSave: function () {

			// var oDefferedObj = jQuery.Deferred();

			this._getDialog.close();

			var oEmpDetail = this.getModel("EmpDetailDialogModel").getProperty("/EmployeeDetailfrag");
			delete oEmpDetail.IsMale;
			delete oEmpDetail.IsFemale;
			delete oEmpDetail.IsNeutral;
			delete oEmpDetail.Others;

			this.getModel().create("/ZEMPLOYEE_ANUSet", oEmpDetail, {
				//sucess: this.onCreateSuccess.bind(this)
				success: function (oSuccessCreate) {
					// this.closeDialog();
					MessageBox.show(
						"Entry Created Successfully with Employee ID " +oSuccessCreate.EmpId+ "", {
							icon: MessageBox.Icon.SUCCESS,
							title: "Success",
							actions: ["OK"],
							initialFocus: "OK",
							onClose: function (oAction) {
								this.getRouter().navTo("object");
							}.bind(this)
						});
				}.bind(this),
				// });

				// }.bind(this),
				error: function (oErrorCreate) {
					// MessageToast.show(JSON.parse(oErrorCreate.responseText).error.message.value);
					MessageBox.show(
						JSON.parse(oErrorCreate.responseText).error.message.value, {
							icon: MessageBox.Icon.ERROR,
							title: "Error",
							actions: ["OK"],
							initialFocus: "OK"
						});
					this.closeDialog();
				}.bind(this)
			});

			// this.getOwnerComponent().getModel().read("/ZEMPLOYEE_ANUSet", {
			// 	success: function (oSuccessRead) {
			// 		debugger;
			// 	},
			// 	error: function (oErrorRead) {
			// 		debugger;
			// 	}
			// });

			// this.getModel().read("/ZEMPLOYEE_ANUSet", {
			// 	//sucess: this.onCreateSuccess.bind(this)
			// 	suceess: oDefferedObj.resolve,

			// 	error: oDefferedObj.reject

			// });

			// oDefferedObj.promise().done(function (oResult) {
			// 	debugger;
			// });

			// oDefferedObj.promise().fail(function (oError) {
			// 	debugger;
			// });

			// FirstName1.setValue("");
			// LastName1.setValue("");
			// EmailID1.setValue("");
			// Gender1.setSelectedIndex(-1);
			// Designation1.setValue("");
			// TnC.setSelected(false);

		},

		onPressAllInfo: function () {
			this.getRouter().navTo("object");
		}
	});
});