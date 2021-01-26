
//Scheduler Appoiment JQuery file 

//Waiting list route 
$(function () {
    $.get('/Scheduler/WatingCustomer', function (data) {

        //$("#wc").text(data + '  Customer Waiting');
        // $("#wc").imageUrl(data + "../Images/bullet.png");

        $("#wc").kendoButton({
            imageUrl: "/Images/Timeicon.png"
        });

        $("#text").text(data + ' Customer is Waiting');


    });

    //Scheduler Booking 
    $("#scheduler").kendoScheduler({
        date: new Date(),
        //startTime: new Date("2020/11/25 01:00 AM"),
        //startTime: new Date(),
        height: 600,
        //toolbar: ["pdf", "button"],
        //pdf: {
        //    fileName: "Kendo UI Scheduler Export.pdf",

        //},

        views: [
            "timeline",
            {
                type: "kendo.ui.TimelineNoGap",
                title: "Day",
                adaptiveSlotHeight: true,
                selected: true,
                eventHeight: 80
            },

            {
                type: "timelineWeek",
                title: "Week",
               // selected: true,
            },

            {
                type: "month",
               
            },


            {
                type: "agenda",
                eventTemplate: $("#agenda-template").html()
            }

        ],

        allDayTemplate: $("#allday-event-template").html(),
        eventTemplate: $("#allday-event-template").html(),
        eventTemplate: $("#template_title").html(),
       // eventTemplate: $("#template_title").html(),
        //timezone: "Etc/UTC",
        editable: {
            template: $("#customEditorTemplate").html(),
            confirmation: "Are you sure you want to Cancel Booking Schedule?",
            editable: "popup",

        },

        dataSource: {
           
            type: "aspnetmvc-ajax",
            transport: {
                stringifyDates: true,
                read: {
                    url: "Appointments_Read",
                    dataType: "json",
                },
                create: {
                    url: "Appointments_Create"
                },
                update: {
                    url: "Appointments_Update"
                },
                destroy: {
                    url: "Appointments_Destroy"
                }
            },
            requestEnd: function (e) {

                if (e.type === "create") {

                    this.read();
                    for (var i = 0; i < e.response.Data.length; i++) {
                        if (e.response.Data[i].IsBooked === false) {
                            //alert('Booking Successfull');
                            kendo.alert("Booking Successfull").wrapper.width("30em").find(".k-window-title").html("<b class='custom'>Confirmation</b>");
                        }
                        else {
                           // alert('can not possible duplicate entry.');
                            kendo.alert("Can not possible duplicate entry").wrapper.width("30em").find(".k-window-title").html("<b class='custom'>Confirmation</b>");
                        }
                    }

                }
            },
            schema: {
                data: "Data",
                model: {
                    id: "iD",
                    fields: {
                        "iD": {
                            type: "number",
                            from: "ID"
                        },
                        "title": {
                            type: "string",
                            from: "Title",

                        },
                        "description": {
                            type: "string",
                            from: "Description"
                        },
                        "start": {
                            type: "date",
                            from: "Start"
                        },
                        "end": {
                            type: "date",
                            from: "End"
                        },
                        "customerID": {
                            type: "string",
                            from: "CustomerID"

                        },

                        "bookingID": {
                            type: "string",
                            from: "BookingID",
                            template: "<input name='BookingID' class='k-textbox' value='#: bookingID #' />"
                        },
                        "quantity": {
                            type: "number",
                            from: "Quantity"
                        },
                        "status": {
                            type: "string",
                            from: "Status"
                        },
                        "isAllDay": {
                            type: "boolean",
                            from: "IsAllDay"
                        },
                        "startTimeZone": {
                            type: "string",
                            from: "StartTimeZone"
                        },
                        "endTimeZone": {
                            type: "string",
                            from: "EndTimeZone"
                        },
                        "recurrenceRule": {
                            type: "string",
                            from: "RecurrenceRule"
                        },
                        "recurrenceException": {
                            type: "string",
                            from: "RecurrenceException"
                        }
                    }
                }
            }
        },
        group: {
            resources: ["Rooms", "Employees"],
            orientation: "vertical"
        },

        edit: function (e) {
            var buttondelete = e.container.find(".k-scheduler-delete");
            buttondelete.text("Cancel Booking");
            $('.k-window-title').text("Booking Event");

        },



        resources: [
            {
                field: "RoomID",
                name: "Rooms",
                dataSource: [
                    { text: "Room 101", value: 1, color: "#6eb3fa" },
                    { text: "Room 102", value: 2, color: "#f58a8a" },
                    { text: "Room 103", value: 3, color: "#8a8af5" }
                ],
                title: "Room"
            },

            {
                field: "EmployeeID",
                name: "Employees",
                dataSource: [
                    { text: " ", value: 1, color: "#6eb3fa" },
                    { text: " ", value: 2, color: "#f58a8a" },
                    { text: " ", value: 3, color: "#8a8af5" }
                ],
                title: "Employee"
            },
        ]

    });

    //Side Calendar
    $(document).ready(function () {
        // create Calendar from div HTML element
        var scheduler = $("#scheduler").data("kendoScheduler");
        $("#calendar").kendoCalendar({
            value: scheduler.date(),
            change: function () {
                scheduler.date(this.value());
            }
        });

    });
   


    $("#scheduler").kendoTooltip({
        filter: ".k-event:not(.k-event-drag-hint)",
        position: "top",
        width: 250,
        content: kendo.template($('#template').html())
    });

    // Waiting List Button
    $("#create").click(function () {
        $("#scheduler").data("kendoScheduler").addEvent({
            start: new Date(),
            end: new Date()
        });
    });
});

//Customer name Autocomplete
function OnAddAuto() {
    text: $("#CustomerName").val()
}

//Select customer name get customer id 
function selectCustomerid(e) {
    //debugger;
    var DataItem = this.dataItem(e.item);
    var id = DataItem.ID;
    $("[name='CustomerID']").val(id);
    $("[name='CustomerID']").change();
}
//checking start time and end time "cannot duplicate time"
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

//Booking ID get 
function onChangeMyTextBox() {

    $.get('/Scheduler/Template_Getbookingid', function (data) {
        text: $("#Booking").val()
        $("#BookingID").val(data);
        $("[data-bind='value:bookingID']").val(data);
        $("[name='BookingID']").change();

    });

}



//Customized TimelineView Row 
    (function ($, undefined) {
        var kendo = window.kendo,
            ui = kendo.ui,
            TimelineView = ui.TimelineView,
            extend = $.extend,
            NS = ".kendoToDoView";



        var TimelineNoGap = TimelineView.extend({

        name: "TimelineNoGap",

          options: {
        title: "Custom Timeline"
          },
          _getBottomRowOffset: function() {
          	return 0;
          }

        })

        //extend UI
        extend(true, ui, {
        TimelineNoGap: TimelineNoGap
        });

      })(window.kendo.jQuery);





