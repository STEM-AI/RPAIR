from rapair_db.models import Competition , CompetitionEvent,EventGame, Team
from datetime import datetime, timedelta
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


def teamwork_schedule( event ,event_teams , game_time , stage, schedule):
    games = []
    for i in range(len(event_teams)):
        for j in range(i + 1, len(event_teams)):
            games.append(EventGame(event= event ,team1=event_teams[i], team2=event_teams[j], time=game_time.time() , stage=stage,paused_time=60, schedule=schedule, duration=60))
            game_time += timedelta(minutes=5)   

    return games

def skills_schedule(event , game_time , stage, schedule):
    print("create skills")
    event_teams = event.teams.order_by('?')
    print("event teams" ,event_teams)
    games = []
    if stage == 'driver_go':
        paused_time = 120
    elif stage in ['driver_iq','coding','auto']:
        paused_time = 60


    for i in range(len(event_teams)):
            games.append(EventGame(event= event ,team1=event_teams[i], team2=None, time=game_time.time() , stage=stage,paused_time=paused_time , schedule=schedule, duration=paused_time))
            game_time += timedelta(minutes=5)

    return games
        

def create_schedule(event, stage=None , time=None, schedule=None):
    print("create schedule")
    game_time = time
    print("game_time",game_time)
    try:
        game_time = datetime.strptime(game_time, "%H:%M")
    except ValueError:
        return Response({"error": "Invalid time format. Please use HH:MM."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        if stage in ['driver_iq','driver_go','auto','coding']:
            print("driver , auto")
            games = skills_schedule(event, game_time, stage, schedule)

        elif stage == 'final':
            teams = (
                Team.objects
                .select_related('competition_event')
                .prefetch_related('teamwork_scores')
                .filter(competition_event__name=event.name)
                .annotate(avg_score=Avg('teamwork_scores__score'))
                .order_by('-avg_score')[:3]

            )
            games = teamwork_schedule(event, teams, game_time, stage, schedule)
            

        elif stage in ['teamwork','coop']:
            print("teamwork , coop")
            teams = event.teams.all()
            games = teamwork_schedule(event, teams, game_time, stage, schedule)
            print("games", games)

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
