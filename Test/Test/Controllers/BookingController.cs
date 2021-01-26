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
    public class BookingController : Controller
    {
        private KendoTestEntities db = new KendoTestEntities();

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Appointments_Read([DataSourceRequest]DataSourceRequest request)
        
        {

            var Appointment = db.Appointments.Select(x => new AppointmentViewModel
            {
                ID = x.ID,
                Title = x.Title,
                Description = x.Description,
                Start = x.Start,
                End = x.End,
                RoomID = x.RoomID??0,
                BookingID = x.BookingID,
                Quantity = x.Quantity,
                Status = x.Status,
                IsAllDay = x.IsAllDay,
                StartTimezone = x.StartTimeZone,
                EndTimezone = x.EndTimeZone,
                RecurrenceRule = x.RecurrenceRule,
                RecurrenceException = x.RecurrenceException,
                RoomNumber=x.Room.RoomNumber,
                PhoneNumber1=x.Customer.PhoneNumber1,
               EmployeeID=x.EmployeeID,
               CustomerID=x.CustomerID
            }).ToList();
          

            return Json(Appointment.OrderByDescending(x=>x.ID).ToDataSourceResult(request), JsonRequestBehavior.AllowGet);
       
        }


        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Appointments_Create([DataSourceRequest] DataSourceRequest request, AppointmentViewModel appointment)
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
                var isbooking = db.Appointments.Where(x => x.RoomID == appointment.RoomID && x.Status != "cancelled")
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

            // }

            return Json(new[] { appointment }.ToDataSourceResult(request, ModelState), JsonRequestBehavior.AllowGet);
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Appointments_Update([DataSourceRequest] DataSourceRequest request, AppointmentViewModel appointment)
        {

            //if (ModelState.IsValid)
            //{



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

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Appointments_Destroy([DataSourceRequest] DataSourceRequest request, AppointmentViewModel appointment)
        {
            var a = db.Appointments.Find(appointment.ID);
            if (a != null)
            {
                db.Appointments.Remove(a);
                db.SaveChanges();
            }

            return Json(new[] { appointment }.ToDataSourceResult(request, ModelState), JsonRequestBehavior.AllowGet);
        }
        [HttpGet]
        public JsonResult BookingStatusChange(string BookingId)
        {


            var entity = db.Appointments.Where(x => x.BookingID == BookingId).FirstOrDefault();
            if (entity != null)
            {
                entity.Status = "cancelled";

                db.Entry(entity).State = EntityState.Modified;
                db.SaveChanges();
            }

            return Json(entity.Status, JsonRequestBehavior.AllowGet);
        }
        [HttpGet]
        public JsonResult GetBookingStatus(int RoomId, DateTime? start, DateTime? end)
        {

            var isbooking = db.Appointments.Where(x => x.RoomID == RoomId && x.Status != "cancelled")
                                               .Any(s => (s.Start >= start && s.End <= end)
                                                 || (s.End <= end && s.End >= start));


            return Json(isbooking, JsonRequestBehavior.AllowGet);
        }
       
        //[HttpPost]
        //public ActionResult Excel_Export_Save(string contentType, string base64, string fileName)
        //{
        //    var fileContents = Convert.FromBase64String(base64);

        //    return File(fileContents, contentType, fileName);
        //}

        //[HttpPost]
        //public ActionResult Pdf_Export_Save(string contentType, string base64, string fileName)
        //{
        //    var fileContents = Convert.FromBase64String(base64);

        //    return File(fileContents, contentType, fileName);
        //}

        protected override void Dispose(bool disposing)
        {
            db.Dispose();
            base.Dispose(disposing);
        }
    }
}
