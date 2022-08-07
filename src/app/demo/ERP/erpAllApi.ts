let base_url = 'http://3.109.161.106:3000'
// let base_url = 'http://localhost:3000'
// let base_url = 'https://a432-45-114-49-105.ngrok.io'
export class erp_all_api{
    public static urls = {
        // manufaturing strarts
        getCatogory: base_url+'/common/purchaseReturnData',
        getProduct: base_url+'/manufacture/getProduct',
        addProduct: base_url+'/manufacture/addproduct',
        updateProduct: base_url+'/manufacture/updateProduct',
        deleteProduct: base_url+'/manufacture/deleteProduct',
        getCatagory: base_url+'/manufacture/getCatagory',
        add_Catagory: base_url+'/manufacture/addCatagory',
        del_Catagory: base_url+'/manufacture/deleteCatagory',
        edit_Catagory: base_url+'/manufacture/updateCatagory',
        del_item: base_url+'/manufacture/deleteItem',
        edit_item: base_url+'/manufacture/updateItem',
        get_Vendor: base_url+'/manufacture/getVendor',
        add_Vendor: base_url+'/manufacture/createVendor',
        update_Vendor: base_url+'/manufacture/updateVendor',
        delete_Vendor: base_url+'/manufacture/deleteVendor',
        get_Item: base_url+'/manufacture/getItem',
        get_rawMatData: base_url+'/manufacture/getRawMaterial_Data',
        add_Item: base_url+'/manufacture/addItem',
        purchase_entry: base_url+'/manufacture/purchaseEntry',
        update_purchase_entry: base_url+'/manufacture/updatePurchaseEntry',
        trade_customer:base_url+'/trade/getCustomer',
        trade_create_customer:base_url+'/trade/createCustomer',
        trade_update_customer:base_url+'/trade/updateCustomer',
        debit_note:base_url+'/common/debitNote',
        get_profuct_req:base_url+'/manufacture/getProductRequirement',
        get_rawmat:base_url+'/manufacture/getRawMaterials',
        set_prod_req:base_url+'/manufacture/setProductRequirement',
        update_prod_req:base_url+'/manufacture/updateProductRequirement',
        get_product:base_url+'/manufacture/productionData',
        add_product:base_url+'/manufacture/productEntry',
        update_product:base_url+'/manufacture/update_productionData',
        get_scrap:base_url+'/manufacture/fetchscrap',
        add_scrap:base_url+'/manufacture/addscrap',
        get_consumption:base_url+'/manufacture/fetchConsumption',
        add_consumption:base_url+'/manufacture/addConsumption',

        // manufaturing ends

        // trade starts
        getTradeCat: base_url+'/trade/getCatagory',
        add_TradeCat: base_url+'/trade/addCatagory',
        edit_TradeCat: base_url+'/trade/updateCatagory',
        del_TradeCat: base_url+'/trade/deleteCatagory',
        get_prod: base_url+'/trade/getProduct',
        del_prod: base_url+'/trade/deleteProduct',
        edit_prod: base_url+'/trade/updateProduct',
        add_prod: base_url+'/trade/addProduct',

        get_trd_vendor: base_url+'/trade/getVendor',
        add_trd_vendor: base_url+'/trade/createVendor',
        update_trd_vendor: base_url+'/trade/updateVendor',
        delete_trd_vendor: base_url+'/trade/deleteVendor',

        get_cust: base_url+'/trade/getCustomer',
        add_cust: base_url+'/trade/createCustomer',
        update_cust: base_url+'/trade/updateCustomer',
        delete_cust: base_url+'/trade/deleteCustomer',

        trd_get_purchase_entry: base_url+'/trade/prodPurchase',
        trd_purchase_entry: base_url+'/trade/prodPurchaseEntry',

        trd_sale_entry: base_url+'/trade/salesEntry',
        trd_updt_sale_entry: base_url+'/trade/updateSalesEntry',
        trd_get_sale_entry: base_url+'/trade/salesEntry',

        trd_get_rawMatData: base_url+'/trade/stock',
        trd_update_purchase_entry: base_url+'/trade/updateProdPurchaseEntry',

        // updtPurc: base_url+'/trade/prodPurchaseEntry',
        // trade ends

        //quation start

        fetch_quotation: base_url+'/quotation/fetch',
        quotation_add: base_url+'/quotation/add',
        update_quotation: base_url+'/quotation/update',

    }
}
