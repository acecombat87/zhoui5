sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/ui/core/routing/History"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,MessageBox,JSONModel, Fragment, History) {
        "use strict";

        return Controller.extend("at.clouddna.training01.zhoui5.controller.Customer", {
            onInit: function () {

            },

            _fragmentList: {},
            bCreate: false,

            onInit: function () {
                let oEditModel = new JSONModel({
                    editmode: false
                });
            
                this.getView().setModel(oEditModel, "editModel");
                //this._showCustomerFragment("DisplayCustomer");

                let oRouter = this.getOwnerComponent().getRouter();
                oRouter.getRoute("Customer").attachPatternMatched(this._onPatternMatched, this)

                oRouter.getRoute("CreateCustomer").attachPatternMatched(this._onCreatePatternMatched, this);
            },

            _onPatternMatched: function (oEvent) {
                this.bCreate = false;
                
                let sPath = oEvent.getParameters().arguments.path;
                this.sCustomerPath = "/" + sPath;
                this.getView().bindElement(this.sCustomerPath);

                this.getView().getModel("editModel").setProperty("/editmode", false);
                this._showCustomerFragment("DisplayCustomer");
            },

            _onCreatePatternMatched: function (oEvent) {
                this.bCreate = true;
            
                let oNewCustomerContext = this.getView().getModel().createEntry("/CustomerSet");
                this.getView().bindElement(oNewCustomerContext.getPath());
            
                this.getView().getModel("editModel").setProperty("/editmode", true);
                this._showCustomerFragment("ChangeCustomer");
            },

            onNavBack: function () {
                var oHistory = History.getInstance();
                var sPeviousHash = oHistory.getPreviousHash();

                if (sPeviousHash !== undefined) {
                    window.history.go(-1);
                } else {
                    var oRouter = this.getOwnerComponent().getRouter();
                    oRouter.navTo("Main", {}, true);
                }
            },

            _showCustomerFragment: function(sFragmentName){
                let oPage = this.getView().byId("page");
            
                oPage.removeAllContent();
            
                if(this._fragmentList[sFragmentName]){
                    oPage.insertContent(this._fragmentList[sFragmentName]);
                }else{
                    Fragment.load({
                        id: this.getView().createId(sFragmentName),
                        name: "at.clouddna.training01.zhoui5.view.fragment." + sFragmentName,
                        controller: this
                    }).then(function(oFragment){
                        this._fragmentList[sFragmentName] = oFragment;
                        oPage.insertContent(this._fragmentList[sFragmentName]);
                    }.bind(this));
                }
            },

            onEditPressed: function(){
                this._toggleEdit(true);
            },
            
            _toggleEdit: function(bEditMode){
                let oEditModel = this.getView().getModel("editModel");
            
                oEditModel.setProperty("/editmode", bEditMode);
            
                this._showCustomerFragment(bEditMode ? "ChangeCustomer" : "DisplayCustomer");
            },
            
            onSavePressed: function () {
                let oModel = this.getView().getModel();
                let oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
                let sSuccessText = this.bCreate ? oResourceBundle.getText("dialog.create.success") : oResourceBundle.getText("dialog.edit.success");
                /*
                
                let oData = oModel.getData();
                MessageBox.success(JSON.stringify(oData));
                this._toggleEdit(false);
                */
                oModel.submitChanges({
                    success: (oData, response) => {
                        MessageBox.success(sSuccessText, {
                            onClose: () => {
                                if (this.bCreate) {
                                    this.onNavBack();
                                } else {
                                    this._toggleEdit(false);
                                }
                            }
                        });                        
                    },
                    error: (oError) => {
                        MessageBox.error(oError.message);
                    }
                });
            },
            
            onCancelPressed: function () {
                let oModel = this.getView().getModel();
                oModel.resetChanges().then(() => {
                    if (this.bCreate) {
                        this.onNavBack();
                    } else {
                        this._toggleEdit(false);
                    }
                });
            },

            genderFormatter: function(sKey){
                let oView = this.getView();
                let oI18nModel = oView.getModel("i18n");
                let oResourceBundle = oI18nModel.getResourceBundle();
                let sText = oResourceBundle.getText(sKey);
                return sText; 
            }


        });
    });
