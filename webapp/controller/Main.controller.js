sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/m/MessageBox",
        //"sap.ui.core.routing.Router"
    ],
    function (BaseController, MessageBox) {
        "use strict";

        return BaseController.extend("at.clouddna.training01.zhoui5.controller.controller.Main", {
            onInit() {
            },

            onDeleteButtonPressed: function (oEvent) {
                let oModel = this.getView().getModel();
                let oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
                let oSource = oEvent.getSource();
                let sPath = oSource.getBindingContext().getPath();

                MessageBox.warning(oResourceBundle.getText("sureToDeleteQuestion"), {
                    title: oResourceBundle.getText("sureToDeleteTitle"),
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
                let oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("Customer", {
                    path: sPath.split("/")[1]

                });
            },

            onCreatePressed: function(){
                let oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("CreateCustomer", null, false);
            }


        });
    });