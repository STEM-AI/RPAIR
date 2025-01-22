from ..models import Competition , CompetitionEvent
from datetime import datetime, timedelta
from ..models import EventGame
from rest_framework.response import Response
from rest_framework import status
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

TOP_3_TEAMS_QUERY = """
            WITH ranked_teams AS (
                SELECT 
                    team.id, 
                    team.name, 
                    (team.teamwork_score + 
                    team.interview_score + 
                    team.inspect_score + 
                    team.eng_note_book_score) AS total_score, 
                    team.competition_event_id,
                    ROW_NUMBER() OVER (
                        PARTITION BY team.competition_event_id 
                        ORDER BY 
                            (team.teamwork_score + 
                            team.interview_score + 
                            team.inspect_score + 
                            team.eng_note_book_score) DESC
                    ) AS rank
                FROM 
                    rapair_db_team team
                WHERE 
                    team.competition_event_id IS NOT NULL
            )
            SELECT 
                e.name, 
                e.start_date, 
                e.end_date, 
                COALESCE(
                    json_agg(
                        jsonb_build_object(
                            'team_name', t.name, 
                            'total_score', t.total_score
                        )
                        ORDER BY t.total_score DESC
                    ) FILTER (WHERE t.rank <= 3), 
                    '[]'::json
                ) AS top_three_teams
            FROM 
                rapair_db_competition c
            JOIN 
                rapair_db_competitionevent e ON c.id = e.competition_id
            LEFT JOIN 
                ranked_teams t ON e.id = t.competition_event_id
            WHERE 
                c.name = %s
            GROUP BY 
                e.name, 
                e.start_date, 
                e.end_date;
                """

def teamwork_schedule( event ,event_teams , game_time , stage):
    games = []
    for i in range(len(event_teams)):
        for j in range(i + 1, len(event_teams)):
            games.append(EventGame(event= event ,team1=event_teams[i], team2=event_teams[j], time=game_time.time() , stage=stage))
            game_time += timedelta(minutes=1, seconds=30)
    
    return games

def skills_or_automation_schedule(event , game_time , stage):
    event_teams = event.teams.order_by('?')
    games = []
    for i in range(len(event_teams)):
        games.append(EventGame(event= event ,team1=event_teams[i], team2=None, time=game_time.time() , stage=stage))
        game_time += timedelta(minutes=1, seconds=30)
    
    return games
        
from django.db import IntegrityError

def create_schedule(event, request):
    stage = request.data.get('stage')
    game_time = request.data.get('time')

    try:
        game_time = datetime.strptime(game_time, "%H:%M")
    except ValueError:
        return Response({"error": "Invalid time format. Please use HH:MM."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        if stage in ('skills', 'automation'):
            games = skills_or_automation_schedule(event, game_time, stage)

        elif stage == 'final':
            event_teams = event.teams.all().order_by('-teamwork_score')[:3]
            games = teamwork_schedule(event, event_teams, game_time, stage)

        elif stage == 'start':
            event_teams = event.teams.all()
            games = teamwork_schedule(event, event_teams, game_time, stage)

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
