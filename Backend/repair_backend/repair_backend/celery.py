from __future__ import absolute_import, unicode_literals
import os
from celery import Celery
from celery.schedules import crontab

# Set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'repair_backend.settings')

app = Celery('repair_backend')
app.conf.update(
    worker_redirect_stdouts=True,
    worker_log_format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    worker_task_log_format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
# Namespace 'CELERY' means all celery-related configs start with CELERY_
app.config_from_object('django.conf:settings', namespace='CELERY')

# Schedule the management command to run daily at midnight
app.conf.beat_schedule = {
    'create-schedule-daily': {
        'task': 'vex_iq_comp_websocket.tasks.run_create_schedule_command',
        'schedule': crontab(hour=0, minute=0),  # Run daily at midnight
    },
}


# Automatically discover tasks in installed apps
app.autodiscover_tasks()

@app.task(bind=True)
def debug_task(self):
    print(f'Request: {self.request!r}')
