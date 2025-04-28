from celery import shared_task
from django.core.management import call_command
import logging

logger = logging.getLogger(__name__)

@shared_task
def update_event_statuses():
    """
    Celery task to update competition event statuses
    """
    logger.info("Starting update_event_statuses task")
    try:
        call_command('update_event_status')
        logger.info("Successfully completed update_event_statuses task")
    except Exception as e:
        logger.error(f"Error in update_event_statuses task: {str(e)}")
        raise