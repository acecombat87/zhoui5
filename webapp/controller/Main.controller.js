sap.ui.define(
    [
        "at/clouddna/training01/zhoui5/controller/BaseController",
        //"sap/ui/core/mvc/Controller",
        "sap/m/MessageBox",
        //"sap.ui.core.routing.Router"
    ],
    function (BaseController, MessageBox) {
        "use strict";

        return BaseController.extend("at.clouddna.training01.zhoui5.controller.controller.Main", {
            onInit: function () {
                this.setContentDensity();
            },

            onDeleteButtonPressed: function (oEvent) {
                //1. Quelle herausfinden (Kunde der gelöscht werden soll)
                let oModel = this.getView().getModel();
                //let oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
                let oSource = oEvent.getSource();
                let sPath = oSource.getBindingContext().getPath();

                //2. Warnung bringen 
                MessageBox.warning(this.getLocalizedText("sureToDeleteQuestion"), {
                    title: this.getLocalizedText("sureToDeleteTitle"),
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    emphasizedAction: MessageBox.Action.YES,
                    onClose: function (oAction) {
                        if (MessageBox.Action.YES === oAction) {
                            oModel.remove(sPath);
                        }
                    }
                });
            },

            onListItemPressed: function (oEvent) {
                let sPath = oEvent.getSource().getBindingContext().getPath();
                this.getRouter().navTo("Customer", {
                    path: sPath.split("/")[1]

                });
            },

            onCreatePressed: function(){
                //let oRouter = this.getOwnerComponent().getRouter();
                this.getRouter().navTo("CreateCustomer", null, false);
            }


        });
    });