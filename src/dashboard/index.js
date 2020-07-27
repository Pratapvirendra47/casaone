import React, {useState, useEffect} from "react";
import DashBoardData from './dashboard_data.json';
import './dashboardStyle.css';

const getFormdata = (functionType, data_info) => {
  return (
    <div className="billingForm">
      {
        DashBoardData.formData.map((elements,index) => {
          return (
            <div key={index}>
              <input 
                type={elements== "Zipcode" ? "number" :"text"} 
                name={elements} 
                value={data_info[elements]} 
                placeholder={elements} 
                onChange={(e) => { 
                  functionType(e) 
                }} 
              /> 
            </div>
          )
        })
      }
    </div>
  )
}
const getProductListing = () => {
  return (
    <tr>
      {
        DashBoardData.productData.map((value, index) => {
          return (
            <th key={index} style={{width : value=="Product Name" ? "260px" : "120px"}}>
              <b> {value}</b>
            </th>
          )
        })
      }
    </tr>
  )
}

const getProductArray = (index, updateProductDetails, productArray, deleteProduct) => {
  return (
    <tr onChange={(e)=> {updateProductDetails(index, e)}} style={{lineHeight: "70px"}}>
      <td><input className="productInput"  type="number" name="productId" value={productArray[index]["productId"]} placeholder="Enter Product Id"   /></td>
      <td><input className="productNameInput" type = "text" name="productName" value={productArray[index]["productName"]} placeholder= "Enter Product Name"/></td>
      <td><input className="productInput"  type="number" name="productQuantity" value={productArray[index]["productQuantity"]} placeholder="Enter QTY"/></td>
      <td><input className="productInput"  type="number" name="productUnitPrice" value={productArray[index]["productUnitPrice"]} placeholder="Unit Price"/></td>
      <td><input className="productInput"  type="number" name="productTotalPrice" value={productArray[index]["productTotalPrice"]} placeholder="total Price" disabled/></td>
      <td><input type="text" className="productTextBox" /></td>
      <button className="deleteButton" onClick={() => {deleteProduct(index)}}> Delete</button>
    </tr>
  )
}

const Dashboard = () => {

  const [billing_info, setBillingInformation] = useState({});
  const [shipping_info, setShippingInformation] = useState({});
  const [productArray, setProductArray] = useState([]);

  useEffect(() => {
    if (DashBoardData.productEntries.length > 0) {
      setProductArray(DashBoardData.productEntries);
    }
  },[])
  

  const setBillingInfo = (e) => {
    let newBillingInfo = JSON.parse(JSON.stringify(billing_info));
    newBillingInfo[e.target.name] = e.target.value;
    setBillingInformation(newBillingInfo);
  }
  
  const setShippingInfo = (e) => {
    let newShippingInfo = JSON.parse(JSON.stringify(shipping_info));
    newShippingInfo[e.target.name] = e.target.value;
    setShippingInformation(newShippingInfo);
  }

  const deleteProduct = (index) => {
    let newProductArray =  productArray.filter((data, idx) => {
      return idx!=index;
    })
    console.log(newProductArray)
    setProductArray(newProductArray);
  }

  const updateProductDetails = (index, e) => {
    let newProductArray = [...productArray];
    newProductArray[index][e.target.name] = e.target.value;
    newProductArray[index]["productTotalPrice"] = +newProductArray[index]["productUnitPrice"]*+newProductArray[index]["productQuantity"];
    setProductArray(newProductArray);
  }

  const saveProductDetails = () => {
    // console.log(billing_info["shippingDate"], billing_info["billingDate"])
    if (shipping_info["shippingDate"] < billing_info["billingDate"]) {
      alert("Shipping Date should be greater that billing Date");
      return;
    }
    DashBoardData.billingEntries = billing_info;
    DashBoardData.shippingEntries = shipping_info;
    DashBoardData.productEntries = productArray;
    console.log(DashBoardData);
  }

  const addProducts = () => {
    let newFormat = {
      productId : 0,
      productName : "",
      productQuantity : 0,
      productUnitPrice : 0,
      productTotalPrice : 0,
      productNotes : ""
    }
    let newAddingProduct = productArray.concat(newFormat);
    setProductArray(newAddingProduct);
  }

  return (
    <div className="backgroundDiv">
      <div className="container-data">
        <div className="addressStyle">
          <div className="billingStyle">
            <h4> Billing Address</h4>
            {getFormdata(setBillingInfo, billing_info)}
            <h4>Order Date</h4> <br />
            <input type="date" name="billingDate" onChange={(e)=>{setBillingInfo(e)}}/>
          </div>
          <div className="shippingStyle">
            <h4>Shipping Address</h4>
            {getFormdata(setShippingInfo, shipping_info)}
            <h4>Shipping Date</h4> <br />
            <input type="date" name="shippingDate" onChange={(e) => {setShippingInfo(e)}}/>
          </div>
        </div>
        <div className="productStyle">
          <table className="productsTable">
            <thead>
              {getProductListing()}
            </thead>
            {
              productArray.length > 0 ?
                productArray.map((value, index) => {
                  return (
                    <tbody>
                      {getProductArray(index, updateProductDetails, productArray, deleteProduct)}
                    </tbody>
                  )
                }):
              null
            }
          </table>
          <div className="buttonStyling">
            <div>
              <button className="addButton" onClick={() => {addProducts()}}>Add Product</button>
            </div>
            <div>
              <button className="saveButton" onClick={() => {saveProductDetails()}}>Save</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Dashboard;