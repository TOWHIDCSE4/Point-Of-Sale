//Load Data in Table when documents is ready  
$(document).ready(function () {  
    loadData();  
});  
  
//Load Data function  
function loadData() {  
    $.ajax({  
        url: "/Home/List",  
        type: "GET",  
        contentType: "application/json;charset=utf-8",  
        dataType: "json",  
        success: function (result) {  
            var html = '';  
            $.each(result, function (key, item) {  
                html += '<tr>';  
                html += '<td>' + item.CustomerCode + '</td>';  
                html += '<td>' + item.Name + '</td>';  
                html += '<td>' + item.Province + '</td>';  
                html += '<td>' + item.PhoneNumber1 + '</td>';  
                html += '<td>' + item.Address + '</td>';  
                html += '<td><a href="#" onclick="return getbyID(' + item.EmployeeID + ')">Edit</a> | <a href="#" onclick="Delele(' + item.EmployeeID + ')">Delete</a></td>';  
                html += '</tr>';  
            });  
            $('.tbody').html(html);  
        },  
        error: function (errormessage) {  
            alert(errormessage.responseText);  
        }  
    });  
}  
  
//Add Data Function   
function Add() {  
    var res = validate();  
    if (res == false) {  
        return false;  
    }  
    var empObj = {  
        ID: $('#ID').val(),  
        CustomerCode: $('#CustomerCode').val(),  
        Name: $('#Name').val(),  
        Province: $('#Province').val(),  
        PhoneNumber1: $('#PhoneNumber1').val(),
        PhoneNumber2: $('#PhoneNumber2').val(), 
        Address1: $('#Address1').val(), 
        Address2: $('#Address2').val(), 
        DateOfBirth: $('#DateOfBirth').val(), 
        Email: $('#Email').val(), 
        Company: $('#Company').val(), 
        Department: $('#Department').val(), 
        Gender: $('#Gender').val,
        CurrentDebt: $('#CurrentDebt').val(),
        BonusPoint: $('#BonusPoint').val(),
        TaxCode: $('#TaxCode').val(),
        ManagedBy: $('#ManagedBy').val(),
        Group: $('#Group').val(),
        Image: $('#Image').val()  

    };  
    $.ajax({  
        url: "/Home/Add",  
        data: JSON.stringify(empObj),  
        type: "POST",  
        contentType: "application/json;charset=utf-8",  
        dataType: "json",  
        success: function (result) {  
            loadData();  
            $('#myModal').modal('hide');  
        },  
        error: function (errormessage) {  
            alert(errormessage.responseText);  
        }  
    });  
}  
  
//Function for getting the Data Based upon Employee ID  
function getbyID(ID) {  
    $('#Name').css('border-color', 'lightgrey');  
    $('#CustomerCode').css('border-color', 'lightgrey');  
    $('#PhoneNumber1').css('border-color', 'lightgrey');  
    $('#Address1').css('border-color', 'lightgrey');  
    $('#PhoneNumber2').css('border-color', 'lightgrey');  
    $('#Address2').css('border-color', 'lightgrey');  
    $('#DateOfBirth').css('border-color', 'lightgrey');  
    $('#Email').css('border-color', 'lightgrey');  
    $('#Company').css('border-color', 'lightgrey');  
    $('#Department').css('border-color', 'lightgrey');  
    $('#Gender').css('border-color', 'lightgrey');
    $('#CurrentDebt').css('border-color', 'lightgrey');
    $('#BonusPoint').css('border-color', 'lightgrey'); 
    $('#TaxCode').css('border-color', 'lightgrey');
    $('#ManagedBy').css('border-color', 'lightgrey');  
    $('#Group').css('border-color', 'lightgrey');  

    $.ajax({  
        url: "/Home/getbyID/" + ID,  
        typr: "GET",  
        contentType: "application/json;charset=UTF-8",  
        dataType: "json",  
        success: function (result) {  
            $('#ID').val(result.ID);  
            $('#Name').val(result.Name);  
            $('#CustomerCode').val(result.CustomerCode);  
            $('#PhoneNumber1').val(result.PhoneNumber1);  
            $('#Address1').val(result.Address1);  
            $('#PhoneNumber2').val(result.PhoneNumber2);
            $('#Address2').val(result.Address2);
            $('#DateOfBirth').val(result.DateOfBirth);
            $('#Email').val(result.Email);
            $('#Company').val(result.Company); 
            $('#Department').val(result.Department);
            $('#Gender').val(result.Gender);
            $('#CurrentDebt').val(result.CurrentDebt);
            $('#BonusPoint').val(result.BonusPoint);
            $('#TaxCode').val(result.TaxCode);  
            $('#ManagedBy').val(result.ManagedBy);
            $('#Group').val(result.Group); 

            $('#myModal').modal('show');  
            $('#btnUpdate').show();  
            $('#btnAdd').hide();  
        },  
        error: function (errormessage) {  
            alert(errormessage.responseText);  
        }  
    });  
    return false;  
}  
  
//function for updating employee's record  
function Update() {  
    var res = validate();  
    if (res == false) {  
        return false;  
    }  
    var empObj = {  
        ID: $('#ID').val(),
        CustomerCode: $('#CustomerCode').val(),
        Name: $('#Name').val(),
        Province: $('#Province').val(),
        PhoneNumber1: $('#PhoneNumber1').val(),
        PhoneNumber2: $('#PhoneNumber2').val(),
        Address1: $('#Address1').val(),
        Address2: $('#Address2').val(),
        DateOfBirth: $('#DateOfBirth').val(),
        Email: $('#Email').val(),
        Company: $('#Company').val(),
        Department: $('#Department').val(),
        Gender: $('#Gender').val,
        CurrentDebt: $('#CurrentDebt').val(),
        BonusPoint: $('#BonusPoint').val(),
        TaxCode: $('#TaxCode').val(),
        ManagedBy: $('#ManagedBy').val(),
        Group: $('#Group').val(),
        Image: $('#Image').val()  
    };  
    $.ajax({  
        url: "/Home/Update",  
        data: JSON.stringify(empObj),  
        type: "POST",  
        contentType: "application/json;charset=utf-8",  
        dataType: "json",  
        success: function (result) {  
            loadData();  
            $('#myModal').modal('hide');  
            //$('#EmployeeID').val("");  
            //$('#Name').val("");  
            //$('#Age').val("");  
            //$('#State').val("");  
            //$('#Country').val("");
            $('#ID').val("");
            $('#Name').val("");
            $('#CustomerCode').val("");
            $('#PhoneNumber1').val("");
            $('#Address1').val("");
            $('#PhoneNumber2').val("");
            $('#Address2').val("");
            $('#DateOfBirth').val("");
            $('#Email').val("");
            $('#Company').val("");
            $('#Department').val("");
            $('#Gender').val("");
            $('#CurrentDebt').val("");
            $('#BonusPoint').val("");
            $('#TaxCode').val("");
            $('#ManagedBy').val("");
            $('#Group').val(""); 
        },  
        error: function (errormessage) {  
            alert(errormessage.responseText);  
        }  
    });  
}  
  
//function for deleting employee's record  
function Delele(ID) {  
    var ans = confirm("Are you sure you want to delete this Record?");  
    if (ans) {  
        $.ajax({  
            url: "/Home/Delete/" + ID,  
            type: "POST",  
            contentType: "application/json;charset=UTF-8",  
            dataType: "json",  
            success: function (result) {  
                loadData();  
            },  
            error: function (errormessage) {  
                alert(errormessage.responseText);  
            }  
        });  
    }  
}  
  
//Function for clearing the textboxes  
function clearTextBox() {  
   // $('#ID').val("");
    $('#Name').val("");
    $('#CustomerCode').val("");
    $('#PhoneNumber1').val("");
    $('#Address1').val("");
    $('#PhoneNumber2').val("");
    $('#Address2').val("");
    $('#DateOfBirth').val("");
    $('#Email').val("");
    $('#Company').val("");
    $('#Department').val("");
    $('#Gender').val("");
    $('#CurrentDebt').val("");
    $('#BonusPoint').val("");
    $('#TaxCode').val("");
    $('#ManagedBy').val("");
    $('#Group').val(""); 


    $('#btnUpdate').hide();  
    $('#btnAdd').show();  

    $('#Name').css('border-color', 'lightgrey');
    $('#CustomerCode').css('border-color', 'lightgrey');
    $('#PhoneNumber1').css('border-color', 'lightgrey');
    $('#Address1').css('border-color', 'lightgrey');
    $('#PhoneNumber2').css('border-color', 'lightgrey');
    $('#Address2').css('border-color', 'lightgrey');
    $('#DateOfBirth').css('border-color', 'lightgrey');
    $('#Email').css('border-color', 'lightgrey');
    $('#Company').css('border-color', 'lightgrey');
    $('#Department').css('border-color', 'lightgrey');
    $('#Gender').css('border-color', 'lightgrey');
    $('#CurrentDebt').css('border-color', 'lightgrey');
    $('#BonusPoint').css('border-color', 'lightgrey');
    $('#TaxCode').css('border-color', 'lightgrey');
    $('#ManagedBy').css('border-color', 'lightgrey');
    $('#Group').css('border-color', 'lightgrey');  
}  
//Valdidation using jquery  
function validate() {  
    var isValid = true;  
    if ($('#Name').val().trim() == "") {  
        $('#Name').css('border-color', 'Red');  
        isValid = false;  
    }  
    else {  
        $('#Name').css('border-color', 'lightgrey');  
    }  


    if ($('#CustomerCode').val().trim() == "") {  
        $('#CustomerCode').css('border-color', 'Red');  
        isValid = false;  
    }  
    else {  
        $('#CustomerCode').css('border-color', 'lightgrey');  
    }  


    if ($('#PhoneNumber1').val().trim() == "") {  
        $('#PhoneNumber1').css('border-color', 'Red');  
        isValid = false;  
    }  
    else {  
        $('#PhoneNumber1').css('border-color', 'lightgrey');  
    }  

    if ($('#PhoneNumber2').val().trim() == "") {
        $('#PhoneNumber2').css('border-color', 'Red');
        isValid = false;
    }
    else {
        $('#PhoneNumber2').css('border-color', 'lightgrey');
    }  

    if ($('#Address1').val().trim() == "") {
        $('#Address1').css('border-color', 'Red');
        isValid = false;
    }
    else {
        $('#Address1').css('border-color', 'lightgrey');
    } 

    if ($('#Address2').val().trim() == "") {
        $('#Address2').css('border-color', 'Red');
        isValid = false;
    }
    else {
        $('#Address2').css('border-color', 'lightgrey');
    } 

    if ($('#DateOfBirth').val().trim() == "") {
        $('#DateOfBirth').css('border-color', 'Red');
        isValid = false;
    }
    else {
        $('#DateOfBirth').css('border-color', 'lightgrey');
    } 

    if ($('#Email').val().trim() == "") {
        $('#Email').css('border-color', 'Red');
        isValid = false;
    }
    else {
        $('#Email').css('border-color', 'lightgrey');
    } 

    if ($('#Company').val().trim() == "") {
        $('#Company').css('border-color', 'Red');
        isValid = false;
    }
    else {
        $('#Company').css('border-color', 'lightgrey');
    } 


    if ($('#Department').val().trim() == "") {
        $('#Department').css('border-color', 'Red');
        isValid = false;
    }
    else {
        $('#Department').css('border-color', 'lightgrey');
    } 


    if ($('#Gender').val().trim() == "") {
        $('#Gender').css('border-color', 'Red');
        isValid = false;
    }
    else {
        $('#Gender').css('border-color', 'lightgrey');
    } 


    if ($('#CurrentDebt').val().trim() == "") {
        $('#CurrentDebt').css('border-color', 'Red');
        isValid = false;
    }
    else {
        $('#CurrentDebt').css('border-color', 'lightgrey');
    } 


    if ($('#BonusPoint').val().trim() == "") {
        $('#BonusPoint').css('border-color', 'Red');
        isValid = false;
    }
    else {
        $('#BonusPoint').css('border-color', 'lightgrey');
    } 

    if ($('#TaxCode').val().trim() == "") {
        $('#TaxCode').css('border-color', 'Red');
        isValid = false;
    }
    else {
        $('#TaxCode').css('border-color', 'lightgrey');
    } 

    if ($('#ManagedBy').val().trim() == "") {
        $('#ManagedBy').css('border-color', 'Red');
        isValid = false;
    }
    else {
        $('#ManagedBy').css('border-color', 'lightgrey');
    } 


    if ($('#Group').val().trim() == "") {  
        $('#Group').css('border-color', 'Red');  
        isValid = false;  
    }  
    else {  
        $('#Group').css('border-color', 'lightgrey');  
    }  
    return isValid;  
}  