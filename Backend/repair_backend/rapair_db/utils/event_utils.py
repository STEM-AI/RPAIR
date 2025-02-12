from ..models import Competition , CompetitionEvent
from datetime import datetime, timedelta
from ..models import EventGame , TeamworkTeamScore , Team
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Avg
from django.db import IntegrityError

def get_object(competition_name = None , event_name = None):
        if competition_name :
            try:
                return Competition.objects.get(name=competition_name)
            except Competition.DoesNotExist:
                return None
            
        if event_name :
             try:
                return CompetitionEvent.objects.get(name=event_name)
             except CompetitionEvent.DoesNotExist:
                return None


def teamwork_schedule( event ,event_teams , game_time , stage):
    games = []
    for i in range(len(event_teams)):
        for j in range(i + 1, len(event_teams)):
            games.append(EventGame(event= event ,team1=event_teams[i], team2=event_teams[j], time=game_time.time() , stage=stage))
            game_time += timedelta(minutes=1, seconds=30)   

    return games

def skills_schedule(event , game_time , stage):
    event_teams = event.teams.order_by('?')
    games = []
    for i in range(len(event_teams)):
        games.append(EventGame(event= event ,team1=event_teams[i], team2=None, time=game_time.time() , stage=stage))
        game_time += timedelta(minutes=1, seconds=30)
    
    return games
        

def create_schedule(event, stage=None , time=None):
    game_time = time
    try:
        game_time = datetime.strptime(game_time, "%H:%M")
    except ValueError:
        return Response({"error": "Invalid time format. Please use HH:MM."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        if stage in ('skills'):
            games = skills_schedule(event, game_time, stage)

        elif stage == 'final':
            teams = (
                Team.objects
                .select_related('competition_event')
                .prefetch_related('teamwork_scores')
                .filter(competition_event__name=event.name)
                .annotate(avg_score=Avg('teamwork_scores__score'))
                .order_by('-avg_score')[:3]

            )
            games = teamwork_schedule(event, teams, game_time, stage)
            

        elif stage == 'teamwork':
            teams = event.teams.all()
            games = teamwork_schedule(event, teams, game_time, stage)

        else:
            return Response({"error": "Invalid stage provided."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            stage_games = EventGame.objects.bulk_create(games)
            return stage_games  # Return the created objects

        except IntegrityError as e:
            raise IntegrityError(
                f"Failed to create schedule due to database constraints: {str(e)}"
            )

    except Exception as e:
        raise Exception(f"An error occurred: {str(e)}")


# .annotate(total_score=F('teamwork_score')+ F('interview_score')+F('inspect_score')+F('eng_note_book_score'))
