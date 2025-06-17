from programming.models import Question,Answer
from django.db import transaction
import logging
logger = logging.getLogger(__name__)
def add_questoins_from_csv(reader):
    try:
        for row in reader:
            logger.info(f"Adding question: {row}")
            with transaction.atomic():
                # Create or get the question
                question, created = Question.objects.get_or_create(
                    text=row['question'],
                    category=row['category'],
                    difficulty=row['difficulty'],
                    type=row['type']
                )
                logger.info(f"Question created:{question} {created}")

                # Create the answer regardless of whether question was just created
                answer = Answer.objects.create(
                    question=question,
                    text=row['answer'],
                    is_correct=row['is_correct'].lower() == 'true'
                )
                logger.info(f"Answer created:{answer}")
    except KeyError as e:
        raise ValueError(f"Missing required field: {e}") from e
    except Exception as e:
        raise ValueError(f"Failed to add question: {e}") from e