from rest_framework import serializers
from ...models import Team , TeamMember
from .. import OrganizationTeamSerializer 
from .team_coach_serializers import TeamCoachSerializer 
from .team_member_serializers import TeamMemberSerializer
from .team_social_media_serializers import TeamSocialMediaSerializer
from .team_prev_comp_serializers import TeamPreviousCompetitionSerializer
from .team_sponsor_serializers import TeamSponsorSerializer
from ..competition_serializers.competitions_serializers import CompetitionsSerializer
from django.db import transaction

import logging
logger = logging.getLogger(__name__)

class TeamMinimalSerializer(serializers.ModelSerializer):
    is_completed = serializers.SerializerMethodField()
    class Meta:
        model = Team
        fields = ['id','name','is_completed']

    def get_is_completed(self,obj):
        if obj.competition_event.count() > 0:
            return [
                {
                    'id': event.id,
                    'name': event.name,
                    'is_completed': event.is_completed
                } for event in obj.competition_event.all()
            ]
        return []

class TeamSerializer(serializers.ModelSerializer):
    organization = OrganizationTeamSerializer(read_only=True)
    organization_id = serializers.IntegerField(write_only=True, required=True)
    competition = CompetitionsSerializer(read_only=True)
    sponsors = TeamSponsorSerializer(many=True, required=False) 
    coach = TeamCoachSerializer(many=True, required=False)
    social_media = TeamSocialMediaSerializer(many=True, required=False)
    previous_competition = TeamPreviousCompetitionSerializer(many=True, required=False)
    members = TeamMemberSerializer(many=True, required=False)
    competition_event = serializers.SerializerMethodField()
    team_number = serializers.CharField(required=False, allow_null=True)
    image = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Team
        fields = [
            'name', 'robot_name', 'user_id', 'type', 'organization_id', 'organization', 'team_leader_name', 'team_leader_email',
            'team_leader_phone_number', 'competition', 'sponsors', 'coach', 'social_media',
            'previous_competition', 'members', 'competition_event', 'id', 'team_number', 'image'
        ]

        extra_kwargs = {
            'user_id': {'required': False},
            'organization_id': {'required': True},
            'organization': {'required': False},
            'competition': {'required': False},
            'sponsors': {'required': False},
            'coach': {'required': False},
            'social_media': {'required': False},
            'previous_competition': {'required': False},
            'team_number': {'required': False},
            'image': {'required': False},
        }

    def validate(self, attrs):
        logger.info("VALIDATING SERIALIZER DATA:")
        for key, value in attrs.items():
            logger.info(f"{key}: {type(value)} - {value}")
        return attrs

    def create(self, validated_data):
        logger.info(f"validated_data :{validated_data}")
        logger.info(f"self.context :{self.context}")
        user = self.context['request'].user
        sponsors_info = validated_data.pop('sponsors', None)
        coachs_info = validated_data.pop('coach', None)
        social_media_info = validated_data.pop('social_media', None)    
        previous_competition_info = validated_data.pop('previous_competition', None)
        members_info = validated_data.pop('members', None)
        
        with transaction.atomic():
            team = self.Meta.model(**validated_data)
            if self.context["event"]:
                team.event = self.context["event"]

            if sponsors_info:
                logger.info(f"sponsors_info :{sponsors_info}")
                team.sponsors_info = sponsors_info
            # Create the new coach object from current user
            user_coach = {
                'name': user.username,
                'email': user.email,
                'phone_number': user.phone_number if hasattr(user, 'phone_number') else None,
                'position': 'primary'
            }
            logger.info(f"user_coach :{user_coach}")

            if coachs_info:
                # Ensure coachs_info is always a list
                if not isinstance(coachs_info, list):
                    coachs_info = [coachs_info]
                logger.info(f"coachs_info before :{coachs_info}")
                # Check if current user already exists in the coaches list
                user_exists = False
                for coach in coachs_info:
                    if coach.get('email') == user.email:
                        user_exists = True
                        break

                logger.info(f"user_exists :{user_exists}")
                # If user doesn't exist, add them to the list
                if not user_exists:
                    coachs_info.append(user_coach)
                logger.info(f"coachs_info after :{coachs_info}")
                team.coachs_info = coachs_info
            else:
                # If no coaches exist, create new list with current user
                team.coachs_info = [user_coach]
                logger.info(f"team.coachs_info :{team.coachs_info}")
            if social_media_info:
                logger.info(f"social_media_info :{social_media_info}")
                team.social_media_info = social_media_info
            if previous_competition_info:
                logger.info(f"previous_competition_info :{previous_competition_info}")
                team.previous_competition_info = previous_competition_info
            if members_info:
                logger.info(f"members_info :{members_info}")
                team.members_info = members_info

            team.save()
            return team

    def update(self, instance, validated_data):
        logger.info(f"Updating team with data: {validated_data}")
        
        # Extract related data
        sponsors_data = validated_data.pop('sponsors', None)
        coaches_data = validated_data.pop('coach', None)
        social_media_data = validated_data.pop('social_media', None)
        previous_competition_data = validated_data.pop('previous_competition', None)
        members_data = validated_data.pop('members', None)

        with transaction.atomic():
            # Update basic team fields
            for attr, value in validated_data.items():
                setattr(instance, attr, value)
            instance.save()

            # Update sponsors
            if sponsors_data is not None:
                # Delete existing sponsors
                instance.sponsors.all().delete()
                # Create new sponsors
                for sponsor_data in sponsors_data:
                    instance.sponsors.create(**sponsor_data)

            # Update coaches
            if coaches_data is not None:
                # Delete existing coaches
                instance.coach.all().delete()
                # Create new coaches
                for coach_data in coaches_data:
                    instance.coach.create(**coach_data)

            # Update social media
            if social_media_data is not None:
                # Delete existing social media
                instance.social_media.all().delete()
                # Create new social media
                for media_data in social_media_data:
                    instance.social_media.create(**media_data)

            # Update previous competitions
            if previous_competition_data is not None:
                # Delete existing previous competitions
                instance.previous_competition.all().delete()
                # Create new previous competitions
                for comp_data in previous_competition_data:
                    instance.previous_competition.create(**comp_data)

            # Update members
            if members_data is not None:
                # Delete existing members
                instance.members.all().delete()
                # Create new members
                for member_data in members_data:
                    instance.members.create(**member_data)

            return instance
    
    def get_competition_event(self,obj):
        try:
            if obj.competition_event.count() > 0:
                return [
                    {
                        'id': event.id,
                        'name': event.name,
                        'competition': event.competition.name,
                        'start_date': event.start_date,
                        'end_date': event.end_date,
                        'location': event.location,
                        'is_live': event.is_live,
                    } for event in obj.competition_event.all()
                ]
            return None
        except Exception as e:
            return str(e)



class TeamMemberCertificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamMember
        fields = ['id','name']

class TeamCertificationSerializer(serializers.ModelSerializer):
    members = TeamMemberCertificationSerializer(many=True,read_only=True)
    competition_name = serializers.SerializerMethodField()
    start_date = serializers.SerializerMethodField()   
    class Meta:
        model = Team
        fields = ['id','name','members','competition_name','start_date','team_leader_name']

    def get_competition_name(self,obj):
        try:
            event = obj.competition_event.filter(id=self.context['event_id']).first()
            return event.competition.name
        except:
            return None

    def get_start_date(self,obj):
        try:
            event = obj.competition_event.filter(id=self.context['event_id']).first()
            return event.start_date
        except:
            return None


