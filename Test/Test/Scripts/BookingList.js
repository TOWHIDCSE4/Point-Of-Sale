//Booking List Angular js 
angular.module("KendoDemos", ["kendo.directives"])
    .controller("MyCtrl", function ($scope) {
        var models;
        $scope.mainGridOptions = {
            dataSource: {
               // timezone: "Etc/UTC",
                type: 'application/json;charset=UTF-8',
                transport: {
                    read: {
                        url: "/Booking/Appointments_Read",
                        dataType: "json",
                    },
                    create: {

                        url: "/Booking/Appointments_Create",
                        type: "POST",
                        contentType: 'application/json; charset=utf-8',
                        dataType: "json",
                    },
                    update: {
                        url: "/Booking/Appointments_Update",
                        type: "POST",
                        contentType: 'application/json; charset=utf-8',
                        dataType: "json",
                    },

                    destroy: {
                        url: "/Booking/Appointments_Destroy",
                        type: "POST",
                        contentType: 'application/json; charset=utf-8',
                        dataType: "json",
                    },

                    parameterMap: function (options, operation) {

                        if (operation !== "read") {
                            var e;
                            var ri;
                            var rn;
                            var status;
                            //var s = options.title.Title;
                            //var cid = options.title.ID;
                           
                            if (options.RoomID !== 0) {
                                ri = options.RoomID;
                                rn = options.RoomNumber;
                                status = "booking";
                            }
                            else {
                              
                                ri = null;
                                rn = '';
                                status = "waitting";
                               
                            }

                            var appointment = {
                                ID: options.ID,
                                Title: options.Title,
                                Description: options.Description,
                                Start: options.Start,
                                End: options.End,
                                BookingID: options.BookingID,
                                Quantity: options.Quantity,
                                CustomerID: options.CustomerID,
                                RoomID: ri,
                                Status: status,
                                RoomNumber: rn,

                                IsAllDay: options.IsAllDay,
                                StartTimeZone: '',
                                EndTimeZone: '',
                                RecurrenceRule: options.RecurrenceRule,
                                EmployeeID: options.EmployeeID
                            }

                            return kendo.stringify(appointment);

                        }


                    }

                },
                schema: {
                    data: "Data",
                    total: function (data) { return data.Data.length; },
                    model: {
                        id: "ID",
                        fields: {
                            ID: { type: "number" },
                            Title: { type: "string" },
                            Description: { type: "string" },
                            Start: { type: "date" },
                            End: { type: "date" },
                            BookingID: { type: "string" },
                            Quantity: { type: "number" },
                            RoomNumber: { type: "string" },
                            Status: { type: "string"},
                            IsAllDay: { type: "boolean" },
                            EmployeeID: { type: "number" },
                            RoomID: { type: "number" },
                            StartTimeZone: { type: "string" },
                            EndTimeZone: { type: "string" },
                            RecurrenceRule: { type: "string" },
                            RecurrenceException: { visible: false, editable: false, type: "string" }
                        }
                    },
                    //parse: function (response) {
                    //    debugger;
                    //    //console.log("parse");
                    //    //console.log(JSON.stringify(response));
                       
                    //    //return response.people;
                    //}
                },
                requestEnd: function (e) {

                    if (e.type === "create") {
                       
                        this.read();
                        for (var i = 0; i < e.response.Data.length; i++) {
                            if (e.response.Data[i].IsBooked === false) {
                                // alert('Booking Successfull');
                                kendo.alert("Booking Successfull").wrapper.width("30em").find(".k-window-title").html("<b class='custom'>Confirmation</b>");

                            }
                            else {
                              // alert('can not possible duplicate entry.');
                                kendo.alert("Can not possible duplicate entry").wrapper.width("30em").find(".k-window-title").html("<b class='custom'>Confirmation</b>");
                                
                            }
                        }

                    }
                },
               // pageSize: 5,
                serverPaging: true,
                serverSorting: true
            },
            sortable: true,
            pageable: true,
            pageable: {
                pageSizes: [5, 10, 15, 20, 25, 50]
            },
            change: function (e) {
                $scope.pageSize = $scope.mainGridOptions.dataSource.pageSize();
            },
            pageSize: $scope.pageSize,

            toolbar: [{ name: "create", text: "BOOKING", imageClass: "btn", className: "fa fa-calendar", iconClass: "fa fa-calendar" }],
            height:600,
            dataBound: function () {
                this.expandRow(this.tbody.find("tr.k-master-row").first());
            },

            columns: [
                { field: "BookingID" },
                { field: "Start", template: '#= kendo.toString(Start,"yyyy/MM/dd hh:mm tt") #' },
                { field: "Title", title: "Customer Name" },
                { field: "PhoneNumber1", title: "Phone" },
                { field: "RoomNumber", title: "Room/Table" },
                { field: "Quantity" },
                { field: "Description" },
                //{ field: "Status" },
                { field: "Status", title: "Status", template: '#=SetColor(Status)#' },
                { command: ["edit", "destroy"], width: 180 }
              

            ],

            //Hide Edit Button 
            dataBound: function () {
                var grid = this;
                var trs = this.tbody.find('tr').each(function () {
                    var item = grid.dataItem($(this));
                    if (item.Status == "cancelled") {
                        $(this).find('.k-grid-edit').hide();
                    }
                });
            },
           

            editable: {
                mode: "popup",
                confirmation: "Do you really really really want to do this?",
                template: kendo.template($("#customEditorTemplate").html())

            },
            edit: function (e) {
               
                //Change window title
                if (e.model.isNew())// If the new record is being added
                {
                    $(".k-window-title").text("Add New Record");
                    e.container.find('.hide-on-new').hide();
                    $(".k-grid-update").text("Save");


                }
                else// If the record is being edited
                {
                    $(".k-window-title").text("Edit Record");
                    //hide all the elements with class "hide-on-edit" on edit
                    e.container.find('.hide-on-new').show();
                    $(".k-grid-update").text("Update");
                }
            },
        };


    })


//Checking start time and end time Alrady Booked
function ondropdownchange(value) {
    var Start = $("[name='Start']").val();
    var End = $("[name='End']").val();
    $.get('/Booking/GetBookingStatus', {
        RoomId: value,
        start: Start,
        end: End
    }).then(
        function (data) {
            if (data === true) {
                alert('Alrady Booked')
               // 
            }
        },
        function (errorResponse) {
            // handle errors here
        });

}

//BookingID Automatic get 
function onChangeMyTextBox() {

    $.get('/Scheduler/Template_Getbookingid', function (data) {

        $("[name='BookingID']").val(data);
        $("[name='BookingID']").change();

    });

}
//Customer Name Autocomplte 
function OnAddAuto() {
    text: $("#Title").val()

}

//Select Customer Name get customer id 
function selectCustomerid(e) {

    var DataItem = this.dataItem(e.item);
    var id = DataItem.ID;
    $("[name='CustomerID']").val(id);
    $("[name='CustomerID']").change();
}


//Cancelled Booking  
function cancellbuttonclick() {

    var BookingID = $("[name='BookingID']").val();
    if (confirm('Are you sure you want to cancelled booking?')) {
        $.get('/Booking/BookingStatusChange', {
            BookingId: BookingID,

        }).then(
            function (data) {

                if (data === 'cancelled') {
                   // alert('cancelled successfully')
                    window.location.href = "http://localhost:65133/Booking/Index";
                    return false;
                }

            },
            function (errorResponse) {
                // handle errors here  
            });
     } else {
        // Do nothing!
        console.log('Wrong.');
    }



}


//Status text color 
function SetColor(Status) {
    if (Status == "cancelled")
        return "<font color=\"red\">" + Status + "</font>";
    else if (Status == "booking")
        return "<font color=\"green\">" + Status + "</font>";
    else (Status == "waiting")
    return "<font color=\"blue\">" + Status + "</font>";

}



