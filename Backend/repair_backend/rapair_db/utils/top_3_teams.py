from ..models import Competition


def get_object(self, competition_name):
        try:
            return Competition.objects.get(name=competition_name)
        except Competition.DoesNotExist:
            return None

QUERY = """
        SELECT 
            c.name AS competition_name, 
            e.start_date, 
            e.end_date, 
            COALESCE(
                array_to_json(array_agg(ROW(t.name, t.score) ORDER BY t.score DESC)), 
                '[]'::json
            ) AS top_three_teams
        FROM 
            rapair_db_competition c
        JOIN 
            rapair_db_competitionevent e ON c.id = e.competition_id
        LEFT JOIN 
            (
            SELECT 
                team.id, 
                team.name, 
                team.score, 
                team.competition_event_id, 
                ROW_NUMBER() OVER (PARTITION BY team.competition_event_id ORDER BY team.score DESC) AS rank
            FROM 
                rapair_db_team team
            ) t ON e.id = t.competition_event_id
        WHERE 
            c.name = %s
            AND t.rank <= 3
        GROUP BY 
            c.name, 
            e.start_date, 
            e.end_date
        """