from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from ...serializers import CompetitionsSerializer , CompetitionMinimalSerializer
from ...models import Competition
from ...permissions import IsJudgeUser
from rest_framework.generics import ListAPIView , RetrieveAPIView



class CompetitionProfileView(RetrieveAPIView):
    permission_classes = [AllowAny]
    serializer_class = CompetitionsSerializer
    lookup_url_kwarg = 'competition_name'
    lookup_field = 'name'  # Lookup by competition name instead of the default 'pk'
    queryset = Competition.objects.all()

    
class CompetitionsListView(ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = CompetitionMinimalSerializer
    queryset = Competition.objects.all()
    
class CompetitionCreateView(APIView):
    permission_classes = [IsJudgeUser]
    serializer_class = CompetitionsSerializer
    def post(self, request):
        serializer = CompetitionsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

        