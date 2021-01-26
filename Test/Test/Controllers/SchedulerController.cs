﻿using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Runtime.InteropServices;
using System.Web;
using System.Web.Mvc;
using Kendo.Mvc.Extensions;
using Kendo.Mvc.UI;
using Telerik.Windows.Documents.Spreadsheet.Expressions.Functions;
using Test.Models;

namespace Test.Controllers
{
    public class SchedulerController : Controller
    {
        private KendoTestEntities db = new KendoTestEntities();

        public ActionResult Index()
        {
            return View();
        }

        //public ActionResult Pdf_Export_Save(string contentType, string base64, string fileName)
        //{
        //    var fileContents = Convert.FromBase64String(base64);
        //    return File(fileContents, contentType, fileName);
        //}


        //public ActionResult Appointments_Read([DataSourceRequest] DataSourceRequest request)
        //{

        //    var Appointment = new KendoTestEntities().Appointments.Select(Appointments => new AppointmentViewModel
        //    {
        //        ID = Appointments.ID,
        //        Title = Appointments.Customer.Name,
        //        RoomID = Appointments.RoomID, 



        //    }).ToList();

        //    return Json(Appointment,JsonRequestBehavior.AllowGet);

        //   // return Json(Data.ToDataSourceResult(request));
        //}
        //
        public ActionResult Appointments_Read([DataSourceRequest] DataSourceRequest request)

        {

            var Appointment = db.Appointments.Where(x=>x.Status=="booking").Select(x => new AppointmentViewModel
            {
                ID = x.ID,
                Title = x.Title,
                Description = x.Description,
                Start = x.Start,
                End = x.End,
                RoomID = x.RoomID,
                BookingID = x.BookingID,
                Quantity = x.Quantity,
                Status = x.Status,
                IsAllDay = x.IsAllDay,
                StartTimezone = x.StartTimeZone,
                EndTimezone = x.EndTimeZone,
                RecurrenceRule = x.RecurrenceRule,
                RecurrenceException = x.RecurrenceException,
                RoomNumber = x.Room.RoomNumber,
                PhoneNumber1 = x.Customer.PhoneNumber1,
                EmployeeID = x.EmployeeID,
                CustomerID = x.CustomerID
            }).ToList();


            return Json(Appointment.OrderByDescending(x => x.ID).ToDataSourceResult(request), JsonRequestBehavior.AllowGet);

        }
        public virtual JsonResult Appointments_Create([DataSourceRequest] DataSourceRequest request, AppointmentViewModel appointment)
        {
       

                if (string.IsNullOrEmpty(appointment.Title))
                {
                    appointment.Title = "";
                }

                string status = "booking";
                if (appointment.RoomID == null)
                {
                    status = "waiting";
                }
                Customer C = new Customer();
                var entity = appointment.ToEntity();
                C = db.Customers.Where(x => x.ID == appointment.CustomerID).FirstOrDefault();
            var isbooking = db.Appointments.Where(x => x.RoomID == appointment.RoomID)
                                       .Any(s => (s.Start >= appointment.Start && s.End <= appointment.End)
                                         || (s.End <= appointment.End && s.End >= appointment.Start));
            if (C != null && !isbooking)
            {
                    C.Name = appointment.Title;
                    entity.Status = status;
                    db.Appointments.Add(entity);
                    db.Entry(C).State = EntityState.Modified;
                    db.SaveChanges();
                    appointment.ID = entity.ID;
                }


            appointment.IsBooked = isbooking;

            return Json(new[] { appointment }.ToDataSourceResult(request, ModelState) ,JsonRequestBehavior.AllowGet);
        }
        public virtual JsonResult Appointments_Update([DataSourceRequest] DataSourceRequest request, AppointmentViewModel appointment)
        {
            if (string.IsNullOrEmpty(appointment.Title))
            {
                appointment.Title = "";
            }

            string status = "booking";
            if (appointment.RoomID == null)
            {
                status = "waiting";
            }
            Customer C = new Customer();
            var entity = appointment.ToEntity();
            entity.Status = status;

            var appointments = db.Appointments.Where(x => x.ID == appointment.ID).FirstOrDefault();
            C = db.Customers.Where(x => x.ID == appointment.CustomerID).FirstOrDefault();
            var isbooking = db.Appointments.Where(x => x.RoomID == appointment.RoomID)
                               .Any(s => (s.Start >= appointment.Start && s.End <= appointment.End)
                                 || (s.End <= appointment.End && s.End >= appointment.Start));

            if (C != null)
            {
                C.Name = appointment.Title;
                if (appointments != null)
                {
                    db.Entry(appointments).State = EntityState.Detached;
                }

                // appointments = entity;

                db.Entry(entity).State = EntityState.Modified;
                db.Entry(C).State = EntityState.Modified;
                db.SaveChanges();
                appointment.ID = entity.ID;
            }


            appointment.IsBooked = isbooking;
            //   }

            return Json(new[] { appointment }.ToDataSourceResult(request, ModelState), JsonRequestBehavior.AllowGet);
        }
        public virtual JsonResult Appointments_Destroy([DataSourceRequest] DataSourceRequest request, AppointmentViewModel appointment)
        {
            if (ModelState.IsValid)
            {
                var entity = appointment.ToEntity();
                var a = db.Appointments.Where(x => x.ID == appointment.ID).FirstOrDefault();
                if (a!=null)
                {
                    a.Status = "cancelled";
                    
                    db.Entry(a).State = EntityState.Modified;
                    db.SaveChanges();
                }
            }

            return Json(new[] { appointment }.ToDataSourceResult(request, ModelState),JsonRequestBehavior.AllowGet);
        }

        public JsonResult Template_GetCustomers()
        {
            var Appointment = new KendoTestEntities().Customers.Select(x => new AppointmentViewModel
            {
                ID = x.ID,
                Title = x.Name
               
            });

            return Json(Appointment,JsonRequestBehavior.AllowGet);
        }
        public JsonResult Template_Getbookingid()
        {
            int bookingid;
            string finalbookingid;
            string booking="B101";
            var maxid = db.Appointments.Max(x => x.ID);
            var bookingidtext = db.Appointments.Where(x => x.ID == maxid).Select(x => x.BookingID).FirstOrDefault();
             bookingidtext = bookingidtext.Remove(0, 4);
             bookingid = System.Convert.ToInt32(bookingidtext)+1;
            finalbookingid = booking + bookingid.ToString();

            return Json(finalbookingid, JsonRequestBehavior.AllowGet);
        }

        //Waiting List cout Action 
        public JsonResult WatingCustomer()
        {
            var watinglist = db.Appointments.Where(x => x.Status == "waiting").ToList();
            return Json(watinglist.Count(), JsonRequestBehavior.AllowGet);
        }

        //Waiting List Action route .
        public ActionResult Waiting_Read([DataSourceRequest] DataSourceRequest request)

        {

            var Appointment = db.Appointments.Where(x => x.Status == "waiting").Select(x => new AppointmentViewModel
            {
                ID = x.ID,
                Title = x.Title,
                Description = x.Description,
                Start = x.Start,
                End = x.End,
                RoomID = x.RoomID,
                BookingID = x.BookingID,
                Quantity = x.Quantity,
                Status = x.Status,
                IsAllDay = x.IsAllDay,
                StartTimezone = x.StartTimeZone,
                EndTimezone = x.EndTimeZone,
                RecurrenceRule = x.RecurrenceRule,
                RecurrenceException = x.RecurrenceException,
                RoomNumber = x.Room.RoomNumber,
                PhoneNumber1 = x.Customer.PhoneNumber1,
                EmployeeID=x.EmployeeID,
                CustomerID=x.CustomerID

            }).ToList();

            return Json(Appointment.ToDataSourceResult(request), JsonRequestBehavior.AllowGet);

        }

        protected override void Dispose(bool disposing)
        {
            db.Dispose();
            base.Dispose(disposing);
        }
    }
}