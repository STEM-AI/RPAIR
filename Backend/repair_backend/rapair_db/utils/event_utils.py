from ..models import Competition , CompetitionEvent
from datetime import datetime, timedelta
from ..models import EventGame
from rest_framework.response import Response
from rest_framework import status
from django.utils.timezone import now
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
                c.name AS competition_name, 
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
                c.name, 
                e.start_date, 
                e.end_date;
                """

def create_event_schedule(event , request):
    event_teams = event.teams.all() 
    print("event_teams" , event_teams)
    game_time = request.data.get('time')
    game_time = datetime.strptime(game_time,"%H:%M")
    print("game_time" , game_time.time())
    games = []
    for i in range(len(event_teams)):
        for j in range(i + 1, len(event_teams)):
            games.append(EventGame(event= event ,team1=event_teams[i], team2=event_teams[j], time=game_time.time()))
            game_time += timedelta(minutes=1, seconds=30)
    
    print("games" , games)
    try :
        EventGame.objects.bulk_create(games)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
def create_final_stage_schedule(event , request):
    event_teams = event.teams.all().order('-teamwork_score')[:3] 
    print("event_teams" , event_teams)
    game_time = request.data.get('time')
    game_time = datetime.strptime(game_time,"%H:%M")
    print("game_time" , game_time.time())
    games = []
    for i in range(len(event_teams)):
        games.append(EventGame(event= event ,team1=event_teams[i], team2=None, time=game_time.time()))
        game_time += timedelta(minutes=1, seconds=30)
    
    print("games" , games)
    try :
        EventGame.objects.bulk_create(games)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)