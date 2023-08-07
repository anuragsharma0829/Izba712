const uData = localStorage.getItem("userData");
const datarate = JSON.parse(uData);
const objctID = datarate.objectId;
const usertoken = datarate.token;



// select fulfillmentContract for partcular user 


// Function to save the selected Fulfillment Center in Local Storage
function saveSelectedContract() {
    const contractSelect = document.getElementById('contract');
    const selectedIndex = contractSelect.selectedIndex;
    const selectedContract = contractSelect.options[selectedIndex].text;
    const selectedContractId = contractSelect.value;

    // Save the selected Fulfillment Center's object ID and name in Local Storage
    localStorage.setItem('selectedContractId', selectedContractId);
    localStorage.setItem('selectedContractName', selectedContract);
}

// Call second API to fetch centers
let userobjId = {
    objectId: "AF00B19D-5B3B-4840-8304-8EF0005DB39B",
};

fetch("https://cleanstation.backendless.app/api/services/Brand/BrandContract", {
    method: "POST",
    body: JSON.stringify(userobjId),
    headers: {
        "Content-type": "application/json; charset=UTF-8",
    },
})
    .then(response => response.json())
    .then(data => {
        console.log(data);

        var temp = "";
        // Loop through each object in the data array
        data.forEach(center => {
            temp += "<option value='" + center.objectId + "'>" + center.Contract_name + "</option>";
        });

        document.getElementById('contract').innerHTML = temp;

        // Check if a previously selected center is stored in Local Storage
        const selectedContractId = localStorage.getItem('selectedContractId');
        if (selectedContractId) {
            const centerSelect = document.getElementById('contract');
            // Set the previously selected center as the default selected option
            centerSelect.value = selectedContractId;
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Something went wrong");
    });

// Add event listener to the select element to save the selected center
document.getElementById('contract').addEventListener('change', saveSelectedContract);

// End here

// *****************************

// function for show particular invoice audit 
async function showAuditforinvoice(objectId) {

    let auditCurrentPage = 1;
    const auditItemsPerPage = 1; // You can change the number of items per page here

    // Function to fetch data from API
    async function fetchAuditData() {
        try {
            const response = await fetch(`https://cleanstation.backendless.app/api/services/Audit/InvoiceToAudit?Id=${objectId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching Audit data:', error);
            return null;
        }
    }

    // Function to render the table
    async function renderAuditTable(page) {
        const data = await fetchAuditData();

        if (data.length === 0) {
            // Show the "No rate card for this contact" message if no data is available
            document.getElementById('Audit-table-body').innerHTML = '';
            document.getElementById('audit-pagination').innerHTML = '';
            document.getElementById('Audit-no-data-message').style.display = 'block';
            return;
        }

        const startIndexaudit = (page - 1) * auditItemsPerPage;
        const endIndexaudit = startIndexaudit + auditItemsPerPage;
        const paginatedDataaudit = data.slice(startIndexaudit, endIndexaudit);

        document.getElementById('Audit-no-data-message').style.display = 'none';

        const tableBody = document.getElementById('Audit-table-body');
        tableBody.innerHTML = paginatedDataaudit.map(audit => {
            return `
                <tr>
                    <td onclick="handleAuditData('${audit.objectId}')">${audit.Name}</td>
                    <td>${"fcname"}</td>
                    <td>${new Date(audit.created).toLocaleString()}</td>
                   
                    <td>
                        <span class="delete-btn glyphicon glyphicon-trash" onclick="handleauditDelete('${audit.objectId}')"></span>
                    </td>
                </tr>
            `;
        }).join('');

        renderAuditPagination(data.length);
    }

    // Function to render pagination
    function renderAuditPagination(totalItems) {
        const totalPagesforaudit = Math.ceil(totalItems / auditItemsPerPage);
        const paginationElementforaudit = document.getElementById('audit-pagination');

        let paginationHtmlCon = `
    <li${auditCurrentPage === 1 ? ' class="disabled"' : ''}>
        <a href="#" aria-label="Previous" onclick="prevAuditPage()">
            <span aria-hidden="true">&laquo; Previous</span>
        </a>
    </li>
`;
        for (let i = 1; i <= totalPagesforaudit; i++) {
            paginationHtmlCon += `<li${auditCurrentPage === i ? ' class="active"' : ''}><a href="#" onclick="changeauditPage(${i})">${i}</a></li>`;
        }
        paginationHtmlCon += `
    <li${auditCurrentPage === totalPagesforaudit ? ' class="disabled"' : ''}>
        <a href="#" aria-label="Next" onclick="nextAuditPage()">
            <span aria-hidden="true">Next &raquo;</span>
        </a>
    </li>
`;
        paginationElementforaudit.innerHTML = paginationHtmlCon;
    }

    // Initialize the table on page load
    renderAuditTable(auditCurrentPage);
}

// Function to change to the previous page
function prevAuditPage() {
    if (auditCurrentPage > 1) {
        auditCurrentPage--;
        renderAuditTable(auditCurrentPage);
    }
}


function nextAuditPage() {
    fetchAuditData().then(data => {
        const totalPagesforaudit = Math.ceil(data.length / auditItemsPerPage);
        if (auditCurrentPage < totalPagesforaudit) {
            auditCurrentPage++;
            renderAuditTable(auditCurrentPage);
        }
    });
}

function changeauditPage(pageNumber) {
    auditCurrentPage = pageNumber; // Set the current page to the clicked page number
    renderAuditTable(auditCurrentPage);
}


// Function to handle Delete button click
function handleauditDelete(objectId) {
    alert(`Delete data with objectId: ${objectId}`);
}

function handleAuditData(objectId) {
    alert(`id data with objectId: ${objectId}`);
}


// end here ******


// Show Invoices
// Global variables
let invoiceCurrentPage = 1;
const invoiceItemsPerPage = 1; // You can change the number of items per page here

// Function to fetch data from API
async function fetchInvoiceData() {
    try {
        const response = await fetch(`https://cleanstation.backendless.app/api/services/Invoice/UserTOInvoice?ID=${objctID}`);
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching invoice data:', error);
        return null;
    }
}

// Function to render the table
async function renderInvoiceTable(page) {
    const data = await fetchInvoiceData();


    if (data.length === 0) {
        // Show the "No rate card for this contact" message if no data is available
        document.getElementById('invoice-table-body').innerHTML = '';
        document.getElementById('invoice-pagination').innerHTML = '';
        document.getElementById('invoice-no-data-message').style.display = 'block';
        return;
    }

    const invoicestartIndex = (page - 1) * invoiceItemsPerPage;
    const invoiceendIndex = invoicestartIndex + invoiceItemsPerPage;
    const paginatedDatainvoice = data.slice(invoicestartIndex, invoiceendIndex);

    document.getElementById('invoice-no-data-message').style.display = 'none';

    const tableBody = document.getElementById('invoice-table-body');
    tableBody.innerHTML = paginatedDatainvoice.map(invoice => {
        const status = invoice.Status;
        // const statusColor = status === 'Completed' ? 'green' : 'red';
        const statusColor = status === 'Completed' ? 'green' : (status === 'Pending' ? 'orange' : 'red');

        return `
             <tr>
                 <td onclick="handleInvoiceData('${invoice.objectId}')">${invoice.Invoice_name}</td>
                 <td style="color: ${statusColor}">${status}</td>
                 <td>${new Date(invoice.created).toLocaleString()}</td>
                 <td>
                     <span class="delete-btn glyphicon glyphicon-trash" onclick="handleInvoiceDelete('${invoice.objectId}')"></span>
                 </td>
             </tr>
         `;
    }).join('');

    renderinvoicePagination(data.length);
}

// Function to render pagination
function renderinvoicePagination(totalItems) {
    const totalPages = Math.ceil(totalItems / invoiceItemsPerPage);
    const paginationElement = document.getElementById('invoice-pagination');

    let paginationHtmlInvoice = `
         <li${invoiceCurrentPage === 1 ? ' class="disabled"' : ''}>
             <a href="#" aria-label="Previous" onclick="prevInvoicePage()">
                 <span aria-hidden="true">&laquo; Previous</span>
             </a>
         </li>
     `;
    for (let i = 1; i <= totalPages; i++) {
        paginationHtmlInvoice += `<li${invoiceCurrentPage === i ? ' class="active"' : ''}><a href="#" onclick="changeInvoicePage(${i})">${i}</a></li>`;
    }
    paginationHtmlInvoice += `
         <li${invoiceCurrentPage === totalPages ? ' class="disabled"' : ''}>
             <a href="#" aria-label="Next" onclick="nextInvoicePage()">
                 <span aria-hidden="true">Next &raquo;</span>
             </a>
         </li>
     `;
    paginationElement.innerHTML = paginationHtmlInvoice;
}





// Function to change to the previous page
function prevInvoicePage() {
    if (invoiceCurrentPage > 1) {
        invoiceCurrentPage--;
        renderInvoiceTable(invoiceCurrentPage);
        renderinvoicePagination(fetchInvoiceData().length); // Pass the totalItems argument here
    }
}
// Function to change to the next page
function nextInvoicePage() {
    const data = fetchInvoiceData();
    data.then(result => {
        const totalPages = Math.ceil(result.length / invoiceItemsPerPage);
        if (invoiceCurrentPage < totalPages) {
            invoiceCurrentPage++;
            renderInvoiceTable(invoiceCurrentPage);
            renderinvoicePagination(result.length);
        }
    }).catch(error => {
        console.error('Error fetching rate data:', error);
    });
}

function changeInvoicePage(pageNumber) {
    invoiceCurrentPage = pageNumber; // Set the current page to the clicked page number
    renderInvoiceTable(invoiceCurrentPage);
}


// Function to handle Delete button click
function handleInvoiceDelete(objectId) {
    Swal.fire({
        icon: "info",
        title: "Are You sure",
        confirmButtonText: "Delete",
        showCancelButton: true,
    }).then((result) => {
        if (result.isConfirmed) {
            // Delete
            // If user confirms the deletion, proceed with the actual deletion
            const invoiceID = {
                objectId: objectId,
            };

            fetch(
                "https://cleanstation.backendless.app/api/services/Invoice/InvoiceDelete",
                {
                    method: "DELETE",
                    body: JSON.stringify(invoiceID),
                    headers: {
                        "Content-type": "application/json; charset=UTF-8",
                    },
                }
            )
                .then((response) => response.json())
                .then((data) => {
                    console.log("API Response for delete:", data);
                    Swal.fire("Success", "Contract Delete SuccessFully", "success");
                    renderInvoiceTable(invoiceCurrentPage);
                })
                .catch((error) => console.error("Error deleting contract:", error));
        }
    });
}

$("#AddInvoiceButton").click(function () {
    $("#UploadInvoiceSection").show();
    $("#InvoiceListSection").hide();
})



// handle click for particular invoice 
function handleInvoiceData(objectId) {
    $("#AuditSection").show();
    $("#InvoiceListSection").hide();
    // get partcular invoice audit detail strat here ******
    showAuditforinvoice(objectId);
    // end here *****************************************

    // create audit for particular invoice 

    $("#CreateNewAuditButton").click(function () {

        let AuditName = $("#Audit-Name").val();
        // let fcObjcetId = localStorage.getItem("selectedContractId");
        const fcObjcetId = localStorage.getItem("selectedContractId");
        console.log("selecctdd", fcObjcetId);
        const auditCardmessage = document.getElementById("auditCardmessage");

        if (
            AuditName !== ""
        ) {
            auditCardmessage.style.display = "hide";

            let auditDetail = {
                Name: AuditName,
                Fulfillment_Contract: {
                    objectId: fcObjcetId
                },
                Invoice: {
                    objectId: objectId
                }
            };

            fetch("https://cleanstation.backendless.app/api/services/Audit/CreateAudit", {
                method: "POST",
                body: JSON.stringify(auditDetail),
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log("doneee", data);
                    let AuditID = data.objectId
                    handleAuditID(AuditID)
                    Swal.fire("Success", "Rate Card created successfully", "success")
                    $("#InvoiceListSection").hide();
                    $("#AuditCreateSection").hide();
                    $("#AuditSection").show();
                })
                .catch((error) => console.error("Error:", error));
        } else {
            auditCardmessage.innerHTML = "Please fill all the required fields.";
            auditCardmessage.style.color = "red";
            auditCardmessage.style.display = "block";
        }
        return false;

    });

    // end here 
    // handle created audit ID 
    function handleAuditID(id) {
        console.log(id);
    }


    // show detail for particular invoice
    $("#InvoiceDetailButton").click(function () {
        $("#InvoiceDetailSection").show();
        $("#AuditSection").hide();
        


            // Global variables
            let currentPage = 1;
            let pageSize = 30; // Default page size
            let offset = 0;
            const maxPaginationLinks = 5; // Maximum number of pagination links to display
        
            // Function to fetch invoice data from the API
            async function fetchInvoiceData(offset, size) {
                const url = `https://cleanstation.backendless.app/api/services/Invoice/IdToInvoiceData?Id=${objectId}&Offset=${offset}&Size=${size}`;
        
                try {
                    const response = await fetch(url);
                    const data = await response.json();
                    console.log("helllooo", data);
                    totalDataCount = data.Count; // Store the total count from the API response
                    return data.Data;
                } catch (error) {
                    console.error('Error fetching data:', error);
                    return [];
                }
            }
        
            // Function to render the table with invoice data
            async function renderInvoiceTable(page) {
                pageSize = parseInt(document.getElementById('pageSizeInput').value);
                offset = parseInt(document.getElementById('offsetInput').value);
                currentPage = page;
                const data = await fetchInvoiceData(offset, pageSize);
        
                const tableBody = document.getElementById('invoice-table-body');
                tableBody.innerHTML = data.map(item => {
                    return `
                           <tr>
                               <td>${item.Client_Code}</td>
                          <td>${item.Reference_No}</td>
                          <td>${item.Order_No}</td>
                          <td>${item.Quantity}</td>
                          <td>${item.Tracking_No}</td>
                          <td>${item.Warehouse}</td>
                          <td>${item.Zip_Code}</td>
                          <td>${item.Zone}</td>
                          <td>${item.Shipping_Service}</td>
                          <td>${item.Create_Date}</td>
                          <td>${item.Datetime}</td>
                          <td>${item.Currency}</td>
                          <td>${item.Country}</td>
        
                          td>${item.Weight_kg}</td>
                          <td>${item.Billing_Size_cm}</td>
                          td>${item.Order_Type}</td>
                          <td>${item.Shipping_Base_Fee}</td>
                          td>${item.Operating_Fee}</td>
                          <td>${item.Fuel_Surcharge}</td>
                          td>${item.Carrier}</td>
                          <td>${item.Additional_Piece}</td>
                          <td>${item.Other_Charges}</td>
                          <td>${item.Total_Charge}</td>
                          
                           </tr>
                       `;
                }).join('');
        
                renderPagination(totalDataCount, pageSize, currentPage);
            }
        
            // Function to render pagination links
            function renderPagination(totalItems, pageSize, currentPage) {
                const totalPages = Math.ceil(totalItems / pageSize);
                const paginationElement = document.getElementById('invoice-pagination');
                let paginationHtml = '';
        
                let startPage = Math.max(1, currentPage - Math.floor(maxPaginationLinks / 2));
                let endPage = Math.min(totalPages, startPage + maxPaginationLinks - 1);
                if (endPage - startPage + 1 < maxPaginationLinks) {
                    startPage = Math.max(1, endPage - maxPaginationLinks + 1);
                }
        
                if (startPage > 1) {
                    paginationHtml += `<li><a href="#" onclick="changePage(1)">First</a></li>`;
                }
        
                if (currentPage > 1) {
                    paginationHtml += `<li><a href="#" onclick="changePage(${currentPage - 1})">Previous</a></li>`;
                }
        
                for (let i = startPage; i <= endPage; i++) {
                    if (i === currentPage) {
                        paginationHtml += `<li class="active"><a href="#" onclick="changePage(${i})">${i}</a></li>`;
                    } else {
                        paginationHtml += `<li><a href="#" onclick="changePage(${i})">${i}</a></li>`;
                    }
                }
        
                if (currentPage < totalPages) {
                    paginationHtml += `<li><a href="#" onclick="changePage(${currentPage + 1})">Next</a></li>`;
                }
        
                if (endPage < totalPages) {
                    paginationHtml += `<li><a href="#" onclick="changePage(${totalPages})">Last</a></li>`;
                }
        
                paginationElement.innerHTML = paginationHtml;
            }
            // Initialize the table on page load
            renderInvoiceTable(currentPage);
        
            // Add event listeners for the "Previous" and "Next" buttons
            document.getElementById('pageSizeInput').addEventListener('change', changePageSize);
        
        // end here 
    })


    // *************************************************************************

    $("#CancelCreateAudit").click(function () {
        $("#AuditSection").show();
        $("#AuditCreateSection").hide();
    })


    // create Audit for particular invoice
    $("#CreateAuditButton").click(function () {
        $("#AuditCreateSection").show();
        $("#AuditSection").hide();

    })

}

// Initialize the table on page load
renderInvoiceTable(invoiceCurrentPage);



// ******************* Uplaod Invoice **********

$("#CancelUploadInvoice").click(function () {
    $("#InvoiceListSection").show();
    $("#UploadInvoiceSection").hide();
})

$(document).ready(function () {
    $("#UploadInvoiceButton").click(function () {


        async function sendInvoiceData(requestData, retries = 5, delay = 2000) {
            try {
                const response = await fetch('https://cleanstation.backendless.app/api/services/Invoice/AddInvoice', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestData),
                });
                const data = await response.json();
                console.log(data); // Handle the response data here
                // Hide the loader on success
                $("#loader").hide();
                Swal.fire("Success", "File uploaded successflly", "success")
                document.getElementById("InvoiceNameInput").value = "";
                renderInvoiceTable(invoiceCurrentPage);
                $("#InvoiceListSection").show();
                $("#UploadInvoiceSection").hide();
            } catch (error) {
                console.error('Error sending data:', error);
                if (retries > 0) {
                    // Retry with exponential backoff
                    setTimeout(() => {
                        sendInvoiceData(requestData, retries - 1, delay * 2);
                    }, delay);
                } else {
                    console.error('Max retries reached. Could not send data.');
                    // Hide the loader on failure
                    $("#loader").hide();
                }
            }
        }

        // Helper function to convert ArrayBuffer to Base64
        function arrayBufferToBase64(buffer) {
            let binary = '';
            let bytes = new Uint8Array(buffer);
            let len = bytes.byteLength;
            for (let i = 0; i < len; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            return btoa(binary);
        }

        $(document).ready(function () {
            $("#UploadInvoiceButton").click(function () {
                let invoiceName = $("#InvoiceNameInput").val();
                let fileInput = document.getElementById('fileInput').files[0];

                if (invoiceName && fileInput) {
                    let fileReader = new FileReader();

                    fileReader.onload = function (event) {
                        let fileBytes = event.target.result;
                        let invoiceData = arrayBufferToBase64(fileBytes);

                        let requestData = {
                            Invoice_name: invoiceName,
                            Invoice_data: invoiceData,
                            User_Id: {
                                objectId: objctID,
                            },
                        };

                        // Show the loader before making the API request
                        $("#loader").show();

                        sendInvoiceData(requestData);
                    };

                    fileReader.readAsArrayBuffer(fileInput);
                }
            });
        });

    });
});


// function for invoice csvs 
  // Function to change to a specific page
  function changePage(pageNumber) {
    currentPage = pageNumber;
    renderInvoiceTable(currentPage);
}

// Function to handle changes in the page size input
function changePageSize() {
    renderInvoiceTable(1); // Reset to the first page when the page size changes
}

// Function to apply filters (page size and offset)
function applyFilters() {
    currentPage = 1; // Reset to the first page when filters are applied
    renderInvoiceTable(currentPage);
}