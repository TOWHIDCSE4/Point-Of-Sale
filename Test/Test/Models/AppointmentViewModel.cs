﻿using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using Kendo.Mvc.Extensions;
using Kendo.Mvc.UI;
using Test.Models;

namespace Test.Controllers
{
    public class AppointmentViewModel: ISchedulerEvent
    {
        public AppointmentViewModel()
        {
        }

        public AppointmentViewModel(Appointment appointment)
        {
            ID = appointment.ID;
            Title = appointment.Customer.Name;
            //Start = DateTime.SpecifyKind(appointment.Start, DateTimeKind.Utc);
            //End = DateTime.SpecifyKind(appointment.End, DateTimeKind.Utc);
            Start = appointment.Start;
            End = appointment.End;
            StartTimezone = appointment.StartTimeZone;
            EndTimezone = appointment.EndTimeZone;
            Description = appointment.Description;
            IsAllDay = appointment.IsAllDay;
            RecurrenceRule = appointment.RecurrenceRule;
            RecurrenceException = appointment.RecurrenceException;
            RecurrenceID = appointment.RecurrenceID;
            RoomID = appointment.RoomID;
            EmployeeID = appointment.EmployeeID;
            CustomerID = appointment.Customer.ID;
            BookingID = appointment.BookingID;
            Quantity = appointment.Quantity;
            Status = appointment.Status;
            RoomNumber = appointment.Room.RoomNumber;
            PhoneNumber1 = appointment.Customer.PhoneNumber1;


        }

        public int ID { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }

        private DateTime start;
        public DateTime Start { get; set; }
        //{
        //    get
        //    {
        //        return start;
        //    }
        //    set
        //    {
        //        start = value.ToUniversalTime();
        //    }
        //}

        private DateTime end;
        public DateTime End { get; set; }
        //{
        //    get
        //    {
        //        return end;
        //    }
        //    set
        //    {
        //        end = value.ToUniversalTime();
        //    }
        //}

        public string StartTimezone { get; set; }
        public string EndTimezone { get; set; }
       
        public string RecurrenceRule { get; set; }
        public int? RecurrenceID { get; set; }
        public string RecurrenceException { get; set; }
        public bool IsAllDay { get; set; }
        public int? RoomID { get; set; }
        public int? EmployeeID { get; set; }
        public int? CustomerID { get; set; }
        public int? Quantity { get; set; }
        public int? PhoneNumber1 { get; set; }
        public string BookingID { get; set; }
        public string RoomNumber { get; set; }

        public string Status { get; set; }
        public bool IsBooked { get; set; }
        public Appointment ToEntity()
        {
            return new Appointment
            {
                ID = ID,
                Title = Title,
                Start = Start,
                End = End,
                StartTimeZone = StartTimezone,
                EndTimeZone = EndTimezone,
                Description = Description,
                IsAllDay = IsAllDay,
                RecurrenceRule = RecurrenceRule,
                RecurrenceException = RecurrenceException,
                RecurrenceID = RecurrenceID,
                RoomID = RoomID,
                EmployeeID = EmployeeID,
                CustomerID = CustomerID,
                Quantity = Quantity,
                BookingID = BookingID,
                Status = Status,
                //RoomNumber= RoomNumber,

            };
        }
    }
}
