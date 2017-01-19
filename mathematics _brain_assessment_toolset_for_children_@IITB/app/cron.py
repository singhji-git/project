from app.views import *
from django_cron import CronJobBase, Schedule
import datetime
import hashlib
import pytz

class MyCronJob(CronJobBase):
    RUN_EVERY_MINS = 1 # every 1 min 

    schedule = Schedule(run_every_mins=RUN_EVERY_MINS)
    code = 'app.my_cron_job'    # a unique code

    def do(self):
        print("Hello World")
        all_users = Profile.objects.all()
        for user in all_users:
        	print (user.last_report_sent)
        	shift_time = datetime.datetime.strftime(user.last_report_sent + datetime.timedelta(minutes=1),"%Y-%m-%d %H:%M:%S")
        	if datetime.datetime.utcnow() > datetime.datetime.strptime(shift_time, "%Y-%m-%d %H:%M:%S"):
        		print (user.user.username)
        	



        